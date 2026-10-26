/**
 * Surah admin: read, check and save a surah with its word-by-word verses.
 * Every verse word is linked to the word index (see words.ts) — a verse
 * can't exist without its word — and the change is logged.
 */
import 'server-only';
import { prisma } from '@/lib/prisma';
import { logEdit } from './audit';
import type { AdminSession } from './session';
import { Check } from './validate';
import { relinkWords, removeOrphanWords } from './words';
import type { SaveResult } from './scenarios';

export interface VerseInput {
  ayah: number;
  arabic: string;
  transliteration: string;
  english: string;
  bangla: string;
}

export interface SurahInput {
  slug: string;
  banglaName: string;
  arabicName: string;
  englishName: string;
  mushafNumber: number;
  verses: VerseInput[];
}

const TX = { maxWait: 10_000, timeout: 60_000 };

// The parser lowercases a surah word's first letter (Bismi → bismi): words
// mid-verse aren't sentence starts. Saved verses follow the same rule.
const lowerFirst = (s: string) => s.replace(/^[A-Z]/, (c) => c.toLowerCase());

export function readSurahInput(body: Record<string, unknown>): { data: SurahInput } | { error: string } {
  const c = new Check();
  const data: SurahInput = {
    slug: c.slug(body.slug),
    banglaName: c.text(body.banglaName, 'Bangla name', { required: true }),
    arabicName: c.text(body.arabicName, 'Arabic name', { required: true }),
    englishName: c.text(body.englishName, 'English name', { required: true }),
    mushafNumber: c.int(body.mushafNumber, 'Mushaf number', { min: 1, max: 114 }),
    verses: c.list(
      body.verses,
      'Words',
      (v, row) => ({
        ayah: c.int(v.ayah, `Row ${row}: ayah`, { min: 1, max: 286 }),
        arabic: c.text(v.arabic, `Row ${row}: Arabic`, { required: true }),
        transliteration: lowerFirst(c.text(v.transliteration, `Row ${row}: transliteration`, { required: true })),
        english: c.text(v.english, `Row ${row}: English`),
        bangla: c.text(v.bangla, `Row ${row}: Bangla`),
      }),
      { min: 1, max: 1000 },
    ),
  };
  return c.error ? { error: c.error } : { data };
}

export function listSurahs() {
  return prisma.surah.findMany({
    orderBy: { position: 'asc' },
    select: {
      id: true,
      slug: true,
      banglaName: true,
      arabicName: true,
      englishName: true,
      mushafNumber: true,
      _count: { select: { verses: true } },
    },
  });
}

export async function getSurahInput(id: number): Promise<(SurahInput & { id: number }) | null> {
  const s = await prisma.surah.findUnique({
    where: { id },
    include: { verses: { orderBy: { position: 'asc' } } },
  });
  if (!s) return null;
  return {
    id: s.id,
    slug: s.slug,
    banglaName: s.banglaName,
    arabicName: s.arabicName,
    englishName: s.englishName,
    mushafNumber: s.mushafNumber,
    verses: s.verses.map(({ ayah, arabic, transliteration, english, bangla }) => ({
      ayah,
      arabic,
      transliteration,
      english,
      bangla,
    })),
  };
}

/** Create (id null) or update a surah. */
export async function saveSurah(admin: AdminSession, id: number | null, data: SurahInput): Promise<SaveResult> {
  const slugClash = await prisma.surah.findUnique({ where: { slug: data.slug }, select: { id: true } });
  if (slugClash && slugClash.id !== id) return { error: `Another surah already uses the slug "${data.slug}"`, status: 409 };
  const numberClash = await prisma.surah.findUnique({ where: { mushafNumber: data.mushafNumber }, select: { id: true } });
  if (numberClash && numberClash.id !== id) return { error: `Surah ${data.mushafNumber} is already in the list`, status: 409 };
  if (id !== null && !(await prisma.surah.findUnique({ where: { id }, select: { id: true } }))) {
    return { error: 'Surah not found', status: 404 };
  }

  const fields = {
    slug: data.slug,
    banglaName: data.banglaName,
    arabicName: data.arabicName,
    englishName: data.englishName,
    mushafNumber: data.mushafNumber,
  };

  const savedId = await prisma.$transaction(async (tx) => {
    let surahId: number;
    if (id === null) {
      const last = await tx.surah.aggregate({ _max: { position: true } });
      surahId = (await tx.surah.create({ data: { ...fields, position: (last._max.position ?? -1) + 1 } })).id;
    } else {
      surahId = (await tx.surah.update({ where: { id }, data: fields })).id;
    }

    // Old verses hold their words; clear them before the words are re-linked.
    const oldVerseWords = await tx.surahVerse.findMany({ where: { surahId }, select: { wordId: true } });
    await tx.surahVerse.deleteMany({ where: { surahId } });

    const { wordIds, touched } = await relinkWords(
      tx,
      { source: 'surah', surahId, slug: data.slug },
      data.verses.map((v) => ({
        arabic: v.arabic,
        transliteration: v.transliteration,
        english: v.english,
        bangla: v.bangla,
        verse: v.ayah,
      })),
    );
    await tx.surahVerse.createMany({
      data: data.verses.map((v, position) => ({ surahId, position, wordId: wordIds[position], ...v })),
    });
    await removeOrphanWords(tx, [...touched, ...oldVerseWords.map((v) => v.wordId)]);

    await logEdit(tx, admin, 'surahs', id === null ? 'create' : 'update', data.slug,
      `${id === null ? 'Created' : 'Updated'} surah ${data.mushafNumber}: ${data.englishName}`);
    return surahId;
  }, TX);

  return { id: savedId };
}

export async function deleteSurah(admin: AdminSession, id: number): Promise<boolean> {
  const s = await prisma.surah.findUnique({ where: { id }, select: { slug: true, mushafNumber: true, englishName: true } });
  if (!s) return false;
  await prisma.$transaction(async (tx) => {
    const verseWords = await tx.surahVerse.findMany({ where: { surahId: id }, select: { wordId: true } });
    const { touched } = await relinkWords(tx, { source: 'surah', surahId: id, slug: s.slug }, []);
    await tx.surah.delete({ where: { id } }); // verses go with it
    await removeOrphanWords(tx, [...touched, ...verseWords.map((v) => v.wordId)]);
    await logEdit(tx, admin, 'surahs', 'delete', s.slug, `Deleted surah ${s.mushafNumber}: ${s.englishName}`);
  }, TX);
  return true;
}

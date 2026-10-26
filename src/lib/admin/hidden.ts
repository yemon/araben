/**
 * "Hidden in Bangla" admin: the categories of Arabic words hidden in Bangla
 * (each entry linked to the word index, see words.ts), and the three side
 * lists — Persian-not-Arabic, mixed words, and English words from Arabic.
 */
import 'server-only';
import { prisma } from '@/lib/prisma';
import { logEdit } from './audit';
import type { AdminSession } from './session';
import { Check } from './validate';
import { relinkWords, removeOrphanWords } from './words';
import type { SaveResult } from './scenarios';

const TX = { maxWait: 10_000, timeout: 60_000 };

// ---------- Categories ----------

export interface HiddenEntryInput {
  bangla: string;
  arabic: string;
  transliteration: string;
  arabicMeaning: string;
  note: string;
}

export interface HiddenCategoryInput {
  slug: string;
  title: string;
  entries: HiddenEntryInput[];
}

export function readHiddenCategoryInput(body: Record<string, unknown>): { data: HiddenCategoryInput } | { error: string } {
  const c = new Check();
  const data: HiddenCategoryInput = {
    slug: c.slug(body.slug),
    title: c.text(body.title, 'Title', { required: true }),
    entries: c.list(
      body.entries,
      'Words',
      (e, row) => ({
        bangla: c.text(e.bangla, `Row ${row}: Bangla word`, { required: true }),
        arabic: c.text(e.arabic, `Row ${row}: Arabic`, { required: true }),
        transliteration: c.text(e.transliteration, `Row ${row}: transliteration`),
        arabicMeaning: c.longText(e.arabicMeaning, `Row ${row}: Arabic meaning`),
        note: c.longText(e.note, `Row ${row}: note`),
      }),
      { min: 1, max: 500 },
    ),
  };
  return c.error ? { error: c.error } : { data };
}

export function listHiddenCategories() {
  return prisma.hiddenCategory.findMany({
    orderBy: { position: 'asc' },
    select: { id: true, slug: true, title: true, _count: { select: { entries: true } } },
  });
}

export async function getHiddenCategoryInput(id: number): Promise<(HiddenCategoryInput & { id: number }) | null> {
  const h = await prisma.hiddenCategory.findUnique({
    where: { id },
    include: { entries: { orderBy: { position: 'asc' } } },
  });
  if (!h) return null;
  return {
    id: h.id,
    slug: h.slug,
    title: h.title,
    entries: h.entries.map(({ bangla, arabic, transliteration, arabicMeaning, note }) => ({
      bangla,
      arabic,
      transliteration,
      arabicMeaning,
      note,
    })),
  };
}

export async function saveHiddenCategory(admin: AdminSession, id: number | null, data: HiddenCategoryInput): Promise<SaveResult> {
  const clash = await prisma.hiddenCategory.findUnique({ where: { slug: data.slug }, select: { id: true } });
  if (clash && clash.id !== id) return { error: `Another category already uses the slug "${data.slug}"`, status: 409 };
  if (id !== null && !(await prisma.hiddenCategory.findUnique({ where: { id }, select: { id: true } }))) {
    return { error: 'Category not found', status: 404 };
  }

  const savedId = await prisma.$transaction(async (tx) => {
    let categoryId: number;
    if (id === null) {
      const last = await tx.hiddenCategory.aggregate({ _max: { position: true } });
      categoryId = (
        await tx.hiddenCategory.create({
          data: { slug: data.slug, title: data.title, position: (last._max.position ?? -1) + 1 },
        })
      ).id;
    } else {
      categoryId = (await tx.hiddenCategory.update({ where: { id }, data: { slug: data.slug, title: data.title } })).id;
    }

    await tx.hiddenEntry.deleteMany({ where: { categoryId } });
    await tx.hiddenEntry.createMany({
      data: data.entries.map((e, position) => ({ categoryId, position, ...e })),
    });

    // As in the parser: the word's English is the Arabic meaning, and the
    // appearance remembers which Bangla word it hides in.
    const { touched } = await relinkWords(
      tx,
      { source: 'hidden', hiddenCategoryId: categoryId, slug: data.slug },
      data.entries.map((e) => ({
        arabic: e.arabic,
        transliteration: e.transliteration,
        english: e.arabicMeaning,
        bangla: e.bangla,
        banglaWord: e.bangla,
      })),
    );
    await removeOrphanWords(tx, touched);

    await logEdit(tx, admin, 'hidden', id === null ? 'create' : 'update', data.slug,
      `${id === null ? 'Created' : 'Updated'} hidden-word category: ${data.title}`);
    return categoryId;
  }, TX);

  return { id: savedId };
}

export async function deleteHiddenCategory(admin: AdminSession, id: number): Promise<boolean> {
  const h = await prisma.hiddenCategory.findUnique({ where: { id }, select: { slug: true, title: true } });
  if (!h) return false;
  await prisma.$transaction(async (tx) => {
    const { touched } = await relinkWords(tx, { source: 'hidden', hiddenCategoryId: id, slug: h.slug }, []);
    await tx.hiddenCategory.delete({ where: { id } }); // entries go with it
    await removeOrphanWords(tx, touched);
    await logEdit(tx, admin, 'hidden', 'delete', h.slug, `Deleted hidden-word category: ${h.title}`);
  }, TX);
  return true;
}

// ---------- Side lists ----------

export const HIDDEN_LISTS = {
  persian: {
    title: 'Persian, not Arabic',
    description: 'Bangla words people take for Arabic that actually came from Persian.',
    columns: [
      { key: 'bangla', label: 'Bangla word', long: false, required: true },
      { key: 'persian', label: 'Persian origin', long: false, required: true },
      { key: 'note', label: 'Note', long: true, required: false },
    ],
  },
  mixed: {
    title: 'Mixed words',
    description: 'Bangla words built from an Arabic part and a part from elsewhere.',
    columns: [
      { key: 'bangla', label: 'Bangla word', long: false, required: true },
      { key: 'structure', label: 'How it is built', long: true, required: true },
      { key: 'note', label: 'Note', long: true, required: false },
    ],
  },
  english: {
    title: 'English from Arabic',
    description: 'English words that came from Arabic.',
    columns: [
      { key: 'english', label: 'English word', long: false, required: true },
      { key: 'arabic', label: 'Arabic origin', long: false, required: true },
      { key: 'meaning', label: 'Meaning', long: true, required: false },
    ],
  },
} as const;

export type HiddenListKey = keyof typeof HIDDEN_LISTS;
export type HiddenListRow = Record<string, string>;

export const isHiddenListKey = (k: string): k is HiddenListKey => k in HIDDEN_LISTS;

export async function getHiddenList(key: HiddenListKey): Promise<HiddenListRow[]> {
  const byPosition = { orderBy: { position: 'asc' as const } };
  if (key === 'persian') {
    return (await prisma.hiddenPersianWord.findMany(byPosition)).map(({ bangla, persian, note }) => ({ bangla, persian, note }));
  }
  if (key === 'mixed') {
    return (await prisma.hiddenMixedWord.findMany(byPosition)).map(({ bangla, structure, note }) => ({ bangla, structure, note }));
  }
  return (await prisma.hiddenEnglishWord.findMany(byPosition)).map(({ english, arabic, meaning }) => ({ english, arabic, meaning }));
}

export function readHiddenListInput(key: HiddenListKey, body: Record<string, unknown>): { data: HiddenListRow[] } | { error: string } {
  const c = new Check();
  const { columns } = HIDDEN_LISTS[key];
  const data = c.list(body.rows, 'Rows', (r, row) => {
    const out: HiddenListRow = {};
    for (const col of columns) {
      const label = `Row ${row}: ${col.label}`;
      out[col.key] = col.long
        ? c.longText(r[col.key], label, { required: col.required })
        : c.text(r[col.key], label, { required: col.required });
    }
    return out;
  });
  return c.error ? { error: c.error } : { data };
}

/** Replace a side list with the given rows, in order. */
export async function saveHiddenList(admin: AdminSession, key: HiddenListKey, rows: HiddenListRow[]) {
  await prisma.$transaction(async (tx) => {
    const data = rows.map((r, position) => ({ ...r, position }));
    if (key === 'persian') {
      await tx.hiddenPersianWord.deleteMany();
      await tx.hiddenPersianWord.createMany({ data: data as { position: number; bangla: string; persian: string; note: string }[] });
    } else if (key === 'mixed') {
      await tx.hiddenMixedWord.deleteMany();
      await tx.hiddenMixedWord.createMany({ data: data as { position: number; bangla: string; structure: string; note: string }[] });
    } else {
      await tx.hiddenEnglishWord.deleteMany();
      await tx.hiddenEnglishWord.createMany({ data: data as { position: number; english: string; arabic: string; meaning: string }[] });
    }
    await logEdit(tx, admin, 'hidden', 'update', key, `Updated ${HIDDEN_LISTS[key].title} (${rows.length} rows)`);
  }, TX);
}

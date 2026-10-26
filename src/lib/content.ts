// Server-only content loader. Reads the learning content from the database
// (seeded from content/*.json by prisma/seed-content.mjs) and returns it in
// the same shapes the JSON files have.
import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '@/lib/prisma';
import type {
  Appearance,
  Word,
  Surah,
  Scenario,
  Basics,
  HiddenData,
  Root,
  DialogueTurn,
} from '@/types/content';

const contentDir = path.join(process.cwd(), 'content');

interface ContentSnapshot {
  words: Word[];
  surahs: Surah[];
  scenarios: Scenario[];
  basics: Basics;
  hidden: HiddenData;
  roots: Root[];
  wordBySlug: Map<string, Word>;
}

// The whole content set is small (about a thousand words), so it is loaded
// in one go and shared by every page rendered in the next CACHE_MS. A
// re-seed shows up once that runs out.
const CACHE_MS = process.env.NODE_ENV === 'development' ? 2_000 : 60_000;
let cached: { at: number; snapshot: Promise<ContentSnapshot> } | null = null;

function snapshot(): Promise<ContentSnapshot> {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.snapshot;
  const entry = { at: Date.now(), snapshot: loadSnapshot() };
  cached = entry;
  // A failed load isn't cached: the next call tries again.
  entry.snapshot.catch(() => {
    if (cached === entry) cached = null;
  });
  return entry.snapshot;
}

const byPosition = { orderBy: { position: 'asc' as const } };

const turn = (t: DialogueTurn): DialogueTurn => ({
  speaker: t.speaker,
  arabic: t.arabic,
  transliteration: t.transliteration,
  english: t.english,
  bangla: t.bangla,
});

async function loadSnapshot(): Promise<ContentSnapshot> {
  const [
    wordRows,
    surahRows,
    basicsRows,
    dialogueRows,
    scenarioRows,
    hiddenRows,
    persianRows,
    mixedRows,
    englishRows,
    rootRows,
  ] = await Promise.all([
    prisma.word.findMany({
      ...byPosition,
      include: {
        root: { select: { slug: true } },
        appearances: {
          ...byPosition,
          include: {
            surah: { select: { slug: true, banglaName: true } },
            basicsCategory: { select: { slug: true } },
            scenario: { select: { slug: true } },
            hiddenCategory: { select: { slug: true } },
            root: { select: { slug: true } },
          },
        },
      },
    }),
    prisma.surah.findMany({
      ...byPosition,
      include: { verses: { ...byPosition, include: { word: { select: { slug: true } } } } },
    }),
    prisma.basicsCategory.findMany({
      ...byPosition,
      include: { words: { ...byPosition, include: { word: { select: { slug: true } } } } },
    }),
    prisma.basicsDialogue.findMany({ ...byPosition, include: { turns: byPosition } }),
    prisma.scenario.findMany({ ...byPosition, include: { turns: byPosition } }),
    prisma.hiddenCategory.findMany({ ...byPosition, include: { entries: byPosition } }),
    prisma.hiddenPersianWord.findMany(byPosition),
    prisma.hiddenMixedWord.findMany(byPosition),
    prisma.hiddenEnglishWord.findMany(byPosition),
    prisma.root.findMany({ ...byPosition, include: { family: byPosition } }),
  ]);

  const words: Word[] = wordRows.map((w) => ({
    slug: w.slug,
    arabic: w.arabic,
    transliteration: w.transliteration,
    english: w.english,
    bangla: w.bangla,
    appearances: w.appearances.map((a): Appearance => {
      switch (a.source) {
        case 'surah':
          return { source: 'surah', surah: a.surah!.slug, surahName: a.surah!.banglaName, verse: a.verse };
        case 'basics':
          return { source: 'basics', category: a.basicsCategory!.slug };
        case 'scenario':
          return { source: 'scenario', scenario: a.scenario!.slug };
        case 'hidden':
          return { source: 'hidden', category: a.hiddenCategory!.slug, banglaWord: a.banglaWord ?? '' };
        case 'root':
          return { source: 'root', root: a.root!.slug, pattern: a.pattern ?? '' };
        default:
          throw new Error(`Word "${w.slug}" has an appearance with unknown source "${a.source}"`);
      }
    }),
    ...(w.root ? { root: w.root.slug } : {}),
  }));

  return {
    words,
    wordBySlug: new Map(words.map((w) => [w.slug, w])),
    surahs: surahRows.map((s) => ({
      slug: s.slug,
      banglaName: s.banglaName,
      arabicName: s.arabicName,
      englishName: s.englishName,
      mushafNumber: s.mushafNumber,
      verses: s.verses.map((v) => ({
        ayah: v.ayah,
        wordSlug: v.word.slug,
        arabic: v.arabic,
        transliteration: v.transliteration,
        english: v.english,
        bangla: v.bangla,
      })),
    })),
    scenarios: scenarioRows.map((s) => ({
      slug: s.slug,
      number: s.number,
      banglaTitle: s.banglaTitle,
      englishTitle: s.englishTitle,
      turns: s.turns.map(turn),
      newWordsNote: s.newWordsNote,
    })),
    basics: {
      categories: basicsRows.map((b) => ({
        slug: b.slug,
        title: b.title,
        wordSlugs: b.words.map((l) => l.word.slug),
      })),
      dialogues: dialogueRows.map((d) => ({ slug: d.slug, title: d.title, turns: d.turns.map(turn) })),
    },
    hidden: {
      categories: hiddenRows.map((h) => ({
        slug: h.slug,
        title: h.title,
        entries: h.entries.map((e) => ({
          bangla: e.bangla,
          arabic: e.arabic,
          transliteration: e.transliteration,
          arabicMeaning: e.arabicMeaning,
          note: e.note,
        })),
      })),
      persianNotArabic: persianRows.map((x) => ({ bangla: x.bangla, persian: x.persian, note: x.note })),
      mixed: mixedRows.map((x) => ({ bangla: x.bangla, structure: x.structure, note: x.note })),
      english: englishRows.map((x) => ({ english: x.english, arabic: x.arabic, meaning: x.meaning })),
    },
    roots: rootRows.map((r) => ({
      slug: r.slug,
      arabic: r.arabic,
      latin: r.latin,
      meaning: r.meaning,
      ...(r.sortOrder === null ? {} : { order: r.sortOrder }),
      ...(r.familyGlance === null ? {} : { familyGlance: r.familyGlance }),
      family: r.family.map((m) => ({
        arabic: m.arabic,
        transliteration: m.transliteration,
        pattern: m.pattern,
        meaning: m.meaning,
        note: m.note,
      })),
    })),
  };
}

export async function getAllWords(): Promise<Word[]> {
  return (await snapshot()).words;
}
export async function getWord(slug: string): Promise<Word | undefined> {
  return (await snapshot()).wordBySlug.get(slug);
}
export async function getAllSurahs(): Promise<Surah[]> {
  return (await snapshot()).surahs;
}
export async function getSurah(slug: string): Promise<Surah | undefined> {
  return (await getAllSurahs()).find((s) => s.slug === slug);
}
export async function getAllScenarios(): Promise<Scenario[]> {
  return (await snapshot()).scenarios;
}
export async function getScenario(slug: string): Promise<Scenario | undefined> {
  return (await getAllScenarios()).find((s) => s.slug === slug);
}
export async function getBasics(): Promise<Basics> {
  return (await snapshot()).basics;
}
export async function getBasicsCategory(slug: string) {
  return (await getBasics()).categories.find((c) => c.slug === slug);
}
export async function getHidden(): Promise<HiddenData> {
  return (await snapshot()).hidden;
}
export async function getHiddenCategory(slug: string) {
  return (await getHidden()).categories.find((c) => c.slug === slug);
}
export async function getAllRoots(): Promise<Root[]> {
  return (await snapshot()).roots;
}
export async function getRoot(slug: string): Promise<Root | undefined> {
  return (await getAllRoots()).find((r) => r.slug === slug);
}

export async function getRelatedWords(word: Word, limit = 8): Promise<Word[]> {
  const words = await getAllWords();
  const scored: { word: Word; score: number }[] = [];
  for (const w of words) {
    if (w.slug === word.slug) continue;
    let s = 0;
    // Same root
    if (word.root && w.root === word.root) s += 5;
    // Shared appearances
    for (const a of word.appearances || []) {
      for (const b of w.appearances || []) {
        if (a.source === 'surah' && b.source === 'surah' && a.surah === b.surah) s += 1;
        if (
          a.source === 'scenario' &&
          b.source === 'scenario' &&
          a.scenario === b.scenario
        )
          s += 2;
        if (
          a.source === 'basics' &&
          b.source === 'basics' &&
          a.category === b.category
        )
          s += 1;
      }
    }
    if (s > 0) scored.push({ word: w, score: s });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.word);
}

// Audio files aren't content rows: the manifest maps word slugs to files in
// public/audio, written by scripts/generate-audio.mjs.
let _audioManifest: Record<string, string> | null = null;
export function getAudioManifest(): Record<string, string> {
  if (_audioManifest) return _audioManifest;
  const p = path.join(contentDir, 'audio-manifest.json');
  if (!fs.existsSync(p)) {
    _audioManifest = {};
    return _audioManifest;
  }
  _audioManifest = JSON.parse(fs.readFileSync(p, 'utf8'));
  return _audioManifest!;
}

export function hasAudio(slug: string): boolean {
  return Boolean(getAudioManifest()[slug]);
}

export function audioUrl(slug: string): string | null {
  const m = getAudioManifest();
  return m[slug] ? `/audio/${m[slug]}` : null;
}

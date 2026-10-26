/**
 * Keeps the word index in step with admin edits.
 *
 * Words aren't edited directly: scripts/parse-content.mjs builds them from
 * the guide, one per distinct (arabic, transliteration), each with a list of
 * appearances (this surah verse, that scenario…). Word pages, search and the
 * "appears in" links all read that index, so saving a scenario, surah or
 * hidden-word category re-links its words the way the parser would:
 *
 *   1. drop every appearance pointing at the section;
 *   2. for each turn / verse / entry, find its word (exact Arabic and
 *      transliteration) or create one, and give it a fresh appearance;
 *   3. delete words that end up appearing nowhere.
 *
 * An existing word's text is left alone — it may be shared with other
 * sections — so only new words take their meaning from the item.
 */
import 'server-only';
import type { Prisma } from '@prisma/client';
import { slugify } from '@/lib/slugify';

type Tx = Prisma.TransactionClient;

export type WordSection =
  | { source: 'surah'; surahId: number; slug: string }
  | { source: 'scenario'; scenarioId: number; slug: string }
  | { source: 'hidden'; hiddenCategoryId: number; slug: string };

export interface WordItem {
  arabic: string;
  transliteration: string;
  english: string;
  bangla: string;
  verse?: number; // surah only
  banglaWord?: string; // hidden only
}

const refOf = (section: WordSection) =>
  section.source === 'surah'
    ? { surahId: section.surahId }
    : section.source === 'scenario'
      ? { scenarioId: section.scenarioId }
      : { hiddenCategoryId: section.hiddenCategoryId };

// The parser's context suffix for a colliding slug.
const contextOf = (section: WordSection) =>
  section.source === 'hidden' ? `hidden-${section.slug}` : section.slug;

async function uniqueWordSlug(tx: Tx, base: string, context: string): Promise<string> {
  const taken = async (slug: string) => Boolean(await tx.word.findUnique({ where: { slug }, select: { id: true } }));
  if (!(await taken(base))) return base;
  if (context && !(await taken(`${base}-${context}`))) return `${base}-${context}`;
  for (let i = 2; ; i++) {
    if (!(await taken(`${base}-${i}`))) return `${base}-${i}`;
  }
}

async function findOrCreateWord(tx: Tx, item: WordItem, context: string): Promise<number> {
  // The column collation ignores some differences (case, Latin accents), so
  // the database narrows the search and the exact match is made here.
  const candidates = await tx.word.findMany({
    where: { arabic: item.arabic },
    select: { id: true, arabic: true, transliteration: true },
  });
  const exact = candidates.find(
    (w) => w.arabic === item.arabic && w.transliteration === item.transliteration,
  );
  if (exact) return exact.id;

  const slug = await uniqueWordSlug(tx, slugify(item.transliteration || item.arabic) || 'word', context);
  const last = await tx.word.aggregate({ _max: { position: true } });
  const word = await tx.word.create({
    data: {
      slug,
      position: (last._max.position ?? -1) + 1,
      arabic: item.arabic,
      transliteration: item.transliteration,
      english: item.english,
      bangla: item.bangla,
    },
    select: { id: true },
  });
  return word.id;
}

/**
 * Steps 1 and 2. Returns each item's word id (in item order) and the words
 * that lost an appearance — pass those to removeOrphanWords once the
 * section's own rows (verses…) are written.
 */
export async function relinkWords(
  tx: Tx,
  section: WordSection,
  items: WordItem[],
): Promise<{ wordIds: number[]; touched: number[] }> {
  const ref = refOf(section);
  const before = await tx.wordAppearance.findMany({ where: ref, select: { wordId: true } });
  await tx.wordAppearance.deleteMany({ where: ref });

  const context = contextOf(section);
  const nextPosition = new Map<number, number>();
  const added = new Set<string>();
  const wordIds: number[] = [];

  for (const item of items) {
    const wordId = await findOrCreateWord(tx, item, context);
    wordIds.push(wordId);

    // The parser drops an appearance identical to one the word already has
    // (the same word twice in one verse, say).
    const key = `${wordId}|${item.verse ?? ''}|${item.banglaWord ?? ''}`;
    if (added.has(key)) continue;
    added.add(key);

    if (!nextPosition.has(wordId)) {
      const last = await tx.wordAppearance.aggregate({ where: { wordId }, _max: { position: true } });
      nextPosition.set(wordId, (last._max.position ?? -1) + 1);
    }
    const position = nextPosition.get(wordId)!;
    nextPosition.set(wordId, position + 1);

    await tx.wordAppearance.create({
      data: {
        wordId,
        position,
        source: section.source,
        ...ref,
        verse: section.source === 'surah' ? (item.verse ?? null) : null,
        banglaWord: section.source === 'hidden' ? (item.banglaWord ?? '') : null,
      },
    });
  }

  return { wordIds, touched: [...new Set(before.map((a) => a.wordId))] };
}

/** Step 3: delete the given words that no longer appear anywhere. */
export async function removeOrphanWords(tx: Tx, wordIds: number[]): Promise<number> {
  if (!wordIds.length) return 0;
  const orphans = await tx.word.findMany({
    where: {
      id: { in: wordIds },
      appearances: { none: {} },
      verses: { none: {} },
      basicsLinks: { none: {} },
    },
    select: { id: true },
  });
  if (!orphans.length) return 0;
  const { count } = await tx.word.deleteMany({ where: { id: { in: orphans.map((w) => w.id) } } });
  return count;
}

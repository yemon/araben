/**
 * Scenario admin: read, check and save a scenario with its dialogue turns.
 * Saving re-links the dialogue's words (see words.ts) and logs the change.
 */
import 'server-only';
import { deleteVideoFiles } from '@/lib/media';
import { prisma } from '@/lib/prisma';
import { logEdit } from './audit';
import type { AdminSession } from './session';
import { Check } from './validate';
import { relinkWords, removeOrphanWords } from './words';

export interface TurnInput {
  speaker: string;
  arabic: string;
  transliteration: string;
  english: string;
  bangla: string;
}

export interface ScenarioInput {
  slug: string;
  number: number;
  englishTitle: string;
  banglaTitle: string;
  newWordsNote: string;
  turns: TurnInput[];
}

export type SaveResult = { id: number } | { error: string; status: 400 | 404 | 409 };

const TX = { maxWait: 10_000, timeout: 60_000 };

export function readScenarioInput(body: Record<string, unknown>): { data: ScenarioInput } | { error: string } {
  const c = new Check();
  const data: ScenarioInput = {
    slug: c.slug(body.slug),
    number: c.int(body.number, 'Number', { min: 1, max: 999 }),
    englishTitle: c.text(body.englishTitle, 'English title', { required: true }),
    banglaTitle: c.text(body.banglaTitle, 'Bangla title', { required: true }),
    newWordsNote: c.longText(body.newWordsNote, 'New words note'),
    turns: c.list(
      body.turns,
      'Turns',
      (t, row) => ({
        speaker: c.text(t.speaker, `Turn ${row}: speaker`, { required: true }),
        arabic: c.text(t.arabic, `Turn ${row}: Arabic`, { required: true }),
        transliteration: c.text(t.transliteration, `Turn ${row}: transliteration`, { required: true }),
        english: c.text(t.english, `Turn ${row}: English`),
        bangla: c.text(t.bangla, `Turn ${row}: Bangla`),
      }),
      { min: 1, max: 100 },
    ),
  };
  return c.error ? { error: c.error } : { data };
}

export function listScenarios() {
  return prisma.scenario.findMany({
    orderBy: { position: 'asc' },
    select: {
      id: true,
      slug: true,
      number: true,
      englishTitle: true,
      banglaTitle: true,
      _count: { select: { turns: true, videos: true } },
    },
  });
}

export async function getScenarioInput(id: number): Promise<(ScenarioInput & { id: number }) | null> {
  const s = await prisma.scenario.findUnique({
    where: { id },
    include: { turns: { orderBy: { position: 'asc' } } },
  });
  if (!s) return null;
  return {
    id: s.id,
    slug: s.slug,
    number: s.number,
    englishTitle: s.englishTitle,
    banglaTitle: s.banglaTitle,
    newWordsNote: s.newWordsNote,
    turns: s.turns.map(({ speaker, arabic, transliteration, english, bangla }) => ({
      speaker,
      arabic,
      transliteration,
      english,
      bangla,
    })),
  };
}

/** Create (id null) or update a scenario. */
export async function saveScenario(admin: AdminSession, id: number | null, data: ScenarioInput): Promise<SaveResult> {
  const clash = await prisma.scenario.findUnique({ where: { slug: data.slug }, select: { id: true } });
  if (clash && clash.id !== id) return { error: `Another scenario already uses the slug "${data.slug}"`, status: 409 };
  if (id !== null && !(await prisma.scenario.findUnique({ where: { id }, select: { id: true } }))) {
    return { error: 'Scenario not found', status: 404 };
  }

  const fields = {
    slug: data.slug,
    number: data.number,
    englishTitle: data.englishTitle,
    banglaTitle: data.banglaTitle,
    newWordsNote: data.newWordsNote,
  };

  const savedId = await prisma.$transaction(async (tx) => {
    let scenarioId: number;
    if (id === null) {
      const last = await tx.scenario.aggregate({ _max: { position: true } });
      scenarioId = (await tx.scenario.create({ data: { ...fields, position: (last._max.position ?? -1) + 1 } })).id;
    } else {
      scenarioId = (await tx.scenario.update({ where: { id }, data: fields })).id;
    }

    await tx.scenarioTurn.deleteMany({ where: { scenarioId } });
    await tx.scenarioTurn.createMany({
      data: data.turns.map((t, position) => ({ scenarioId, position, ...t })),
    });

    const { touched } = await relinkWords(
      tx,
      { source: 'scenario', scenarioId, slug: data.slug },
      data.turns.map((t) => ({ arabic: t.arabic, transliteration: t.transliteration, english: t.english, bangla: t.bangla })),
    );
    await removeOrphanWords(tx, touched);

    await logEdit(tx, admin, 'scenarios', id === null ? 'create' : 'update', data.slug,
      `${id === null ? 'Created' : 'Updated'} scenario ${data.number}: ${data.englishTitle}`);
    return scenarioId;
  }, TX);

  return { id: savedId };
}

export async function deleteScenario(admin: AdminSession, id: number): Promise<boolean> {
  const s = await prisma.scenario.findUnique({
    where: { id },
    select: { slug: true, number: true, englishTitle: true, videos: { select: { fileName: true } } },
  });
  if (!s) return false;
  await prisma.$transaction(async (tx) => {
    // Appearances point at the scenario, so they go before it does.
    const { touched } = await relinkWords(tx, { source: 'scenario', scenarioId: id, slug: s.slug }, []);
    await tx.scenario.delete({ where: { id } });
    await removeOrphanWords(tx, touched);
    await logEdit(tx, admin, 'scenarios', 'delete', s.slug, `Deleted scenario ${s.number}: ${s.englishTitle}`);
  }, TX);
  // The video rows went with the scenario; their files go once that's committed.
  await deleteVideoFiles(s.videos.map((v) => v.fileName));
  return true;
}

import { sanitiseWord } from '@/lib/trace/traceLanguages';

const STATUSES = ['draft', 'published'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

interface GameInput {
  title?: string;
  description?: string;
  status?: string;
  difficulty?: string;
  word?: string;
}

/**
 * Pick the editable fields out of a request body and check them.
 *
 * Only these reach the data manager: the builder posts its whole form state
 * back (language, id, slug, timestamps…), and an unknown key handed to
 * Prisma's update fails the write. `requireAll` is for create, where a title
 * and a word are mandatory; an update may change any subset.
 */
export function readGameInput(
  body: any,
  { requireAll = false } = {}
): { data: GameInput } | { error: string } {
  const data: GameInput = {};

  if (body?.title !== undefined || requireAll) {
    const title = String(body?.title ?? '').trim();
    if (!title) return { error: 'Please enter a game title' };
    data.title = title;
  }
  if (body?.description !== undefined) {
    data.description = String(body.description ?? '');
  }
  if (body?.status !== undefined) {
    if (!STATUSES.includes(body.status)) return { error: 'Unknown status' };
    data.status = body.status;
  }
  if (body?.difficulty !== undefined) {
    if (!DIFFICULTIES.includes(body.difficulty)) return { error: 'Unknown difficulty' };
    data.difficulty = body.difficulty;
  }
  if (body?.word !== undefined || requireAll) {
    // The data manager sanitises again on save; this is only so an empty or
    // all-invalid word is refused rather than stored as "".
    if (!sanitiseWord(String(body?.word ?? ''))) {
      return { error: 'Please type an Arabic word to trace' };
    }
    data.word = String(body.word);
  }

  return { data };
}

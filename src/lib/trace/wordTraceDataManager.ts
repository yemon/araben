/**
 * Word Trace data manager for araben.
 *
 * Each game is one Arabic word (e.g., "سلام", "كتاب"), stored in the first 
 * and only slide's data as `{ word, language: "ar" }`. 
 * Words are re-filtered against Arabic letters (traceLanguages.ts).
 */

import { prisma } from '@/lib/prisma';
import { sanitiseWord } from './traceLanguages';

// A type alias, not an interface, so Prisma accepts it as a JSON value.
type SlideData = {
  word: string;
  language: string;
};

export interface TraceGame {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: string;
  difficulty: string | null;
  word: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateGameData {
  title: string;
  description?: string;
  status?: string;
  difficulty?: string | null;
  word: string;
}

interface UpdateGameData extends Partial<CreateGameData> {
  id?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  slides?: any;
}

function slideData(word: string): SlideData {
  return { word: sanitiseWord(word), language: 'ar' };
}

async function getWordTraceTypeId(): Promise<number | null> {
  const type = await prisma.gameType.findUnique({
    where: { code: 'word-trace' },
  });
  return type?.id ?? null;
}

function transformGame(dbGame: any): TraceGame | null {
  if (!dbGame) return null;
  const data = dbGame.slides?.[0]?.data || {};

  return {
    id: dbGame.id.toString(),
    slug: dbGame.slug,
    title: dbGame.title,
    description: dbGame.description || '',
    status: dbGame.status,
    difficulty: dbGame.difficulty || null,
    word: data.word || '',
    language: data.language || 'ar',
    createdAt: dbGame.createdAt.toISOString(),
    updatedAt: dbGame.updatedAt.toISOString(),
  };
}

const withSlides = { slides: { orderBy: { slideNumber: 'asc' as const } } };

/**
 * Get all trace games, optionally filtered by status
 */
export async function getAllGames({ status }: { status?: string } = {}): Promise<TraceGame[]> {
  const typeId = await getWordTraceTypeId();
  // No seeded type means no games can exist yet — an empty list, not an error.
  if (!typeId) return [];

  const where: any = { gameTypeId: typeId };
  if (status) where.status = status;

  const games = await prisma.game.findMany({
    where,
    include: withSlides,
    orderBy: { createdAt: 'desc' },
  });

  return games.map(transformGame).filter((g): g is TraceGame => g !== null);
}

/**
 * Get a single trace game by its slug
 */
export async function getGameBySlug(slug: string): Promise<TraceGame | null> {
  const game = await prisma.game.findUnique({
    where: { slug },
    include: withSlides,
  });
  return transformGame(game);
}

/**
 * Get a single trace game by its ID
 */
export async function getGameById(id: string): Promise<TraceGame | null> {
  const game = await prisma.game.findUnique({
    where: { id: parseInt(id) },
    include: withSlides,
  });
  return transformGame(game);
}

/**
 * Generate a URL-safe slug from timestamp and random string
 */
function generateSlug(): string {
  return Date.now().toString() + '-' + Math.random().toString(36).substring(2, 8);
}

/**
 * Create a new trace game
 */
export async function createGame(gameData: CreateGameData): Promise<TraceGame> {
  const typeId = await getWordTraceTypeId();
  if (!typeId) {
    throw new Error('Word-trace game type not found — run `npm run db:seed`');
  }

  const slug = generateSlug();

  const game = await prisma.game.create({
    data: {
      slug,
      title: gameData.title,
      description: gameData.description || '',
      gameTypeId: typeId,
      status: gameData.status || 'draft',
      difficulty: gameData.difficulty || null,
      slides: {
        create: [{ slideNumber: 1, data: slideData(gameData.word) }],
      },
    },
    include: withSlides,
  });

  const transformed = transformGame(game);
  if (!transformed) throw new Error('Failed to transform created game');
  return transformed;
}

/**
 * Update an existing trace game
 */
export async function updateGame(id: string, updates: UpdateGameData): Promise<TraceGame | null> {
  const gameId = parseInt(id);

  const existing = await prisma.game.findUnique({
    where: { id: gameId },
    include: withSlides,
  });
  
  if (!existing) {
    return null;
  }

  // Strip the read-only echoes a client sends back from transformGame
  const {
    id: _id,
    slug: _slug,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    slides: _slides,
    word,
    ...gameUpdates
  } = updates;

  const data: any = { ...gameUpdates, updatedAt: new Date() };

  // The word lives in a slide, not on the game, so a change to it means
  // replacing that slide rather than patching a column.
  if (word !== undefined) {
    await prisma.gameSlide.deleteMany({ where: { gameId } });
    data.slides = {
      create: [{ slideNumber: 1, data: slideData(word) }],
    };
  }

  const game = await prisma.game.update({
    where: { id: gameId },
    data,
    include: withSlides,
  });

  return transformGame(game);
}

/**
 * Delete a trace game
 */
export async function deleteGame(id: string): Promise<boolean> {
  try {
    await prisma.game.delete({ where: { id: parseInt(id) } });
    return true;
  } catch (error) {
    console.error(`Failed to delete game ${id}:`, error);
    return false;
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createGame, getAllGames } from '@/lib/trace/wordTraceDataManager';
import { readGameInput } from './input';

/**
 * Admin CRUD for trace games — list (every status) and create.
 *
 * Not behind any sign-in yet: araben has no accounts. Anyone who can reach
 * this route can add or change games, so it must get a guard before the
 * admin section is exposed publicly.
 */

export async function GET() {
  try {
    const games = await getAllGames();
    return NextResponse.json({ success: true, data: games });
  } catch (error) {
    console.error('GET /api/admin/trace failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = readGameInput(await request.json(), { requireAll: true });
    if ('error' in input) {
      return NextResponse.json({ success: false, error: input.error }, { status: 400 });
    }
    const game = await createGame(input.data as Parameters<typeof createGame>[0]);
    return NextResponse.json({ success: true, data: game }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/trace failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create game' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createGame, getAllGames } from '@/lib/trace/wordTraceDataManager';
import { logEdit } from '@/lib/admin/audit';
import { requireAdminApi } from '@/lib/admin/session';
import { prisma } from '@/lib/prisma';
import { readGameInput } from './input';

/**
 * Admin CRUD for trace games — list (every status) and create. Signed-in
 * admins only (src/proxy.ts, and again here).
 */

export async function GET() {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;
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
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;
  try {
    const input = readGameInput(await request.json(), { requireAll: true });
    if ('error' in input) {
      return NextResponse.json({ success: false, error: input.error }, { status: 400 });
    }
    const game = await createGame(input.data as Parameters<typeof createGame>[0]);
    await logEdit(prisma, admin, 'trace', 'create', game.slug, `Created trace word: ${game.title}`);
    return NextResponse.json({ success: true, data: game }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/trace failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create game' },
      { status: 500 }
    );
  }
}

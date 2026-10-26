import { NextRequest, NextResponse } from 'next/server';
import { deleteGame, getGameById, updateGame } from '@/lib/trace/wordTraceDataManager';
import { readGameInput } from '../input';

/**
 * Admin CRUD for one trace game — read, update, delete. Unguarded for now;
 * see ../route.ts.
 */

type Ctx = { params: Promise<{ id: string }> };

const notFound = () =>
  NextResponse.json({ success: false, error: 'Game not found' }, { status: 404 });

const isId = (id: string) => /^\d+$/.test(id);

export async function GET(_request: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    if (!isId(id)) return notFound();
    const game = await getGameById(id);
    if (!game) return notFound();
    return NextResponse.json({ success: true, data: game });
  } catch (error) {
    console.error('GET /api/admin/trace/[id] failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch game' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    if (!isId(id)) return notFound();
    const input = readGameInput(await request.json());
    if ('error' in input) {
      return NextResponse.json({ success: false, error: input.error }, { status: 400 });
    }
    const game = await updateGame(id, input.data);
    if (!game) return notFound();
    return NextResponse.json({ success: true, data: game });
  } catch (error) {
    console.error('PUT /api/admin/trace/[id] failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update game' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    if (!isId(id)) return notFound();
    const ok = await deleteGame(id);
    if (!ok) return notFound();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/trace/[id] failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete game' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getAllGames } from '@/lib/trace/wordTraceDataManager';

export async function GET() {
  try {
    const games = await getAllGames({ status: 'published' });

    return NextResponse.json({ success: true, games });
  } catch (error) {
    console.error('Error fetching trace games:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

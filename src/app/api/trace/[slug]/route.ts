import { NextRequest, NextResponse } from 'next/server';
import { getGameBySlug } from '@/lib/trace/wordTraceDataManager';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const game = await getGameBySlug(slug);

    if (!game) {
      return NextResponse.json(
        { success: false, error: 'Game not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: game });
  } catch (error) {
    console.error('Error fetching trace game:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch game' },
      { status: 500 }
    );
  }
}

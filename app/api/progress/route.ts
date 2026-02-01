import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo (replace with database for production)
// Note: This resets on each deployment/cold start on Vercel
const progressStore = new Map<string, {
  visitorName: string;
  currentRoom: string;
  completedRooms: string[];
  puzzlesSolved: Record<string, boolean>;
  startedAt: string;
  lastUpdated: string;
}>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const visitorId = searchParams.get('visitorId');

  if (!visitorId) {
    return NextResponse.json(
      { error: 'visitorId is required' },
      { status: 400 }
    );
  }

  const progress = progressStore.get(visitorId);
  
  if (!progress) {
    return NextResponse.json(
      { error: 'Progress not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(progress);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId, visitorName, currentRoom, completedRooms, puzzlesSolved } = body;

    if (!visitorId) {
      return NextResponse.json(
        { error: 'visitorId is required' },
        { status: 400 }
      );
    }

    const existingProgress = progressStore.get(visitorId);
    const now = new Date().toISOString();

    const progress = {
      visitorName: visitorName || existingProgress?.visitorName || 'Guest',
      currentRoom: currentRoom || existingProgress?.currentRoom || 'start',
      completedRooms: completedRooms || existingProgress?.completedRooms || [],
      puzzlesSolved: puzzlesSolved || existingProgress?.puzzlesSolved || {},
      startedAt: existingProgress?.startedAt || now,
      lastUpdated: now,
    };

    progressStore.set(visitorId, progress);

    return NextResponse.json({ 
      success: true, 
      progress 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

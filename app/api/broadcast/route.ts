import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';

// Check if Pusher is configured
const isPusherConfigured = !!(
  process.env.PUSHER_APP_ID &&
  process.env.NEXT_PUBLIC_PUSHER_KEY &&
  process.env.PUSHER_SECRET &&
  process.env.NEXT_PUBLIC_PUSHER_CLUSTER
);

// Only initialize Pusher if configured
const pusher = isPusherConfigured
  ? new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      useTLS: true,
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    // Check if Pusher is configured
    if (!pusher) {
      return NextResponse.json(
        { 
          error: 'Pusher not configured. Add PUSHER_APP_ID, PUSHER_SECRET, NEXT_PUBLIC_PUSHER_KEY, and NEXT_PUBLIC_PUSHER_CLUSTER to Vercel environment variables.' 
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { eventType, data } = body;

    if (!eventType) {
      return NextResponse.json(
        { error: 'eventType is required' },
        { status: 400 }
      );
    }

    // Broadcast to all connected clients on the "escape-room" channel
    await pusher.trigger('escape-room', eventType, {
      ...data,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ 
      success: true, 
      eventType,
      message: `Event "${eventType}" broadcast to all clients`
    });
  } catch (error) {
    console.error('Broadcast error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Broadcast failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}

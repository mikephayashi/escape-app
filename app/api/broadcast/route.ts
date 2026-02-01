import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';

// Lazy initialization - create Pusher instance only when needed
let pusherInstance: Pusher | null = null;

// Track challenge state server-side
let challengeActive = false;

function getPusher(): Pusher | null {
  // Check if already initialized
  if (pusherInstance) {
    return pusherInstance;
  }

  // Check if all required env vars exist
  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  console.log('Pusher config check:', {
    hasAppId: !!appId,
    hasKey: !!key,
    hasSecret: !!secret,
    hasCluster: !!cluster,
  });

  if (!appId || !key || !secret || !cluster) {
    console.error('Missing Pusher config:', { appId: !!appId, key: !!key, secret: !!secret, cluster: !!cluster });
    return null;
  }

  // Initialize Pusher
  pusherInstance = new Pusher({
    appId,
    key,
    secret,
    cluster,
    useTLS: true,
  });

  return pusherInstance;
}

export async function POST(request: NextRequest) {
  try {
    // Get or create Pusher instance
    const pusher = getPusher();
    
    if (!pusher) {
      return NextResponse.json(
        { 
          error: 'Pusher not configured. Check environment variables in Vercel.',
          debug: {
            PUSHER_APP_ID: !!process.env.PUSHER_APP_ID,
            NEXT_PUBLIC_PUSHER_KEY: !!process.env.NEXT_PUBLIC_PUSHER_KEY,
            PUSHER_SECRET: !!process.env.PUSHER_SECRET,
            NEXT_PUBLIC_PUSHER_CLUSTER: !!process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
          }
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

    // Track challenge state
    if (eventType === 'start-challenge') {
      challengeActive = true;
    } else if (eventType === 'stop-challenge') {
      challengeActive = false;
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

// GET endpoint to check current challenge state
export async function GET() {
  return NextResponse.json({ challengeActive });
}

import { NextResponse } from 'next/server';

export async function GET() {
  // Only show if variables exist, not their values (for security)
  return NextResponse.json({
    pusher: {
      PUSHER_APP_ID: !!process.env.PUSHER_APP_ID,
      PUSHER_SECRET: !!process.env.PUSHER_SECRET,
      NEXT_PUBLIC_PUSHER_KEY: !!process.env.NEXT_PUBLIC_PUSHER_KEY,
      NEXT_PUBLIC_PUSHER_CLUSTER: !!process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    },
    blob: {
      BLOB_READ_WRITE_TOKEN: !!process.env.BLOB_READ_WRITE_TOKEN,
    },
    allConfigured: !!(
      process.env.PUSHER_APP_ID &&
      process.env.PUSHER_SECRET &&
      process.env.NEXT_PUBLIC_PUSHER_KEY &&
      process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    ),
  });
}

import { list } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get('folder') || '';
    const limit = parseInt(searchParams.get('limit') || '100');

    const { blobs } = await list({
      prefix,
      limit,
    });

    return NextResponse.json({
      images: blobs.map((blob) => ({
        url: blob.url,
        filename: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
      })),
      count: blobs.length,
    });
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json(
      { error: 'Failed to list images' },
      { status: 500 }
    );
  }
}

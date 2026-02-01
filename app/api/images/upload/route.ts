import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: jpeg, png, gif, webp' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Max size: 5MB' },
        { status: 400 }
      );
    }

    // Get optional username for organizing photos
    const userName = formData.get('userName') as string || '';
    
    // Generate unique filename with optional username prefix
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    // Include username in path for attribution: folder/username/timestamp-filename
    const userPrefix = userName ? `${userName.toLowerCase().trim()}/` : '';
    const filename = `${folder}/${userPrefix}${timestamp}-${file.name}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: blob.pathname,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Check if it's a Blob configuration error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('BLOB_READ_WRITE_TOKEN')) {
      return NextResponse.json(
        { error: 'Blob storage not configured. Add BLOB_READ_WRITE_TOKEN in Vercel.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: `Upload failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}

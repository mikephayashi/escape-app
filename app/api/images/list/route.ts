import { list } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

// Map names to user avatar images
const userImageMap: Record<string, string> = {
  alex: "/assets/shared/users/Alex.png",
  "american derek": "/assets/shared/users/American Derek.png",
  anastasia: "/assets/shared/users/Anastasia.png",
  ariella: "/assets/shared/users/Ariella.png",
  brandon: "/assets/shared/users/Brandon.png",
  brian: "/assets/shared/users/Brian.png",
  caeden: "/assets/shared/users/Caeden.png",
  "canadian derek": "/assets/shared/users/Canadian Derek.png",
  carina: "/assets/shared/users/Carina.png",
  charlie: "/assets/shared/users/Charlie.png",
  dennis: "/assets/shared/users/Dennis.png",
  esha: "/assets/shared/users/Esha.png",
  freda: "/assets/shared/users/Freda.png",
  goodman: "/assets/shared/users/Goodman.png",
  grant: "/assets/shared/users/Grant.png",
  israel: "/assets/shared/users/Israel.png",
  jj: "/assets/shared/users/JJ.png",
  jenn: "/assets/shared/users/Jenn.png",
  jillian: "/assets/shared/users/Jillian.png",
  josh: "/assets/shared/users/Josh.png",
  joy: "/assets/shared/users/Joy.png",
  kana: "/assets/shared/users/Kana.png",
  matt: "/assets/shared/users/Matt.png",
  melayna: "/assets/shared/users/Melayna.png",
  newt: "/assets/shared/users/Newt.png",
  rishabh: "/assets/shared/users/Rishabh.png",
  sandra: "/assets/shared/users/Sandra.png",
  sid: "/assets/shared/users/Sid.png",
  steven: "/assets/shared/users/Steven.png",
  suhavi: "/assets/shared/users/Suhavi.png",
  wayne: "/assets/shared/users/Wayne.png",
};

// Extract username from file path like "user-photos/alex/123456-photo.jpg"
function extractUserName(pathname: string, folder: string): string | null {
  // Remove the folder prefix to get: "alex/123456-photo.jpg"
  const withoutFolder = pathname.replace(`${folder}/`, '');
  const parts = withoutFolder.split('/');
  // If there's a subfolder (username), it's the first part
  if (parts.length > 1) {
    return parts[0];
  }
  return null;
}

// Capitalize first letter of name
function capitalizeName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

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
      images: blobs.map((blob) => {
        const userName = extractUserName(blob.pathname, prefix);
        const userAvatar = userName ? userImageMap[userName.toLowerCase()] || null : null;
        
        return {
          url: blob.url,
          filename: blob.pathname,
          size: blob.size,
          uploadedAt: blob.uploadedAt,
          userName: userName ? capitalizeName(userName) : null,
          userAvatar,
        };
      }),
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

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// Allowed MIME types
const ALLOWED = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'video/mp4', 'video/webm',
]);

/**
 * POST /api/upload
 * Accepts a multipart form with a "file" field.
 * Stores files in /public/uploads/<userId>/ for local development.
 * Returns { url } that can be used as a portfolio item URL.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await getCurrentUser();
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 413 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 });
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitise filename and build storage path
    const ext        = path.extname(file.name).toLowerCase() || '.bin';
    const safeName   = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const uploadDir  = path.join(process.cwd(), 'public', 'uploads', auth.userId);
    const filePath   = path.join(uploadDir, safeName);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);

    const url = `/uploads/${auth.userId}/${safeName}`;
    return NextResponse.json({ success: true, data: { url } });
  } catch (err) {
    console.error('[upload]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

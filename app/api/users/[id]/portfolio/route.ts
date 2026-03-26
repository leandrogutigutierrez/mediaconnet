import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import User from '@/models/User';

// POST /api/users/:id/portfolio — add portfolio item
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userId !== params.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, mediaType, url, thumbnail } = body;

    if (!title || !mediaType || !url) {
      return NextResponse.json({ error: 'title, mediaType and url are required' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(
      params.id,
      { $push: { portfolio: { title, description, mediaType, url, thumbnail } } },
      { new: true }
    );

    return NextResponse.json({ success: true, data: user?.portfolio });
  } catch (err) {
    console.error('[POST portfolio]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/users/:id/portfolio?itemId=xxx — remove portfolio item
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userId !== params.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const itemId = req.nextUrl.searchParams.get('itemId');
    if (!itemId) return NextResponse.json({ error: 'itemId is required' }, { status: 400 });

    await connectDB();
    const user = await User.findByIdAndUpdate(
      params.id,
      { $pull: { portfolio: { _id: itemId } } },
      { new: true }
    );

    return NextResponse.json({ success: true, data: user?.portfolio });
  } catch (err) {
    console.error('[DELETE portfolio]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

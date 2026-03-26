import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import User from '@/models/User';

// GET /api/users/:id — public profile
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = await User.findById(params.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    console.error('[GET user]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/users/:id — update own profile
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getCurrentUser();
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (auth.userId !== params.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();

    // Fields users cannot update via this endpoint
    const forbidden = ['password', 'email', 'role', '_id'];
    forbidden.forEach((f) => delete body[f]);

    await connectDB();
    const user = await User.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    );
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    console.error('[PATCH user]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

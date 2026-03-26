import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { signToken, setAuthCookie } from '@/lib/auth';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, companyName, career } = body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    if (!['student', 'company'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    await connectDB();

    // Check for existing user
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12);

    // Build role-specific fields
    const extra: Record<string, string> = {};
    if (role === 'company' && companyName) extra.companyName = companyName;
    if (role === 'student' && career)      extra.career      = career;

    const user = await User.create({ name, email, password: hashed, role, ...extra });

    // Issue JWT cookie
    const token = await signToken({ userId: user._id.toString(), role: user.role });
    await setAuthCookie(token);

    return NextResponse.json(
      { success: true, data: user },
      { status: 201 }
    );
  } catch (err) {
    console.error('[register]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

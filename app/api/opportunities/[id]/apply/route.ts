import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import Application from '@/models/Application';
import Opportunity from '@/models/Opportunity';

// POST /api/opportunities/:id/apply
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getCurrentUser();
    if (!auth)                   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (auth.role !== 'student') return NextResponse.json({ error: 'Only students can apply' }, { status: 403 });

    await connectDB();

    const opp = await Opportunity.findById(params.id);
    if (!opp || !opp.isActive) {
      return NextResponse.json({ error: 'Opportunity not found or closed' }, { status: 404 });
    }

    const { coverLetter } = await req.json();

    const application = await Application.create({
      opportunity: params.id,
      student:     auth.userId,
      coverLetter: coverLetter ?? '',
    });

    await application.populate([
      { path: 'opportunity', select: 'title company' },
      { path: 'student',     select: 'name email avatar' },
    ]);

    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (err: unknown) {
    // Duplicate key = already applied
    if ((err as { code?: number }).code === 11000) {
      return NextResponse.json({ error: 'You already applied to this opportunity' }, { status: 409 });
    }
    console.error('[apply]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

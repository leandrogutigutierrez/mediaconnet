import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import Application from '@/models/Application';
import Opportunity from '@/models/Opportunity';

// PATCH /api/applications/:id — accept or reject (company only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.role !== 'company') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { status } = await req.json();
    if (!['accepted', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await connectDB();

    // Verify the application belongs to one of this company's opportunities
    const application = await Application.findById(params.id).populate('opportunity');
    if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const opp = await Opportunity.findOne({
      _id: application.opportunity._id,
      company: auth.userId,
    });
    if (!opp) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    application.status = status;
    await application.save();

    return NextResponse.json({ success: true, data: application });
  } catch (err) {
    console.error('[PATCH application]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import Opportunity from '@/models/Opportunity';
import Application from '@/models/Application';

// GET /api/opportunities/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const opp = await Opportunity.findById(params.id)
      .populate('company', 'name avatar companyName industry website location description');

    if (!opp) return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });

    // Attach applicant count
    const applicantCount = await Application.countDocuments({ opportunity: params.id });
    const data = { ...opp.toJSON(), applicantCount };

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('[GET opportunity]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/opportunities/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.role !== 'company') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const opp = await Opportunity.findOne({ _id: params.id, company: auth.userId });
    if (!opp) return NextResponse.json({ error: 'Not found or no permission' }, { status: 404 });

    const body = await req.json();
    // Prevent changing company ownership
    delete body.company;

    Object.assign(opp, body);
    await opp.save();

    return NextResponse.json({ success: true, data: opp });
  } catch (err) {
    console.error('[PATCH opportunity]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/opportunities/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.role !== 'company') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const result = await Opportunity.findOneAndDelete({ _id: params.id, company: auth.userId });
    if (!result) return NextResponse.json({ error: 'Not found or no permission' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE opportunity]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

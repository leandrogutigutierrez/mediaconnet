import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import Application from '@/models/Application';
import Opportunity from '@/models/Opportunity';

/**
 * GET /api/applications
 * - Student: returns their own applications
 * - Company: returns applications for all their opportunities
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await getCurrentUser();
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    let applications;

    if (auth.role === 'student') {
      applications = await Application.find({ student: auth.userId })
        .populate('opportunity', 'title category modality company deadline')
        .populate({ path: 'opportunity', populate: { path: 'company', select: 'name avatar companyName' } })
        .sort({ createdAt: -1 });
    } else {
      // Company: find all their opportunities then all applications to them
      const opportunityIds = await Opportunity.find({ company: auth.userId }).distinct('_id');
      applications = await Application.find({ opportunity: { $in: opportunityIds } })
        .populate('opportunity', 'title category')
        .populate('student', 'name email avatar career skills bio location')
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({ success: true, data: applications });
  } catch (err) {
    console.error('[GET applications]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

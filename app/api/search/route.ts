import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Opportunity from '@/models/Opportunity';

/**
 * GET /api/search?q=query&type=students|opportunities&skills=...&page=1
 * Unified search endpoint that searches both students and opportunities.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const q        = searchParams.get('q') ?? '';
    const type     = searchParams.get('type') ?? 'all'; // 'students' | 'opportunities' | 'all'
    const skills   = searchParams.get('skills') ?? '';
    const category = searchParams.get('category') ?? '';
    const modality = searchParams.get('modality') ?? '';
    const page     = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit    = Math.min(20, parseInt(searchParams.get('limit') ?? '10'));

    await connectDB();

    const results: Record<string, unknown> = {};

    if (type === 'students' || type === 'all') {
      const filter: Record<string, unknown> = { role: 'student' };
      if (q)      filter.$text  = { $search: q };
      if (skills) filter.skills = { $in: skills.split(',').map((s) => s.trim()) };

      const [students, total] = await Promise.all([
        User.find(filter)
          .select('name avatar career skills bio location')
          .skip((page - 1) * limit)
          .limit(limit),
        User.countDocuments(filter),
      ]);
      results.students = { items: students, total };
    }

    if (type === 'opportunities' || type === 'all') {
      const filter: Record<string, unknown> = { isActive: true };
      if (q)        filter.$text    = { $search: q };
      if (category) filter.category = category;
      if (modality) filter.modality = modality;
      if (skills)   filter.skills   = { $in: skills.split(',').map((s) => s.trim()) };

      const [opportunities, total] = await Promise.all([
        Opportunity.find(filter)
          .populate('company', 'name avatar companyName')
          .skip((page - 1) * limit)
          .limit(limit)
          .sort({ createdAt: -1 }),
        Opportunity.countDocuments(filter),
      ]);
      results.opportunities = { items: opportunities, total };
    }

    return NextResponse.json({ success: true, data: results });
  } catch (err) {
    console.error('[search]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

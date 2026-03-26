import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import Opportunity from '@/models/Opportunity';

// GET /api/opportunities — list with filters & pagination
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const page     = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit    = Math.min(50, parseInt(searchParams.get('limit') ?? '12'));
    const query    = searchParams.get('q') ?? '';
    const category = searchParams.get('category') ?? '';
    const modality = searchParams.get('modality') ?? '';
    const skills   = searchParams.get('skills') ?? '';

    // Build filter
    const filter: Record<string, unknown> = { isActive: true };

    if (query) {
      filter.$text = { $search: query };
    }
    if (category) filter.category = category;
    if (modality) filter.modality = modality;
    if (skills)   filter.skills   = { $in: skills.split(',').map((s) => s.trim()) };

    const [items, total] = await Promise.all([
      Opportunity.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('company', 'name avatar companyName industry location'),
      Opportunity.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: { items, total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('[GET opportunities]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/opportunities — create (company only)
export async function POST(req: NextRequest) {
  try {
    const auth = await getCurrentUser();
    if (!auth)                  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (auth.role !== 'company') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { title, description, requirements, skills, category, location, modality, compensation, deadline } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'title and description are required' }, { status: 400 });
    }

    await connectDB();
    const opp = await Opportunity.create({
      company: auth.userId,
      title, description, requirements, skills, category, location, modality, compensation, deadline,
    });
    await opp.populate('company', 'name avatar companyName');

    return NextResponse.json({ success: true, data: opp }, { status: 201 });
  } catch (err) {
    console.error('[POST opportunity]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

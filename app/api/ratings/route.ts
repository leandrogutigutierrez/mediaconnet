import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import Rating from '@/models/Rating';

// GET /api/ratings?userId=xxx — get ratings for a user
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    await connectDB();

    const ratings = await Rating.find({ reviewee: userId })
      .populate('reviewer', 'name avatar role companyName')
      .sort({ createdAt: -1 });

    const avg = ratings.length
      ? ratings.reduce((s, r) => s + r.score, 0) / ratings.length
      : 0;

    return NextResponse.json({ success: true, data: { ratings, average: avg, count: ratings.length } });
  } catch (err) {
    console.error('[GET ratings]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/ratings — create or update a rating
export async function POST(req: NextRequest) {
  try {
    const auth = await getCurrentUser();
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { revieweeId, score, comment } = await req.json();
    if (!revieweeId || !score) {
      return NextResponse.json({ error: 'revieweeId and score are required' }, { status: 400 });
    }
    if (score < 1 || score > 5) {
      return NextResponse.json({ error: 'Score must be between 1 and 5' }, { status: 400 });
    }
    if (auth.userId === revieweeId) {
      return NextResponse.json({ error: 'You cannot rate yourself' }, { status: 400 });
    }

    await connectDB();

    // Upsert: one rating per reviewer-reviewee pair
    const rating = await Rating.findOneAndUpdate(
      { reviewer: auth.userId, reviewee: revieweeId },
      { score, comment: comment ?? '' },
      { upsert: true, new: true }
    ).populate('reviewer', 'name avatar');

    return NextResponse.json({ success: true, data: rating });
  } catch (err) {
    console.error('[POST rating]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

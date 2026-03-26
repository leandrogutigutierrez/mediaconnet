import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import Message from '@/models/Message';
import mongoose from 'mongoose';

// GET /api/messages/:partnerId — full thread between current user and partner
export async function GET(
  _req: NextRequest,
  { params }: { params: { partnerId: string } }
) {
  try {
    const auth = await getCurrentUser();
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const me      = new mongoose.Types.ObjectId(auth.userId);
    const partner = new mongoose.Types.ObjectId(params.partnerId);

    // Fetch messages and mark unread ones as read
    const messages = await Message.find({
      $or: [
        { sender: me,      receiver: partner },
        { sender: partner, receiver: me      },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender receiver', 'name avatar');

    // Mark as read
    await Message.updateMany(
      { sender: partner, receiver: me, read: false },
      { $set: { read: true } }
    );

    return NextResponse.json({ success: true, data: messages });
  } catch (err) {
    console.error('[GET thread]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

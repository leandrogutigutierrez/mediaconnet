import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import Message from '@/models/Message';
import User from '@/models/User';

/**
 * GET /api/messages — returns the list of conversations for the current user
 * Each conversation groups messages with a unique partner, returning:
 *   - partner user info
 *   - last message
 *   - unread count
 */
export async function GET() {
  try {
    const auth = await getCurrentUser();
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const userId = auth.userId;

    // Aggregate: find all unique conversation partners
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: { $eq: userId } },
            { receiver: { $eq: userId } },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$receiver',
              '$sender',
            ],
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiver', userId] }, { $eq: ['$read', false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    // Populate partner info
    const partnerIds = conversations.map((c) => c._id);
    const partners   = await User.find({ _id: { $in: partnerIds } }).select('name avatar role companyName');
    const partnerMap = new Map(partners.map((p) => [p._id.toString(), p]));

    const result = conversations.map((c) => ({
      partner:      partnerMap.get(c._id.toString()),
      lastMessage:  c.lastMessage,
      unreadCount:  c.unreadCount,
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error('[GET messages]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/messages — send a message
export async function POST(req: NextRequest) {
  try {
    const auth = await getCurrentUser();
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { receiverId, content } = await req.json();
    if (!receiverId || !content?.trim()) {
      return NextResponse.json({ error: 'receiverId and content are required' }, { status: 400 });
    }

    await connectDB();

    const receiver = await User.findById(receiverId);
    if (!receiver) return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });

    const message = await Message.create({
      sender:   auth.userId,
      receiver: receiverId,
      content:  content.trim(),
    });
    await message.populate('sender receiver', 'name avatar');

    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (err) {
    console.error('[POST message]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

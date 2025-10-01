import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

// POST /api/db/message - Create new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, role, content, isSimulated, metadata } = body;

    const message = await prisma.message.create({
      data: {
        sessionId,
        role,
        content,
        isSimulated: isSimulated || false,
        metadata: metadata || null,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}

// GET /api/db/message?sessionId=xxx - Get messages for session
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

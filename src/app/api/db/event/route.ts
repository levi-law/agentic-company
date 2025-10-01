import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

// export const runtime = 'edge'; // Commented out for local dev - Prisma doesn't support Edge Runtime locally

// POST /api/db/event - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, direction, eventName, eventData } = body;

    const event = await prisma.event.create({
      data: {
        sessionId,
        direction,
        eventName,
        eventData,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

// GET /api/db/event?sessionId=xxx - Get events for session
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    const events = await prisma.event.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

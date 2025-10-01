import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export const runtime = 'edge';

// GET /api/db/session?sessionId=xxx - Get session by ID
// GET /api/db/session - Get all sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
          events: {
            orderBy: { createdAt: 'asc' },
          },
          businessPlan: true,
          tasks: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      return NextResponse.json(session);
    }

    // Get all sessions
    const sessions = await prisma.session.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        _count: {
          select: {
            messages: true,
            tasks: true,
          },
        },
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}

// POST /api/db/session - Create new session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentConfig, activeAgent } = body;

    const session = await prisma.session.create({
      data: {
        agentConfig,
        activeAgent,
        status: 'active',
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

// PATCH /api/db/session - Update session
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, activeAgent, status } = body;

    const session = await prisma.session.update({
      where: { id: sessionId },
      data: {
        ...(activeAgent && { activeAgent }),
        ...(status && { status }),
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}

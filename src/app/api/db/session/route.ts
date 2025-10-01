import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

// // export const runtime = 'edge'; // Commented out for local dev - Prisma doesn't support Edge Runtime locally // Commented out for local dev - Prisma doesn't support Edge Runtime locally

// GET /api/db/session - Get all sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    if (sessionId) {
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              name: true,
            },
          },
          messages: {
            orderBy: { createdAt: 'asc' },
          },
          events: {
            orderBy: { createdAt: 'asc' },
          },
          tasks: {
            orderBy: { createdAt: 'asc' },
          },
          businessPlan: true,
        },
      });

      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      return NextResponse.json(session);
    } else if (userId) {
      // Return sessions for a specific user
      const sessions = await prisma.session.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              name: true,
            },
          },
          messages: {
            orderBy: { createdAt: 'asc' },
          },
          events: {
            orderBy: { createdAt: 'asc' },
          },
          tasks: {
            orderBy: { createdAt: 'asc' },
          },
          businessPlan: true,
        },
      });

      return NextResponse.json(sessions);
    } else {
      // Return all sessions
      const sessions = await prisma.session.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              name: true,
            },
          },
          messages: {
            orderBy: { createdAt: 'asc' },
          },
          events: {
            orderBy: { createdAt: 'asc' },
          },
          tasks: {
            orderBy: { createdAt: 'asc' },
          },
          businessPlan: true,
        },
      });

      return NextResponse.json(sessions);
    }
  } catch (error) {
    console.error('Session GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/db/session - Create new session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentConfig, activeAgent, userId } = body;

    const session = await prisma.session.create({
      data: {
        agentConfig,
        activeAgent: activeAgent || null,
        status: 'active',
        userId: userId || null,
      },
      include: {
        user: userId ? {
          select: {
            id: true,
            email: true,
            username: true,
            name: true,
          },
        } : false,
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Session POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/db/session - Update session
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, activeAgent, status, userId } = body;

    const session = await prisma.session.update({
      where: { id: sessionId },
      data: {
        ...(activeAgent !== undefined && { activeAgent }),
        ...(status && { status }),
        ...(userId !== undefined && { userId }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}

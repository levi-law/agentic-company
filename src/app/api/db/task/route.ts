import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

// POST /api/db/task - Create or update tasks (bulk operation)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tasks, sessionId, businessId } = body;

    if (!Array.isArray(tasks)) {
      return NextResponse.json({ error: 'tasks must be an array' }, { status: 400 });
    }

    // Use upsert to handle both create and update
    const operations = tasks.map((task: any) =>
      prisma.task.upsert({
        where: { id: task.id },
        update: {
          department: task.department,
          title: task.title,
          description: task.description,
          assignedTo: task.assignedTo,
          reviewedBy: task.reviewedBy,
          priority: task.priority,
          estimatedHours: task.estimatedHours,
          status: task.status,
          progress: task.progress,
          blockers: task.blockers,
          dependencies: task.dependencies || [],
          businessId: businessId || task.businessId,
        },
        create: {
          id: task.id,
          sessionId,
          businessId: businessId || task.businessId,
          department: task.department,
          title: task.title,
          description: task.description,
          assignedTo: task.assignedTo,
          reviewedBy: task.reviewedBy,
          priority: task.priority,
          estimatedHours: task.estimatedHours,
          status: task.status || 'pending',
          progress: task.progress,
          blockers: task.blockers,
          dependencies: task.dependencies || [],
        },
      })
    );

    const result = await prisma.$transaction(operations);

    return NextResponse.json({ success: true, count: result.length, tasks: result });
  } catch (error) {
    console.error('Error creating/updating tasks:', error);
    return NextResponse.json({ error: 'Failed to create/update tasks' }, { status: 500 });
  }
}

// GET /api/db/task?sessionId=xxx - Get tasks for session
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');
    const businessId = searchParams.get('businessId');

    const where: any = {};
    if (sessionId) where.sessionId = sessionId;
    if (businessId) where.businessId = businessId;

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// PATCH /api/db/task - Update single task
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, status, progress, blockers, startedAt, completedAt, actualHours } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (blockers !== undefined) updateData.blockers = blockers;
    if (startedAt) updateData.startedAt = new Date(startedAt);
    if (completedAt) updateData.completedAt = new Date(completedAt);
    if (actualHours !== undefined) updateData.actualHours = actualHours;

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

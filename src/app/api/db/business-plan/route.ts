import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

// POST /api/db/business-plan - Create or update business plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      businessId,
      businessName,
      businessIdea,
      targetMarket,
      revenueModel,
      timeline,
      budget,
      technicalPlan,
      marketingPlan,
      salesPlan,
      legalPlan,
      financePlan,
      operationsPlan,
      hrPlan,
      currentPhase,
      conversationSummary,
    } = body;

    const businessPlan = await prisma.businessPlan.upsert({
      where: { businessId },
      update: {
        businessName,
        businessIdea,
        targetMarket,
        revenueModel,
        timeline,
        budget,
        technicalPlan,
        marketingPlan,
        salesPlan,
        legalPlan,
        financePlan,
        operationsPlan,
        hrPlan,
        currentPhase,
        conversationSummary,
      },
      create: {
        sessionId,
        businessId,
        businessName,
        businessIdea,
        targetMarket,
        revenueModel,
        timeline,
        budget,
        technicalPlan,
        marketingPlan,
        salesPlan,
        legalPlan,
        financePlan,
        operationsPlan,
        hrPlan,
        currentPhase: currentPhase || 'planning',
        conversationSummary,
      },
    });

    return NextResponse.json(businessPlan);
  } catch (error) {
    console.error('Error creating/updating business plan:', error);
    return NextResponse.json({ error: 'Failed to create/update business plan' }, { status: 500 });
  }
}

// GET /api/db/business-plan?sessionId=xxx or ?businessId=xxx
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');
    const businessId = searchParams.get('businessId');

    if (!sessionId && !businessId) {
      return NextResponse.json({ error: 'sessionId or businessId is required' }, { status: 400 });
    }

    const where: any = {};
    if (sessionId) where.sessionId = sessionId;
    if (businessId) where.businessId = businessId;

    const businessPlan = await prisma.businessPlan.findFirst({
      where,
    });

    if (!businessPlan) {
      return NextResponse.json({ error: 'Business plan not found' }, { status: 404 });
    }

    return NextResponse.json(businessPlan);
  } catch (error) {
    console.error('Error fetching business plan:', error);
    return NextResponse.json({ error: 'Failed to fetch business plan' }, { status: 500 });
  }
}

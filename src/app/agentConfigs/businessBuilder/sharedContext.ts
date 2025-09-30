// Shared context storage for Business-Builder agents
// This allows agents to access information from previous conversations with other agents

interface BusinessContext {
  businessId?: string;
  businessName?: string;
  businessIdea?: string;
  targetMarket?: string;
  revenueModel?: string;
  timeline?: string;
  budget?: string;
  currentPhase?: 'discovery' | 'planning' | 'execution' | 'monitoring';
  approvedPlan?: boolean;
  conversationSummary?: string;
  lastUpdated?: string;
}

// In-memory storage - in production, this would be a database or session storage
const sessionContexts = new Map<string, BusinessContext>();

// Default session ID for single-user demo
const DEFAULT_SESSION_ID = 'default';

export function getBusinessContext(sessionId: string = DEFAULT_SESSION_ID): BusinessContext {
  return sessionContexts.get(sessionId) || {};
}

export function updateBusinessContext(
  updates: Partial<BusinessContext>,
  sessionId: string = DEFAULT_SESSION_ID
): BusinessContext {
  const current = getBusinessContext(sessionId);
  const updated = {
    ...current,
    ...updates,
    lastUpdated: new Date().toISOString(),
  };
  sessionContexts.set(sessionId, updated);
  return updated;
}

export function clearBusinessContext(sessionId: string = DEFAULT_SESSION_ID): void {
  sessionContexts.delete(sessionId);
}

export function getContextSummary(sessionId: string = DEFAULT_SESSION_ID): string {
  const context = getBusinessContext(sessionId);
  
  if (!context.businessName && !context.businessIdea) {
    return 'No business context available yet.';
  }

  const parts: string[] = [];
  
  if (context.businessName) {
    parts.push(`Business: ${context.businessName}`);
  }
  
  if (context.businessIdea) {
    parts.push(`Idea: ${context.businessIdea}`);
  }
  
  if (context.targetMarket) {
    parts.push(`Target Market: ${context.targetMarket}`);
  }
  
  if (context.revenueModel) {
    parts.push(`Revenue Model: ${context.revenueModel}`);
  }
  
  if (context.timeline) {
    parts.push(`Timeline: ${context.timeline}`);
  }
  
  if (context.budget) {
    parts.push(`Budget: ${context.budget}`);
  }
  
  if (context.currentPhase) {
    parts.push(`Current Phase: ${context.currentPhase}`);
  }
  
  if (context.conversationSummary) {
    parts.push(`Summary: ${context.conversationSummary}`);
  }
  
  return parts.join('\n');
}

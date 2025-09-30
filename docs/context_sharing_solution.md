# Context Sharing Solution for Multi-Agent System

## Problem

When users switch between agents in the Business-Builder platform, context is lost. For example:
- User talks to CEO Agent about building a "padel app"
- CEO Agent generates business plan
- User switches to Marketing Agent
- Marketing Agent has no knowledge of the padel app discussion

This happens because each agent only has access to its own conversation history, not the full session history across all agents.

## Solution: Shared Context System

We've implemented a shared context storage system that allows agents to access information from previous conversations with other agents.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Shared Context Storage                    │
│  (In-memory Map - would be database in production)          │
│                                                              │
│  Stores:                                                     │
│  - businessId, businessName, businessIdea                   │
│  - targetMarket, revenueModel, timeline, budget             │
│  - currentPhase, approvedPlan, conversationSummary          │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼────┐         ┌────▼────┐        ┌────▼────┐
   │   CEO   │         │Marketing│        │  Sales  │
   │  Agent  │         │  Agent  │        │  Agent  │
   │         │         │         │        │         │
   │ Writes  │         │  Reads  │        │  Reads  │
   │ Context │         │ Context │        │ Context │
   └─────────┘         └─────────┘        └─────────┘
```

### Implementation

#### 1. Shared Context Module (`sharedContext.ts`)

```typescript
// Storage for business context
const sessionContexts = new Map<string, BusinessContext>();

// Get context
export function getBusinessContext(sessionId: string): BusinessContext

// Update context
export function updateBusinessContext(updates: Partial<BusinessContext>): BusinessContext

// Get formatted summary
export function getContextSummary(sessionId: string): string
```

#### 2. CEO Agent Updates Context

When the CEO Agent creates a business plan, it saves the context:

```typescript
updateBusinessContext({
  businessId,
  businessName,
  businessIdea,
  targetMarket,
  revenueModel,
  timeline,
  budget,
  currentPhase: 'planning',
  conversationSummary: `Building ${businessName}: ${businessIdea}...`,
});
```

#### 3. Department Agents Read Context

Each department agent (Marketing, Sales, Legal, Finance, Operations, HR, Technical) now has:

**A. Context Awareness Tool**
```typescript
const getBusinessContextTool = tool({
  name: 'getBusinessContext',
  description: 'Get the current business context from previous conversations',
  execute: async () => {
    const summary = getContextSummary();
    return { success: true, context: summary };
  },
});
```

**B. Updated Instructions**
```typescript
instructions: `
# IMPORTANT: Business Context
When a user switches to you from another agent, **ALWAYS start by calling 
the getBusinessContext tool** to understand what business you're working on.

# Workflow
1. **First action**: Call getBusinessContext to understand the business
2. **Then**: Proceed with your tasks based on that context
...
`
```

### Example Flow

**Before (Context Lost):**
```
User → CEO: "I want a padel app"
CEO: [generates plan for padel app]

User switches to Marketing Agent

User → Marketing: "Can you do marketing for my business?"
Marketing: "Sure! What's your business?" ❌ (Lost context)
```

**After (Context Preserved):**
```
User → CEO: "I want a padel app"
CEO: [generates plan, saves context]

User switches to Marketing Agent

User → Marketing: "Can you do marketing for my business?"
Marketing: [calls getBusinessContext tool]
Marketing: "Great! I can see you're building a padel app for amateur 
players to track games and engage with local leagues. Let me create 
a comprehensive marketing strategy..." ✅ (Context preserved)
```

## Files Modified

1. **`src/app/agentConfigs/businessBuilder/sharedContext.ts`** (NEW)
   - Shared context storage and management functions

2. **`src/app/agentConfigs/businessBuilder/ceoTools.ts`**
   - Updated `generateBusinessPlan` to save context

3. **`src/app/agentConfigs/businessBuilder/index.ts`**
   - Added `getBusinessContextTool` 
   - Updated all department agents with context awareness
   - Added tool to each agent's tools array

## Benefits

1. **Seamless Agent Handoffs**: Users can switch between agents without repeating information
2. **Better User Experience**: Agents appear to "remember" the business context
3. **Reduced Friction**: No need to re-explain the business idea to each agent
4. **Consistent Information**: All agents work with the same business details

## Limitations & Future Improvements

### Current Limitations
- **In-Memory Storage**: Context is lost when the server restarts
- **Single Session**: Only supports one session at a time (DEFAULT_SESSION_ID)
- **Manual Tool Calls**: Agents must remember to call getBusinessContext

### Future Improvements

1. **Persistent Storage**
   ```typescript
   // Use database instead of Map
   - PostgreSQL with session table
   - Redis for fast session storage
   - Cloudflare KV for edge storage
   ```

2. **Multi-Session Support**
   ```typescript
   // Use actual session IDs from user authentication
   const sessionId = getUserSessionId(request);
   updateBusinessContext(updates, sessionId);
   ```

3. **Automatic Context Injection**
   ```typescript
   // Inject context automatically in agent instructions
   // Instead of requiring manual tool calls
   ```

4. **Context History**
   ```typescript
   // Track context changes over time
   interface ContextHistory {
     timestamp: string;
     agent: string;
     changes: Partial<BusinessContext>;
   }
   ```

5. **Cross-Session Context**
   ```typescript
   // Allow users to resume previous business projects
   const previousProjects = getUserProjects(userId);
   ```

## Testing the Solution

1. **Start the app**: `npm run dev`
2. **Talk to CEO Agent**: Describe your business idea
3. **Generate business plan**: Let CEO create the plan
4. **Switch to Marketing Agent**: Select "Marketing" from dropdown
5. **Ask Marketing Agent**: "Can you do marketing for my business?"
6. **Verify**: Marketing Agent should call `getBusinessContext` and reference your business

## Production Deployment

The solution is already deployed to your Cloudflare Pages preview branch:
- URL: `https://agentic-company-dev.agentic-company.pages.dev`
- Wait 1-2 minutes for deployment to complete
- Test the context sharing functionality

## Code Example

### CEO Agent Creating Context
```typescript
// In generateBusinessPlan tool
updateBusinessContext({
  businessId: 'biz_123',
  businessName: 'PadelConnect',
  businessIdea: 'App for amateur padel players to track games and join leagues',
  targetMarket: 'Amateur padel players globally',
  revenueModel: 'Freemium with premium subscriptions',
  timeline: '4 weeks',
  budget: '$1,000',
  currentPhase: 'planning',
});
```

### Marketing Agent Reading Context
```typescript
// Marketing Agent receives: "Can you do marketing?"
// 1. Calls getBusinessContext tool
const context = getBusinessContext();
// Returns: "Business: PadelConnect
//           Idea: App for amateur padel players...
//           Target Market: Amateur padel players globally
//           Revenue Model: Freemium with premium subscriptions"

// 2. Uses context in response
"Great! I can see you're building PadelConnect - an app for amateur 
padel players. Let me create a marketing strategy targeting amateur 
players globally with a freemium model..."
```

## Conclusion

The shared context system solves the context loss problem by:
1. Storing business information in a shared location
2. Allowing all agents to access this information via a tool
3. Instructing agents to check context when users switch to them

This creates a seamless multi-agent experience where users don't need to repeat themselves when switching between specialized agents.

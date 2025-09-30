# Agent Handoff System

## Overview

The Business-Builder platform now supports seamless agent handoffs, allowing the CEO Agent to connect users directly to specialized department agents while preserving full business context.

## Architecture

```
                    ┌─────────────┐
                    │  CEO Agent  │
                    │  (Central)  │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐        ┌────▼────┐       ┌────▼────┐
   │Developer│        │Marketing│       │  Sales  │
   └────┬────┘        └────┬────┘       └────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼──────┐
                    │  CEO Agent  │
                    │ (Hand Back) │
                    └─────────────┘
```

## How It Works

### 1. CEO Agent Can Hand Off To:
- **Developer Agent**: Technical development tasks
- **Marketing Agent**: Marketing and brand tasks
- **Sales Agent**: Sales and CRM tasks
- **Legal Agent**: Legal and compliance tasks
- **Finance Agent**: Financial and accounting tasks
- **Operations Agent**: Operational tasks
- **HR Agent**: Human resources tasks

### 2. Department Agents Can Hand Back To:
- **CEO Agent**: For strategic planning, coordination, or working with other departments

### 3. Context Preservation

When an agent handoff occurs:
1. **Business context is automatically preserved** via the shared context system
2. **Department agent calls `getBusinessContext`** to retrieve full business details
3. **Seamless conversation** continues without user needing to repeat information

## Usage Examples

### Example 1: CEO Hands Off to Marketing

```
User: "I want to build a padel app for amateur players"
CEO: [Asks discovery questions, generates business plan]
CEO: "Great! I've created your business plan. Would you like me to connect 
      you with our Marketing Agent to start building your brand?"

User: "Yes, let's do marketing"
CEO: [Hands off to Marketing Agent]

Marketing: [Calls getBusinessContext automatically]
Marketing: "Hi! I can see you're building a padel app for amateur players 
           to track games and engage with local leagues. Let me create a 
           comprehensive marketing strategy for your target market..."
```

### Example 2: Marketing Hands Back to CEO

```
User: [Currently talking to Marketing Agent]
User: "Actually, I also need help with the technical setup"

Marketing: "I can help with marketing, but for technical development, 
            let me connect you back to our CEO Agent who can coordinate 
            with the Developer team."
Marketing: [Hands back to CEO]

CEO: "Welcome back! I see you've been working on marketing. Now you'd 
      like to discuss technical development. Let me connect you with 
      our Developer Agent..."
CEO: [Hands off to Developer]

Developer: [Calls getBusinessContext]
Developer: "Hi! I can see you're building a padel app. Let me help you 
           set up the technical infrastructure..."
```

### Example 3: CEO Offers Multiple Options

```
User: "I've finished planning with you"
CEO: "Excellent! Your business plan is ready. Which department would you 
      like to start with?
      
      - **Marketing**: Build your brand and launch campaigns
      - **Developer**: Set up technical infrastructure
      - **Legal**: Form your business entity and handle compliance
      - **Finance**: Set up banking and accounting
      
      I can connect you with any of these specialists."

User: "Let's start with legal"
CEO: [Hands off to Legal Agent]

Legal: [Calls getBusinessContext]
Legal: "Hi! I can see you're building a padel app business. Let me help 
       you with entity formation and legal compliance..."
```

## Implementation Details

### CEO Agent Configuration

```typescript
ceoAgent.handoffs = [
  developerAgent,
  marketingAgent,
  salesAgent,
  legalAgent,
  financeAgent,
  operationsAgent,
  hrAgent,
];
```

### Department Agent Configuration

```typescript
// Each department agent can hand back to CEO
developerAgent.handoffs = [ceoAgent];
marketingAgent.handoffs = [ceoAgent];
salesAgent.handoffs = [ceoAgent];
legalAgent.handoffs = [ceoAgent];
financeAgent.handoffs = [ceoAgent];
operationsAgent.handoffs = [ceoAgent];
hrAgent.handoffs = [ceoAgent];
```

### Handoff Descriptions

Each agent has a `handoffDescription` that helps the LLM understand when to hand off:

```typescript
{
  name: 'Marketing',
  handoffDescription: 'Marketing specialist for brand development, content creation, SEO/SEM, and campaign management',
  // ...
}
```

## Agent Instructions for Handoffs

### CEO Agent Instructions

```
# Agent Handoffs
You can hand off conversations to specialized agents when:
- User asks for specific department work (e.g., "Can you help with marketing?")
- You've completed planning and want to delegate execution
- User wants to speak directly with a department specialist

**How to hand off:**
When you want to connect the user to a department agent, simply use the 
agent handoff functionality. The context will be preserved automatically.

Example: "I'll connect you with our Marketing Agent who can help you with 
that. They have full context of your padel app business."
```

### Department Agent Instructions

```
# Handoffs
- Hand back to **CEO Agent** when user needs strategic planning, wants to 
  work with other departments, or needs overall business coordination
```

## Benefits

### 1. **Specialized Expertise**
Each agent focuses on their domain expertise without needing to know everything.

### 2. **Seamless Experience**
Users don't need to repeat information when switching between agents.

### 3. **Flexible Workflow**
Users can work with multiple departments as needed, guided by the CEO Agent.

### 4. **Context Preservation**
Business details are automatically shared across all agents.

### 5. **Natural Conversation**
Handoffs feel natural, like being transferred to a specialist in a company.

## User Experience Flow

```
1. User starts with CEO Agent
   └─> Strategic planning and business discovery

2. CEO offers to connect to specialists
   └─> User chooses department (e.g., Marketing)

3. Handoff to Marketing Agent
   └─> Marketing Agent retrieves context automatically
   └─> Continues conversation with full business knowledge

4. User needs help from another department
   └─> Marketing hands back to CEO

5. CEO coordinates next steps
   └─> Hands off to another specialist (e.g., Developer)

6. Process continues as needed
   └─> CEO acts as central coordinator
   └─> Specialists handle domain-specific work
```

## Testing the Handoff System

### Test Scenario 1: Basic Handoff

1. Start conversation with CEO Agent
2. Describe your business idea
3. Let CEO generate business plan
4. Ask CEO to connect you with Marketing
5. Verify Marketing Agent has context
6. Ask Marketing to hand back to CEO
7. Verify CEO remembers the conversation

### Test Scenario 2: Multi-Department Workflow

1. Start with CEO Agent
2. Complete business planning
3. Work with Marketing Agent on brand
4. Hand back to CEO
5. Work with Developer Agent on technical setup
6. Hand back to CEO
7. Work with Legal Agent on entity formation
8. Verify all agents have consistent business context

### Test Scenario 3: Direct Request

1. Start with CEO Agent
2. Immediately ask: "Can you help me with marketing?"
3. CEO should offer to hand off to Marketing Agent
4. Accept handoff
5. Verify Marketing Agent has context (even though planning wasn't complete)

## Troubleshooting

### Issue: Agent doesn't hand off when requested

**Solution**: Make sure you're asking clearly. Try:
- "Can you connect me with the Marketing Agent?"
- "I'd like to work with the Developer team"
- "Let's talk to Legal about compliance"

### Issue: Context is lost after handoff

**Solution**: This shouldn't happen, but if it does:
1. Check that business plan was generated (context is saved during plan generation)
2. Ask the department agent to call `getBusinessContext`
3. Report the issue for investigation

### Issue: Can't hand back to CEO

**Solution**: Try:
- "I'd like to go back to the CEO"
- "Can you connect me with the CEO Agent?"
- "I need strategic planning help"

## Future Enhancements

### 1. **Multi-Agent Collaboration**
Allow multiple agents to work together simultaneously:
```
CEO coordinates → Marketing + Developer work together on landing page
```

### 2. **Agent Status Tracking**
Show which agents are currently working on tasks:
```
CEO: "Marketing Agent is working on your brand identity, 
      Developer Agent is setting up your repository..."
```

### 3. **Smart Handoff Suggestions**
CEO proactively suggests handoffs based on conversation:
```
User: "I need a logo"
CEO: "That's a marketing task. Would you like me to connect you 
      with our Marketing Agent?"
```

### 4. **Handoff History**
Track which agents user has worked with:
```
CEO: "You've already worked with Marketing and Developer. 
      Next, I recommend talking to our Legal Agent about 
      entity formation."
```

### 5. **Parallel Workflows**
Allow users to have multiple concurrent conversations:
```
User works with Marketing in one thread
User works with Developer in another thread
CEO coordinates both
```

## Code Reference

### Key Files

- **`src/app/agentConfigs/businessBuilder/index.ts`**: Agent definitions and handoff configuration
- **`src/app/agentConfigs/businessBuilder/sharedContext.ts`**: Context sharing system
- **`src/app/agentConfigs/businessBuilder/ceoTools.ts`**: CEO tools including context updates

### Handoff Configuration Code

```typescript
// Set up handoffs - CEO can hand off to all department agents
ceoAgent.handoffs = [
  developerAgent,
  marketingAgent,
  salesAgent,
  legalAgent,
  financeAgent,
  operationsAgent,
  hrAgent,
];

// Each department agent can hand back to CEO
developerAgent.handoffs = [ceoAgent];
marketingAgent.handoffs = [ceoAgent];
// ... etc
```

## Conclusion

The agent handoff system creates a natural, flexible workflow where:
- **CEO Agent** acts as the strategic coordinator
- **Department Agents** provide specialized expertise
- **Context** is preserved across all handoffs
- **Users** get seamless, expert help across all business functions

This mimics how a real company works, with a CEO coordinating specialized teams, but powered by AI for instant, 24/7 availability.

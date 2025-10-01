# Database Integration Guide

The Agentic Company platform now includes full database persistence for conversation history, tasks, business plans, and events.

## Overview

All user interactions, agent responses, tasks, and business plans are automatically saved to a PostgreSQL database, enabling:

- **Session Persistence**: Resume conversations across browser sessions
- **History Replay**: Review past conversations and decisions
- **Task Tracking**: Monitor task progress over time
- **Audit Trail**: Complete event log for debugging and compliance
- **Multi-User Support**: Ready for multi-tenant architecture

## Architecture

### Database Layer
- **ORM**: Prisma (type-safe database client)
- **Database**: PostgreSQL 14+
- **Schema**: See `prisma/schema.prisma`

### Data Models

1. **Session**: Represents a conversation session
   - Tracks active agent and configuration
   - Links to all related data (messages, events, tasks, business plans)

2. **Message**: Transcript messages (user and assistant)
   - Stores conversation history
   - Includes metadata for context

3. **Event**: Realtime API events
   - Complete event log for debugging
   - Client and server events

4. **BusinessPlan**: Generated business plans
   - Comprehensive business strategy
   - Department-specific plans (technical, marketing, sales, etc.)

5. **Task**: Individual tasks across departments
   - Status tracking (pending, in_progress, completed, blocked)
   - Dependencies and assignments
   - Progress monitoring

6. **ApprovalRequest**: Human approval requests
   - High-impact decisions
   - Budget approvals
   - Plan confirmations

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This automatically runs `prisma generate` to create the Prisma Client.

### 2. Configure Database

Follow the instructions in [DATABASE_SETUP.md](./DATABASE_SETUP.md) to:
- Install PostgreSQL
- Create database and user
- Configure environment variables

### 3. Run Migrations

```bash
# For development
npm run db:push

# For production
npm run db:migrate
```

### 4. Verify Setup

```bash
# Open Prisma Studio
npm run db:studio
```

## Usage

### Automatic Persistence

The application automatically saves data when:

- User sends a message → Saved to `Message` table
- Agent responds → Saved to `Message` table
- Events occur → Saved to `Event` table
- Tasks are generated → Saved to `Task` table
- Business plan is created → Saved to `BusinessPlan` table

### Session Management

Sessions are automatically created and managed:

```typescript
// Session is created on first load
// Session ID is stored in localStorage
// Session is restored on page reload
```

### Disabling Persistence

To disable database persistence (for testing):

```typescript
// In App.tsx
const { sessionId, saveMessage, ... } = useSessionPersistence({
  agentConfig: agentSetKey,
  activeAgent: selectedAgentName,
  enabled: false, // Set to false to disable
});
```

## API Endpoints

### Session Management
- `POST /api/db/session` - Create new session
- `GET /api/db/session?sessionId=xxx` - Get session with all data
- `GET /api/db/session` - Get all sessions
- `PATCH /api/db/session` - Update session

### Messages
- `POST /api/db/message` - Save message
- `GET /api/db/message?sessionId=xxx` - Get messages for session

### Events
- `POST /api/db/event` - Save event
- `GET /api/db/event?sessionId=xxx` - Get events for session

### Tasks
- `POST /api/db/task` - Create/update tasks (bulk)
- `GET /api/db/task?sessionId=xxx` - Get tasks for session
- `PATCH /api/db/task` - Update single task

### Business Plans
- `POST /api/db/business-plan` - Create/update business plan
- `GET /api/db/business-plan?sessionId=xxx` - Get business plan

## Database Service

The `dbService` provides a clean API for database operations:

```typescript
import { dbService } from '@/app/lib/dbService';

// Create session
const session = await dbService.createSession('businessBuilder', 'CEO');

// Save message
await dbService.saveMessage(sessionId, 'user', 'Hello', false);

// Save tasks
await dbService.saveTasks(sessionId, tasks, businessId);

// Get session history
const session = await dbService.getSession(sessionId);
```

## Session Persistence Hook

The `useSessionPersistence` hook manages all database operations:

```typescript
const {
  sessionId,          // Current session ID
  isLoading,          // Loading state
  error,              // Error state
  saveMessage,        // Save message to DB
  saveEvent,          // Save event to DB
  saveTasks,          // Save tasks to DB
  saveBusinessPlan,   // Save business plan to DB
  loadSessionHistory, // Load previous session
  endSession,         // End current session
  getAllSessions,     // Get all sessions
} = useSessionPersistence({
  agentConfig: 'businessBuilder',
  activeAgent: 'CEO',
  enabled: true,
});
```

## Data Flow

```
User Action
    ↓
App Component
    ↓
Context (TranscriptContext, EventContext, TasksContext)
    ↓
useSessionPersistence Hook
    ↓
Database Service (dbService)
    ↓
API Routes (/api/db/*)
    ↓
Prisma Client
    ↓
PostgreSQL Database
```

## Production Considerations

### Performance
- **Connection Pooling**: Prisma handles this automatically
- **Indexes**: Schema includes indexes on frequently queried fields
- **Batch Operations**: Tasks are saved in bulk transactions

### Security
- **SQL Injection**: Prisma prevents SQL injection
- **Environment Variables**: Database credentials in `.env`
- **SSL**: Enable for production databases
- **Access Control**: Add authentication middleware to API routes

### Scalability
- **Horizontal Scaling**: Use connection pooling
- **Read Replicas**: Configure for high-traffic scenarios
- **Caching**: Add Redis for frequently accessed data
- **Archiving**: Implement data retention policies

### Monitoring
- **Query Performance**: Monitor slow queries
- **Connection Pool**: Track pool usage
- **Storage**: Monitor database size
- **Backups**: Automated daily backups

## Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npm run db:generate
```

### "Database connection failed"
- Check `DATABASE_URL` in `.env`
- Verify PostgreSQL is running
- Test connection with `psql`

### "Migration failed"
```bash
npx prisma migrate reset
npm run db:push
```

### "Session not persisting"
- Check browser console for errors
- Verify `enabled: true` in `useSessionPersistence`
- Check API routes are accessible

## Future Enhancements

- [ ] Multi-user authentication and authorization
- [ ] Real-time collaboration with WebSockets
- [ ] Advanced search and filtering
- [ ] Data export (CSV, JSON)
- [ ] Analytics dashboard
- [ ] Automated backups
- [ ] Data retention policies
- [ ] Audit logs
- [ ] Performance metrics

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Detailed setup instructions

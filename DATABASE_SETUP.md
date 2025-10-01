# Database Setup Guide

This application uses PostgreSQL with Prisma ORM for persistent storage of conversation history, tasks, business plans, and events.

## Prerequisites

- PostgreSQL 14+ installed locally or access to a hosted PostgreSQL instance
- Node.js 18+ and npm

## Local Development Setup

### 1. Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE agentic_company;
CREATE USER agentic_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE agentic_company TO agentic_user;

# Exit psql
\q
```

### 3. Configure Environment Variables

Copy `.env.sample` to `.env` and update the DATABASE_URL:

```bash
cp .env.sample .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://agentic_user:your_secure_password@localhost:5432/agentic_company?schema=public"
OPENAI_API_KEY=your_openai_api_key
```

### 4. Install Dependencies

```bash
npm install
```

This will automatically run `prisma generate` via the postinstall script.

### 5. Run Database Migrations

```bash
# Push schema to database (for development)
npm run db:push

# Or create a migration (for production)
npm run db:migrate
```

### 6. Verify Setup

```bash
# Open Prisma Studio to view your database
npm run db:studio
```

This opens a browser interface at `http://localhost:5555` where you can view and edit data.

## Production Setup

### Recommended Hosting Options

1. **Neon** (https://neon.tech) - Serverless PostgreSQL, free tier available
2. **Supabase** (https://supabase.com) - PostgreSQL with additional features
3. **Railway** (https://railway.app) - Simple deployment with PostgreSQL
4. **AWS RDS** - Enterprise-grade PostgreSQL
5. **Google Cloud SQL** - Managed PostgreSQL

### Setup with Neon (Recommended for Cloudflare Pages)

1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string
4. Add to your environment variables:
   ```
   DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

### Cloudflare Pages Integration

Since you're deploying to Cloudflare Pages, you'll need to:

1. Add `DATABASE_URL` to your Cloudflare Pages environment variables
2. Use a serverless-compatible PostgreSQL provider (Neon, Supabase, or Cloudflare D1)

**For Cloudflare D1 (Alternative):**
If you prefer Cloudflare's native database, you can adapt the Prisma schema to use SQLite/D1. However, PostgreSQL is recommended for production-grade features.

## Database Schema

The application uses the following models:

- **Session**: Conversation sessions with agents
- **Message**: Transcript messages (user and assistant)
- **Event**: Realtime API events for debugging
- **BusinessPlan**: Generated business plans
- **Task**: Individual tasks across departments
- **ApprovalRequest**: Requests for human approval

## Useful Commands

```bash
# Generate Prisma Client after schema changes
npm run db:generate

# Push schema changes to database (dev)
npm run db:push

# Create and apply migrations (production)
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Backup and Restore

### Backup
```bash
pg_dump -U agentic_user -d agentic_company > backup.sql
```

### Restore
```bash
psql -U agentic_user -d agentic_company < backup.sql
```

## Troubleshooting

### Connection Issues

1. **Check PostgreSQL is running:**
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. **Verify connection string:**
   ```bash
   psql "postgresql://agentic_user:password@localhost:5432/agentic_company"
   ```

3. **Check firewall settings** if using remote database

### Migration Issues

If migrations fail:
```bash
# Reset and reapply
npx prisma migrate reset
npm run db:push
```

### Prisma Client Not Found

```bash
npm run db:generate
```

## Security Best Practices

1. **Never commit `.env` file** - it's in `.gitignore`
2. **Use strong passwords** for database users
3. **Enable SSL** for production databases
4. **Rotate credentials** regularly
5. **Use environment-specific databases** (dev, staging, prod)
6. **Enable connection pooling** for production
7. **Set up automated backups**

## Performance Optimization

1. **Indexes**: The schema includes indexes on frequently queried fields
2. **Connection Pooling**: Prisma handles this automatically
3. **Query Optimization**: Use `include` and `select` to fetch only needed data
4. **Caching**: Consider adding Redis for frequently accessed data

## Monitoring

For production, set up monitoring for:
- Database connection pool usage
- Query performance
- Storage usage
- Backup status

Recommended tools:
- Prisma Pulse (real-time database events)
- Datadog
- New Relic
- Grafana + Prometheus

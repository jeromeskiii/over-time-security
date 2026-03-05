# Runbook

## Development

### Prerequisites
- Node.js 20+
- pnpm 10+
- PostgreSQL 15+

### Initial Setup

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp packages/db/.env.example packages/db/.env

# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Start development servers
pnpm dev
```

### Running Individual Apps

```bash
# Marketing site (port 3000)
pnpm dev:web

# Operations portal (port 3001)
pnpm dev:ops

# Guard mobile app (port 3002)
pnpm dev:guard
```

---

## Database

### Migrations

```bash
# Create a new migration
cd packages/db
pnpm prisma migrate dev --name description_of_change

# Reset database (development only!)
pnpm prisma migrate reset
```

### Studio

```bash
pnpm db:studio
```

---

## Building

```bash
# Build all apps and packages
pnpm build

# Type check all packages
pnpm typecheck
```

---

## Deployment

### Environment Variables

Each app requires:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Auth encryption key (ops app)
- `AWS_ACCESS_KEY_ID` - S3 access (optional)
- `AWS_SECRET_ACCESS_KEY` - S3 secret (optional)
- `S3_BUCKET_NAME` - File storage bucket (optional)

### Production Build

```bash
pnpm build
```

---

## Troubleshooting

### Common Issues

1. **Prisma client not generated**
   ```bash
   pnpm db:generate
   ```

2. **Type errors in packages**
   ```bash
   pnpm typecheck
   ```

3. **Port already in use**
   - Kill the process or change the port in the app's package.json

---

## Automation Workers

The `@ots/automation` package runs as a separate worker process that handles background jobs, AI report generation, notifications, and compliance scoring.

### Prerequisites

1. **Redis** must be running before starting workers:
   ```bash
   # Start Redis (and Postgres) via Docker Compose
   docker compose -f docker/docker-compose.yml up -d redis

   # Verify Redis is healthy
   docker exec ots-redis redis-cli ping
   # Expected: PONG
   ```

2. **PostgreSQL** must be running with migrations applied:
   ```bash
   docker compose -f docker/docker-compose.yml up -d postgres
   pnpm db:migrate
   ```

3. **Environment variables** must be configured. Copy the root `.env.example` and fill in real values:
   ```bash
   cp .env.example .env
   ```

### Automation Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `REDIS_URL` | Yes | Redis connection string (default: `redis://localhost:6379`) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI features |
| `RESEND_API_KEY` | Yes | Resend API key for sending emails |
| `EMAIL_FROM` | Yes | Sender address for outbound emails |
| `DISPATCH_EMAIL` | Yes | Dispatcher inbox for lead notifications |
| `TWILIO_ACCOUNT_SID` | Yes | Twilio account SID for SMS |
| `TWILIO_AUTH_TOKEN` | Yes | Twilio auth token for SMS |
| `TWILIO_PHONE_NUMBER` | Yes | Twilio sender phone number |
| `CHECKPOINT_WINDOW_MINUTES` | No | Minutes before a checkpoint is considered missed (default: `30`) |
| `NO_SHOW_THRESHOLD_MINUTES` | No | Minutes after shift start to flag no-show (default: `30`) |
| `AI_MONTHLY_BUDGET_USD` | No | Monthly AI spend cap (default: `100`) |

### Starting Workers

```bash
# Production mode
pnpm workers

# Development mode (auto-restart on file changes)
pnpm workers:dev
```

On successful startup you will see:

```
╔══════════════════════════════════════════════════╗
║     OVER TIME SECURITY — Automation Workers     ║
╚══════════════════════════════════════════════════╝

[Boot] Starting workers...
  ✓ Alerts worker started
  ✓ AI worker started
  ✓ Reports worker started
  ✓ Notifications worker started
  ✓ Compliance worker started
[Boot] Registering scheduled jobs...
[Boot] All systems operational.
```

### Stopping Workers

Workers handle `SIGINT` and `SIGTERM` for graceful shutdown. Press `Ctrl+C` or send a signal:

```bash
# Graceful shutdown
kill -SIGTERM <worker_pid>
```

The shutdown sequence:
1. Stops accepting new jobs
2. Waits for in-progress jobs to complete
3. Closes all BullMQ queues
4. Closes the Redis connection
5. Exits with code 0

### Monitoring

#### Worker Logs

Workers log to stdout. In production, pipe to your log aggregator:

```bash
pnpm workers 2>&1 | tee -a /var/log/ots-workers.log
```

Key log patterns to watch:

| Pattern | Meaning |
|---------|---------|
| `[alerts]` | Alerts worker activity |
| `[ai]` | AI worker activity |
| `[reports]` | Reports worker activity |
| `[notifications]` | Notifications worker activity |
| `[compliance]` | Compliance worker activity |
| `[scheduler]` | Cron job registration/execution |
| `Job failed` | A job exhausted retries |

#### Redis Queue Inspection

Use `redis-cli` to inspect queue state:

```bash
# Count pending jobs in the alerts queue
docker exec ots-redis redis-cli LLEN bull:alerts:wait

# Count active jobs
docker exec ots-redis redis-cli LLEN bull:alerts:active

# Count failed jobs
docker exec ots-redis redis-cli ZCARD bull:alerts:failed

# Repeat for: ai, reports, notifications, compliance
```

For a richer dashboard, consider [Bull Board](https://github.com/felixmosh/bull-board) or [Arena](https://github.com/bee-queue/arena) — both compatible with BullMQ.

### Scheduled Jobs

These run automatically when workers are active:

| Schedule | Job | Description |
|----------|-----|-------------|
| Daily 06:00 UTC | Daily report | Compiles shifts, patrols, incidents → AI summary → HTML email |
| Daily 07:00 UTC | Compliance batch | Calculates compliance scores for all active sites |
| Every 15 minutes | No-show check | Flags shifts where guard has not checked in |

### Testing Individual Automations

To test a specific workflow without the full worker process, use the workflow API from a script or REPL:

```typescript
import { createEventBus, processNewIncident } from '@ots/automation';

const bus = createEventBus();

// Test incident report generation
await processNewIncident(bus, {
  incidentId: 'test-incident-id',
  siteId: 'test-site-id',
  severity: 'HIGH',
  // ... other required fields
});
```

You can also enqueue jobs directly for specific workers:

```typescript
import { getQueue } from '@ots/automation';

const alertsQueue = getQueue('alerts');
await alertsQueue.add('patrol-miss-alert', {
  shiftId: 'test-shift-id',
  checkpointId: 'test-checkpoint-id',
  guardId: 'test-guard-id',
});
```

### Automation Troubleshooting

#### Workers crash on startup

1. **Check Redis is running**: `docker exec ots-redis redis-cli ping` should return `PONG`
2. **Check environment variables**: Ensure `REDIS_URL` and `DATABASE_URL` are set
3. **Check Prisma client**: Run `pnpm db:generate` if you see Prisma import errors
4. **Check for port conflicts**: Ensure nothing else is using Redis port 6379

#### Queues are backing up

1. **Check worker process is running**: `ps aux | grep "tsx src/start.ts"`
2. **Check for repeated failures**: Inspect the failed set in Redis:
   ```bash
   docker exec ots-redis redis-cli ZRANGE bull:<queue>:failed 0 -1
   ```
3. **Check external service limits**: Twilio/Resend rate limits may cause notification backups
4. **Restart workers**: `Ctrl+C` then `pnpm workers` to clear stale state

#### AI jobs failing

1. **Check `GEMINI_API_KEY`**: Verify the key is valid and has quota
2. **Check `AI_MONTHLY_BUDGET_USD`**: Budget cap may be reached — the system stops AI calls when the monthly limit is hit
3. **Check AI response logs**: The AI worker logs raw response errors; look for `[ai] Job failed` entries
4. **Fallback behavior**: When AI fails, the system generates a raw-data report flagged `needsManualReview: true` — no data is lost

#### Notifications not sending

1. **Check Resend API key**: Verify `RESEND_API_KEY` is valid at [resend.com/api-keys](https://resend.com/api-keys)
2. **Check Twilio credentials**: Verify `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`
3. **Check sender identity**: `EMAIL_FROM` must be a verified sender in Resend
4. **Check Twilio phone**: `TWILIO_PHONE_NUMBER` must be a valid Twilio number

#### Compliance scores not updating

1. **Check compliance worker is running**: Look for `[compliance]` in worker logs
2. **Check scheduled job**: The batch runs at 07:00 UTC daily — confirm timezone
3. **Manual trigger**: Enqueue a `recalculate-site-score` job directly via the queue API

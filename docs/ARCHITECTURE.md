# Architecture

## Monorepo Structure

```
over-time-security/
├── apps/
│   ├── web/           # Marketing site (Next.js)
│   ├── ops/           # Operations portal (Next.js)
│   └── guard/         # Guard mobile PWA (Next.js)
├── packages/
│   ├── db/            # Prisma + database
│   ├── domain/        # Types, validators, policies
│   ├── ui/            # Shared components
│   └── automation/    # Jobs, AI, workflows
├── tooling/
│   ├── eslint/
│   ├── tsconfig/
│   └── tailwind/
└── docs/
```

---

## Dependency Graph

```
                    ┌─────────────┐
                    │  packages/  │
                    │    domain   │  (no UI deps)
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ packages │    │ packages │    │ packages │
    │   /ui    │    │   /db    │    │automation│
    └────┬─────┘    └────┬─────┘    └────┬─────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
    ┌─────────┐    ┌─────────┐    ┌─────────┐
    │ apps/   │    │ apps/   │    │ apps/   │
    │  web    │    │  ops    │    │ guard   │
    └─────────┘    └─────────┘    └─────────┘
```

---

## Key Principles

1. **packages/domain has no UI dependencies** - Pure TypeScript with business logic
2. **packages/ui has no business logic** - Presentational components only
3. **Apps import from packages, never from other apps**
4. **Database access only through @ots/db package**

---

## Database Schema

### Core Entities

- **Lead** - Marketing inquiries
- **Client** - Companies with contracts
- **Site** - Physical locations to secure
- **Guard** - Security officers
- **Shift** - Scheduled work periods
- **Incident** - Reported events
- **CheckIn** - Guard location check-ins
- **PatrolLog** - Patrol checkpoint scans
- **Report** - Generated incident reports

---

## Authentication

- **Web app**: No auth (public)
- **Ops app**: NextAuth.js with role-based access
- **Guard app**: PIN-based auth with license number

---

## Automation Platform — `@ots/automation`

The automation package is an event-driven platform that runs as a **separate worker process** alongside the Next.js apps. It handles background jobs, AI-powered report generation, notifications, and compliance scoring.

### Package Dependencies

```
automation depends on:
  ├── @ots/db       (Prisma client for event persistence and data queries)
  └── @ots/domain   (shared types, validators, enums)
```

The automation package **never** imports from `@ots/ui` or any `apps/*` package. Apps call into automation via the workflow API exported from `@ots/automation/workflows`.

### Process Model

```
┌──────────────────────────────────────────────────────────────┐
│  Next.js Apps (web, ops, guard)                              │
│  ─ Call workflow functions: processNewIncident, etc.          │
│  ─ EventBus publishes events to DB + Redis queues            │
└───────────────┬──────────────────────────────────────────────┘
                │  BullMQ job queues via Redis
                ▼
┌──────────────────────────────────────────────────────────────┐
│  Worker Process (pnpm workers)                               │
│  ─ 5 concurrent BullMQ workers                               │
│  ─ Scheduled cron jobs                                       │
│  ─ Runs independently of Next.js                             │
└──────────────────────────────────────────────────────────────┘
```

Workers run in a **dedicated Node.js process** started via `pnpm workers` (or `pnpm workers:dev` in watch mode). They are completely decoupled from the Next.js apps and can be scaled, restarted, or deployed independently.

### Event Pipeline

```
 App Code                EventBus                 Redis/BullMQ           Workers
 ────────                ────────                 ──────────             ───────
    │                        │                         │                    │
    │ workflow function call  │                         │                    │
    │──────────────────────▶│                          │                    │
    │                        │ 1. Persist event to DB   │                    │
    │                        │─────────────────────▶   │                    │
    │                        │ 2. Route to job queue    │                    │
    │                        │─────────────────────▶   │                    │
    │                        │                         │ 3. Worker picks up  │
    │                        │                         │───────────────────▶│
    │                        │                         │                    │ 4. Process job
    │                        │                         │                    │ 5. Emit follow-up
    │                        │                         │◀───────────────────│    events
```

1. App code calls a workflow function (e.g., `processNewIncident`)
2. The `EventBus` persists the event to PostgreSQL for audit
3. The `eventJobRouter` maps the event type to one or more BullMQ queues
4. Workers consume jobs, execute business logic, and may emit follow-up events

### Queue Architecture

| Queue | Purpose | Retry | Backoff |
|-------|---------|-------|---------|
| `alerts` | Patrol miss, shift no-show, escalation | 3 attempts | Exponential, 2s base |
| `ai` | Incident report generation, daily summaries, lead estimates | 2 attempts | Exponential, 5s base |
| `reports` | HTML report rendering, email distribution | 3 attempts | Exponential, 10s base |
| `notifications` | Email via Resend, SMS via Twilio | 3 attempts | Exponential, 3s base |
| `compliance` | Site compliance scoring, low-score alerts | 2 attempts | Exponential, 5s base |

### Workers

| Worker | Queue | Responsibilities |
|--------|-------|------------------|
| Alerts | `alerts` | Patrol miss detection, shift no-show handling, incident escalation |
| AI | `ai` | Gemini AI calls for incident reports, daily summaries, lead estimates |
| Reports | `reports` | HTML report generation, report distribution emails |
| Notifications | `notifications` | Send email (Resend) and SMS (Twilio) notifications |
| Compliance | `compliance` | Calculate site compliance scores, trigger low-score alerts |

### Scheduled Jobs

| Schedule | Job | Queue |
|----------|-----|-------|
| Daily 06:00 UTC | Daily report generation | `reports` |
| Daily 07:00 UTC | Compliance batch scoring | `compliance` |
| Every 15 minutes | Shift no-show checker | `alerts` |

### Core Automations

```
1. PATROL MISS ALERT
   Missed checkpoint → SMS supervisor → mark shift AT_RISK → audit event

2. INCIDENT AI REPORT
   New incident → Gemini AI structured report → supervisor review
   → auto-escalation for HIGH/CRITICAL severity

3. DAILY REPORT GENERATOR
   Cron 06:00 UTC → compile shifts/patrols/incidents → AI summary
   → HTML report → email to client

4. LEAD INTAKE
   New lead → auto-response email + SMS → dispatcher notification
   → AI estimate generation

5. COMPLIANCE SCORE
   Weighted formula: patrol 40% + check-ins 25% + incidents 20%
   + timeliness 15% → grades A-F → low-score alerts
```

### AI Guardrails

- **System prompt** enforces "only reference provided data" — no hallucinated facts
- Every AI output tracked with `sourceFieldsUsed` for audit
- **Zod schema validation** on all AI responses — malformed output is rejected
- **Graceful fallback**: on AI failure, raw data report is generated and flagged for manual review

### Workflow API

Apps interact with automation by calling workflow functions:

| Function | Trigger | Effect |
|----------|---------|--------|
| `processNewIncident(bus, data)` | New incident created | AI report + escalation chain |
| `processNewLead(bus, data)` | New lead submitted | Auto-response + estimate |
| `processGuardCheckIn(bus, data)` | Guard checks in | Compliance tracking |
| `processPatrolScan(bus, data)` | Patrol checkpoint scanned | Checkpoint window watch |
| `handlePatrolMiss(bus, data)` | Checkpoint window expired | Alert chain |

All workflow functions accept an `EventBus` instance (created via `createEventBus()`) and a data payload. The EventBus handles persistence, routing, and queue dispatch internally.

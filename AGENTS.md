# AGENTS.md

Guide for AI agents working in the Over Time Security codebase.

## Project Overview

This is a **Turborepo monorepo** for a California-based private security firm. It contains three Next.js applications and four shared packages, plus shared tooling for TypeScript, ESLint, and Tailwind.

| App | Port | Description |
|-----|------|-------------|
| `apps/web` | 3000 | Public marketing site (no auth) |
| `apps/ops` | 3001 | Admin/supervisor/client portal |
| `apps/guard` | 3002 | Guard mobile PWA |

## Essential Commands

```bash
# Install dependencies
pnpm install

# Development (all apps)
pnpm dev

# Development (specific app)
pnpm dev:web
pnpm dev:ops
pnpm dev:guard

# Build
pnpm build              # builds web app
pnpm build:all          # builds everything

# Type checking
pnpm typecheck          # web app only
pnpm typecheck:all      # all packages

# Linting
pnpm lint

# Testing
pnpm test               # runs tests via turbo

# Database
pnpm db:generate        # generate Prisma client
pnpm db:migrate         # run migrations
pnpm db:push            # push schema changes
pnpm db:studio          # open Prisma Studio
pnpm db:seed            # seed database

# Automation workers (requires Redis)
pnpm workers            # production mode
pnpm workers:dev        # development mode with auto-restart
```

## Environment Setup

1. Copy `.env.example` to `.env` at the root
2. Start infrastructure: `docker compose -f docker/docker-compose.yml up -d`
3. Run `pnpm install` (this triggers `pnpm db:generate` via postinstall)
4. Run `pnpm db:migrate` to set up the database schema

### Required Environment Variables

| Variable | Required For | Description |
|----------|--------------|-------------|
| `DATABASE_URL` | All apps | PostgreSQL connection string |
| `REDIS_URL` | Automation workers | Redis connection string |
| `NEXTAUTH_SECRET` | ops app | Auth encryption key |
| `NEXTAUTH_URL` | ops app | Base URL for auth callbacks |
| `GEMINI_API_KEY` | Automation | Google Gemini API for AI features |
| `RESEND_API_KEY` | Automation | Email sending |
| `TWILIO_ACCOUNT_SID` | Automation | SMS via Twilio |
| `TWILIO_AUTH_TOKEN` | Automation | SMS via Twilio |
| `TWILIO_PHONE_NUMBER` | Automation | SMS sender number |

## Architecture Rules (Critical)

These rules must never be violated:

1. **`@ots/domain` has no UI dependencies** — Pure TypeScript with business logic, validators, and policies. No React, no DOM APIs.

2. **`@ots/ui` has no business logic** — Presentational components only. Data fetching and business rules go in apps.

3. **Apps import from packages, never from other apps** — No cross-app imports.

4. **Database access only through `@ots/db`** — Apps should never import Prisma directly; use `@ots/db`.

### Dependency Graph

```
                    @ots/domain (no UI deps)
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      @ots/ui          @ots/db       @ots/automation
          │                │                │
          └───────────────┼────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      apps/web        apps/ops        apps/guard
```

## Package Structure

### @ots/domain

Pure TypeScript package with:
- `src/models/` — Type definitions and enums
- `src/validators/` — Zod schemas for input validation
- `src/policies/` — RBAC permissions and business invariants
- `src/events/` — Event type definitions for automation

Exports:
```typescript
import { ... } from '@ots/domain';
import { ... } from '@ots/domain/models';
import { ... } from '@ots/domain/validators';
import { ... } from '@ots/domain/policies';
```

### @ots/db

Prisma ORM layer:
- `prisma/schema.prisma` — Database schema
- `src/client.ts` — Singleton Prisma client
- `src/index.ts` — Re-exports Prisma client and types

Usage:
```typescript
import { prisma, Lead, LeadStatus } from '@ots/db';
```

### @ots/ui

Shared UI components:
- `src/primitives/` — Basic elements (Button, Card, Input)
- `src/components/` — Composite components (PageHeader, Section)
- `src/tokens/` — Design tokens (colors, spacing)
- `src/styles/` — Global CSS

Exports:
```typescript
import { Button, Card } from '@ots/ui/primitives';
import { PageHeader, Section } from '@ots/ui/components';
import { colors } from '@ots/ui/tokens';
```

### @ots/automation

Background jobs and AI workflows:
- Runs as a **separate Node.js process** via `pnpm workers`
- Uses BullMQ + Redis for job queues
- Exports workflow functions for apps to call

Exports:
```typescript
import { createEventBus } from '@ots/automation';
import { processNewIncident, processNewLead } from '@ots/automation/workflows';
```

### @ots/auth

Authentication utilities:
- JWT-based session management
- Password hashing with bcryptjs
- Used by ops and guard apps

## Code Patterns

### API Route Pattern

API routes follow this pattern:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@ots/db";
import { z } from "zod";
import { createEventBus } from "@ots/automation";
import { processNewIncident } from "@ots/automation/workflows";

const schema = z.object({
  // validation schema
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    // 1. Database operation
    const record = await prisma.entity.create({ data });

    // 2. Emit event for automation (if applicable)
    const eventBus = createEventBus();
    await processWorkflow(eventBus, { ... });

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
```

### Validation

All input validation uses **Zod schemas** defined in `@ots/domain/validators`:

```typescript
import { createLeadSchema, createIncidentSchema } from '@ots/domain/validators';

// Use safeParse for graceful error handling
const result = createLeadSchema.safeParse(input);
if (!result.success) {
  // handle validation error
}
```

### RBAC Permissions

Use the `hasPermission` function from `@ots/domain/policies`:

```typescript
import { hasPermission, type Permission } from '@ots/domain/policies';

if (!hasPermission(user.role, 'incidents:write')) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### Database Queries

Always use the singleton prisma client from `@ots/db`:

```typescript
import { prisma } from '@ots/db';

const leads = await prisma.lead.findMany({
  where: { status: 'NEW' },
  orderBy: { createdAt: 'desc' },
});
```

## Testing

- **Framework**: Vitest
- **Location**: `__tests__/` directories within each package
- **Run**: `pnpm test` or `pnpm --filter @ots/domain test`

Test pattern:
```typescript
import { describe, it, expect } from 'vitest';
import { createLeadSchema } from '../validators/index.js';

describe('createLeadSchema', () => {
  it('accepts valid input', () => {
    const result = createLeadSchema.safeParse({ ... });
    expect(result.success).toBe(true);
  });
});
```

## Styling

### Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `base` | #05070a | Page background |
| `surface` | #0b0f14 | Cards, elevated surfaces |
| `text-primary` | #e6e6e6 | Primary text |
| `text-secondary` | #9ca3af | Muted text |
| `brand-accent` | #ff6200 | CTAs, highlights |

### Typography

- **Font**: Inter
- **Weights**: 300, 400, 500, 600, 700, 800, 900
- **Headings**: Uppercase, tight tracking, font-black

### Common Tailwind Patterns

```tsx
// Page title
<h1 className="text-[48px] md:text-[72px] font-black leading-[0.95] tracking-tighter uppercase">

// Section title
<h2 className="text-[36px] md:text-[48px] font-black leading-[0.95] tracking-tighter uppercase">

// Primary CTA
<button className="bg-brand-accent hover:bg-brand-accent-hover text-white px-8 py-5 font-black text-xs tracking-[0.2em] uppercase">

// Card
<div className="bg-surface border border-white/5 p-8 hover:border-brand-accent/40 transition-all duration-500">

// Section container
<section className="py-32 bg-base">
  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
```

### Animation (Motion/Framer Motion)

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
>
```

## Automation Workers

The automation package runs as a separate process and handles:
- Patrol miss alerts
- AI incident report generation
- Lead intake automation
- Compliance scoring
- Email/SMS notifications

### Starting Workers

```bash
# Ensure Redis is running first
docker compose -f docker/docker-compose.yml up -d redis

# Start workers
pnpm workers:dev
```

### Queue Names

- `alerts` — Patrol miss, shift no-show, escalation
- `ai` — Incident reports, summaries, estimates
- `reports` — HTML report rendering
- `notifications` — Email (Resend) and SMS (Twilio)
- `compliance` — Site compliance scoring

### Workflow Functions

```typescript
import { createEventBus } from '@ots/automation';
import {
  processNewIncident,
  processNewLead,
  processGuardCheckIn,
  processPatrolScan,
  handlePatrolMiss,
} from '@ots/automation/workflows';

const eventBus = createEventBus();
await processNewIncident(eventBus, { incidentId, siteId, severity, ... });
```

## Common Gotchas

1. **Prisma client must be generated** — Run `pnpm db:generate` after schema changes or fresh install. The postinstall script handles this automatically.

2. **Apps have different ports** — web:3000, ops:3001, guard:3002. Check the app's package.json if unsure.

3. **Automation requires Redis** — Workers will crash without Redis. Start it via Docker Compose.

4. **ESM imports in packages** — Packages use `.js` extensions in imports for ESM compatibility:
   ```typescript
   export * from './validators/index.js';  // Note the .js extension
   ```

5. **CUID IDs** — All database IDs are CUIDs. Validation: `z.string().cuid()`

6. **Snake_case in DB, camelCase in code** — Prisma maps between them via `@map()` annotations.

7. **TypeScript strict mode** — All packages use strict mode. Avoid `any`.

8. **CI runs typecheck + tests** — Push will fail if typecheck or tests fail.

## File Locations

| What | Where |
|------|-------|
| Database schema | `packages/db/prisma/schema.prisma` |
| Validators | `packages/domain/src/validators/` |
| RBAC policies | `packages/domain/src/policies/rbac.ts` |
| Shared components | `packages/ui/src/components/` |
| Design tokens | `packages/ui/src/tokens/` |
| API routes | `apps/*/src/app/api/` |
| Environment example | `.env.example` |
| Docker compose | `docker/docker-compose.yml` |

## Documentation

| Document | Location |
|----------|----------|
| Architecture | `docs/ARCHITECTURE.md` |
| Runbook | `docs/RUNBOOK.md` |
| Style Guide | `docs/STYLEGUIDE.md` |
| Security Policy | `docs/SECURITY.md` |
| PRD | `docs/PRD.md` |

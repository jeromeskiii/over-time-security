# Over Time Security

California-based private security firm providing professional protection services for commercial, construction, event, residential, and institutional clients across the state.

## Overview

This is a monorepo containing all applications and shared packages for Over Time Security.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.8 |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL + Prisma |
| Monorepo | pnpm + Turborepo |
| Animation | Motion (Framer Motion) |
| Icons | Lucide React |

## Project Structure

```
over-time-security/
├── apps/
│   ├── web/              # Marketing site (port 3000)
│   ├── ops/              # Operations portal (port 3001)
│   └── guard/            # Guard mobile PWA (port 3002)
├── packages/
│   ├── db/               # Prisma schema + client
│   ├── domain/           # Types, validators, policies
│   ├── ui/               # Shared components + tokens
│   └── automation/       # Jobs, workflows, AI
├── tooling/
│   ├── eslint/
│   ├── tsconfig/
│   └── tailwind/
├── docker/
│   ├── postgres/
│   └── redis/
└── docs/
    ├── PRD.md
    ├── RUNBOOK.md
    ├── ARCHITECTURE.md
    ├── SECURITY.md
    └── STYLEGUIDE.md
```

## Applications

| App | Port | Description |
|-----|------|-------------|
| `web` | 3000 | Public marketing site |
| `ops` | 3001 | Admin/supervisor/client portal |
| `guard` | 3002 | Guard mobile PWA |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL 15+ (or use Docker)

### Install

```bash
pnpm install
```

### Environment Variables

```bash
cp .env.example .env
```

For local development, keep cross-app URLs aligned:

```bash
WEB_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### Database Setup

```bash
# Start PostgreSQL via Docker (optional)
cd docker && docker-compose up -d

# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate
```

### Development

```bash
# Start all apps
pnpm dev

# Start specific app
pnpm dev:web    # Marketing site
pnpm dev:ops    # Operations portal
pnpm dev:guard  # Guard mobile app
```

The marketing site submits lead and dispatch intake forms to the ops app API. When deploying the static web app, `NEXT_PUBLIC_API_URL` must point at the reachable ops origin for that environment.

### Build

```bash
pnpm build
```

### Type Check

```bash
pnpm typecheck
```

## Architecture Rules

1. **`packages/domain`** has no UI dependencies — pure TypeScript with business logic
2. **`packages/ui`** has no business logic — presentational components only
3. **Apps import from packages, never from other apps**
4. **Database access only through `@ots/db` package**

## License

Private — All rights reserved. Over Time Security.

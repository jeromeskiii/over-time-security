# Product Requirements Document

## Over Time Security

### Overview

Over Time Security is a California-based private security company providing armed and unarmed guards, mobile patrols, fire watch services, event security, and executive protection.

---

## Applications

### 1. Marketing Site (`apps/web`)
- Public-facing website
- Lead generation via quote forms
- Service and location pages
- SEO-optimized content

### 2. Operations Portal (`apps/ops`)
- Admin dashboard for company management
- Supervisor shift scheduling
- Client portal for reports and billing
- Guard management

### 3. Guard Mobile App (`apps/guard`)
- PWA for mobile devices
- Check-in/check-out
- Patrol logging
- Incident reporting
- GPS tracking

---

## Packages

### `@ots/db`
- Prisma schema and client
- Database migrations
- Seeding utilities

### `@ots/domain`
- TypeScript types and interfaces
- Zod validation schemas
- Business rules and policies (RBAC)

### `@ots/ui`
- Shared React components
- Design tokens
- Tailwind CSS utilities

### `@ots/automation`
- Background jobs
- AI report generation
- Workflow orchestration

---

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.8
- **Database**: PostgreSQL with Prisma
- **Styling**: Tailwind CSS v4
- **Monorepo**: pnpm + Turborepo

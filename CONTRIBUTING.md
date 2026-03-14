# Contributing

## Development Setup

### Prerequisites

- Node.js 20+
- pnpm 10+
- Docker (for PostgreSQL and Redis)

### Initial Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Ensure cross-app URLs match local ports
# WEB_APP_URL=http://localhost:3000
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Start infrastructure
docker compose -f docker/docker-compose.yml up -d

# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Start development servers
pnpm dev
```

### Running Individual Apps

```bash
pnpm dev:web     # Marketing site (port 3000)
pnpm dev:ops     # Operations portal (port 3001)
pnpm dev:guard   # Guard mobile app (port 3002)
```

## Pull Requests

### Before Pushing

```bash
# Type check
pnpm typecheck:all

# Run tests
pnpm test

# Lint
pnpm lint
```

### PR Guidelines

- One PR per logical change
- Keep PRs focused and reviewable
- Reference related issues: `Closes #123` or `Fixes #456`
- Update `.env.example` if adding new environment variables
- Include DB migration if schema changes
- Keep `NEXT_PUBLIC_*` values correct for static web builds

### Commit Messages

Use conventional commit format:

```
feat: add new feature
fix: resolve bug
chore: maintenance task
docs: update documentation
refactor: code cleanup
test: add/update tests
```

## Architecture Rules

1. **`@ots/domain`** — No UI dependencies, pure TypeScript
2. **`@ots/ui`** — No business logic, presentational only
3. **Apps import from packages, never from other apps**
4. **Database access only through `@ots/db`**

## Project Structure

```
apps/
  web/      # Marketing site (public, no auth)
  ops/      # Admin/supervisor portal
  guard/    # Guard mobile PWA
packages/
  db/       # Prisma schema and client
  domain/   # Types, validators, policies
  ui/       # Shared components
  auth/     # Authentication utilities
  automation/ # Background jobs and workflows
```

## Getting Help

- Check `docs/ARCHITECTURE.md` for system design
- Check `docs/RUNBOOK.md` for operational details
- Check `AGENTS.md` for comprehensive codebase guide

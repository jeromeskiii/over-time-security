# Documentation Index

## Architecture & Design

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Monorepo structure, dependency graph, implementation status |
| [SYSTEM-SPINE.md](SYSTEM-SPINE.md) | Core production vertical slice (`Client -> Quote -> Shift -> Guard -> Incident -> Report`) |
| [STYLEGUIDE.md](STYLEGUIDE.md) | Design tokens, typography, component patterns |
| [PRD.md](PRD.md) | Product requirements |

## Operations

| Document | Description |
|----------|-------------|
| [RUNBOOK.md](RUNBOOK.md) | Development setup, database ops, troubleshooting |
| [REPO-STABILIZATION.md](REPO-STABILIZATION.md) | Cleanup checklist to keep repo structure stable |
| [deployment.md](deployment.md) | Vercel deployment process and configuration |
| [SECURITY.md](SECURITY.md) | Authentication, data protection, API security |

## Quick Reference

### Common Commands

```bash
pnpm dev          # Start all apps
pnpm build        # Build for production
pnpm typecheck    # Type check
pnpm test         # Run tests
pnpm db:generate  # Generate Prisma client
pnpm db:migrate   # Run migrations
```

### App Ports

| App | Port |
|-----|------|
| web | 3000 |
| ops | 3001 |
| guard | 3002 |

### Key Files

| File | Purpose |
|------|---------|
| `CONTRIBUTING.md` | Development guidelines |
| `AGENTS.md` | AI assistant context |
| `.env.example` | Environment variables template |

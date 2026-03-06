# Deployment

## Overview

This monorepo deploys multiple Next.js applications to Vercel:

| App | Target | Build Output |
|-----|--------|--------------|
| `apps/web` | Static export | `apps/web/out` |
| `apps/ops` | Server-side | Vercel serverless |
| `apps/guard` | Server-side | Vercel serverless |

## Prerequisites

- Vercel CLI: `npm i -g vercel`
- Project linked in Vercel dashboard
- Environment variables configured in Vercel

## Vercel Configuration

### Root `vercel.json`

```json
{
  "framework": null,
  "installCommand": "pnpm install",
  "buildCommand": "pnpm build && rm -rf dist && cp -r apps/web/out dist",
  "outputDirectory": "dist"
}
```

### Per-App Configuration

Each app has its own `next.config.ts`:

```typescript
// apps/web - Static export
const nextConfig = {
  output: "export",
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

// apps/ops, apps/guard - Server-side
const nextConfig = {
  // Standard Next.js config
};
```

## Deployment Process

### Automatic (CI/CD)

Pushes to `main` trigger automatic deployment via GitHub Actions:

1. CI workflow runs typecheck + build for all apps
2. On success, deploy workflow runs
3. Web app deploys automatically
4. Ops/Guard apps deploy via `workflow_dispatch`

### Manual Deployment

```bash
# Build locally first
pnpm build

# Deploy specific app
cd apps/web && vercel --prod
cd apps/ops && vercel --prod
cd apps/guard && vercel --prod
```

## Environment Variables

Configure in Vercel dashboard (Settings → Environment Variables):

### Required for all apps
- `DATABASE_URL` - PostgreSQL connection string

### Ops app only
- `NEXTAUTH_SECRET` - Session encryption key
- `NEXTAUTH_URL` - Production URL

### Automation (if using workers)
- `REDIS_URL`
- `GEMINI_API_KEY`
- `RESEND_API_KEY`
- `TWILIO_*` variables

## Troubleshooting

### "Output directory does not exist"

**Cause:** Dashboard has manual override conflicting with `vercel.json`

**Fix:**
1. Go to Vercel dashboard → Settings → General
2. Find "Output Directory" field
3. Clear any value (leave empty)
4. Save and redeploy

### Build fails locally but not in CI

**Cause:** Local environment differs from CI

**Fix:**
```bash
# Clean and rebuild
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm -rf .turbo apps/*/.next packages/*/.next
pnpm install
pnpm build
```

### Prisma client errors

**Cause:** Client not generated

**Fix:**
```bash
pnpm db:generate
```

### Static export shows 404

**Cause:** Next.js routing with `output: "export"` requires careful handling

**Fix:**
- Ensure all pages use static paths
- Check `next.config.ts` has correct `outputFileTracingRoot`
- Verify build output exists at `apps/web/out/`

## GitHub Actions

### CI Workflow (`ci.yml`)

Runs on push to `main` and PRs:
- Typecheck all apps and packages
- Run domain tests
- Build all apps

### Deploy Workflow (`deploy.yml`)

Runs after CI success:
- `deploy-web`: Automatic on main push
- `deploy-ops`, `deploy-guard`: Manual via `workflow_dispatch`

## Monitoring

- Check deployment logs in Vercel dashboard
- Monitor GitHub Actions for CI failures
- Review application logs in Vercel → Deployments → Function Logs

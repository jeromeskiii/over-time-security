# Repo Stabilization

Baseline cleanup tasks before scaling feature work.

## Task 2 Checklist

1. **Commit pending changes**
   - Commit all currently staged and unstaged production work as one coherent checkpoint.

2. **Move root components**
   - Root-level `app/` and `components/` are not valid in this monorepo shape.
   - App code belongs under `apps/*/src`.

3. **Decide orchestrator status**
   - `packages/orchestrator` is explicitly **experimental / not wired to production**.
   - Do not import it from apps or core packages until promoted with tests and CI integration.

4. **Lock Node version**
   - Pin Node to `20.19.0` (`.nvmrc`, `.node-version`, `package.json#volta`, strict engine range).

5. **Verify env schema**
   - Run `pnpm env:verify`.
   - This checks:
     - `.env.example` covers all `process.env.*` usage in `apps/*` and `packages/*`
     - forbidden root app folders (`app`, `components`) are absent

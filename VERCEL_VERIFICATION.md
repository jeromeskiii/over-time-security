# Vercel Dashboard Verification Checklist

**Date:** March 5, 2026  
**Commit:** 129f868 (Fix Vercel output directory for web app)  
**Status:** Ready for deployment

## ✅ Repository Configuration - VERIFIED

### vercel.json
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "installCommand": "pnpm install",
  "buildCommand": "pnpm build",
  "outputDirectory": "apps/web/out"
}
```
**Status:** ✅ Correct - Points to `apps/web/out`

### apps/web/next.config.ts
```typescript
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",  // ← Static export configured
  outputFileTracingRoot: path.join(__dirname, "../.."),
  // ...
};
```
**Status:** ✅ Correct - Using static export

### Local Build Verification
```bash
$ ls -la apps/web/out/
total 32
-rw-r--r--  404.html
-rw-r--r--  index.html
drwxr-xr-x  _next/
```
**Status:** ✅ Build output confirmed in correct location

---

## 📋 Vercel Dashboard Settings - MANUAL VERIFICATION REQUIRED

### ⚠️ CRITICAL: Check Project Settings

1. **Navigate to:** Vercel Project Dashboard → Settings → General
2. **Look for:** "Output Directory" field
3. **If it shows:** `dist`, `public`, or any other value
   - **ACTION REQUIRED:** Clear the manual override
   - Vercel should read from `vercel.json` instead

4. **Expected state:** 
   - Output Directory field should be **EMPTY** (using vercel.json)
   - OR shows **`apps/web/out`** (if auto-populated from config)

### Additional Checks

- [ ] Build command should be: `pnpm build`
- [ ] Install command should be: `pnpm install`
- [ ] Root directory should be: `.` (monorepo root)
- [ ] Framework should be: Next.js (auto-detected)
- [ ] Node.js version: 20.x or higher

---

## 🚀 Deployment Instructions

### Option 1: Automatic Deployment (Recommended)
Push a new commit to `origin/main` - Vercel should auto-deploy:
```bash
git log -1 --oneline
# Output: 129f868 Fix Vercel output directory for web app
```

### Option 2: Manual Redeploy from Dashboard
1. Go to Vercel Project Dashboard
2. Click "Deployments" tab
3. Click the three dots (⋯) next to the latest deployment
4. Select "Redeploy"

### Option 3: Commit the pending turbo.json cleanup (optional)
```bash
git add turbo.json
git commit -m "chore: update turbo outputs for static export"
git push origin main
```

---

## 🔍 Verification After Deploy

After deployment completes:

1. Check deployment logs in Vercel dashboard
2. Look for: `✓ Build completed successfully`
3. Verify output shows: `apps/web/out` as the deployment directory
4. Test the live deployment URL

---

## 📝 Files Modified in Commit 129f868

- ✅ `apps/web/next.config.ts` - Added `output: "export"`
- ✅ `vercel.json` - Set `"outputDirectory": "apps/web/out"`

---

## ⏳ Pending Local Changes

**File:** `turbo.json` (uncommitted)
- **Change:** Remove `.next/**` and `!.next/cache/**` from build outputs (keeping only `dist/**`)
- **Reason:** Static export doesn't require `.next` as a cached output
- **Status:** Optional to commit now or defer to next task

---

## 🆘 Troubleshooting

**If deployment still fails with "dist" error:**
1. Open Vercel dashboard
2. Go to Settings → General
3. Locate "Output Directory"
4. **Delete any custom value** - leave it empty
5. Redeploy

**If "apps/web/out" doesn't exist locally:**
```bash
pnpm build  # Rebuild locally
ls apps/web/out  # Should show 404.html, index.html, _next/
```

---

## Summary

| Item | Status | Action |
|------|--------|--------|
| Config files in repo | ✅ Ready | None |
| Local build verification | ✅ Passed | None |
| Vercel dashboard settings | ⚠️ **VERIFY** | **Check Output Directory override** |
| Commit on origin/main | ✅ Deployed | None |
| Ready to deploy | ✅ Yes | Trigger new deploy after dashboard check |



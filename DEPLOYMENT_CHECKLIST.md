# ✅ VERCEL DEPLOYMENT CHECKLIST

**Project:** over-time-security  
**Date:** March 5, 2026  
**Target:** Resolve Vercel deployment after static export migration

---

## 📋 Pre-Deployment Checklist

### Repository Level (LOCAL) - ALL VERIFIED ✅

- [x] `vercel.json` exists with correct config
- [x] `apps/web/next.config.ts` has `output: "export"`
- [x] Build output exists at `apps/web/out/`
- [x] Commit 129f868 pushed to `origin/main`
- [x] Local main branch in sync with remote

### Vercel Dashboard Level (MANUAL) - VERIFICATION REQUIRED ⚠️

- [ ] **Open Vercel dashboard:** https://vercel.com/dashboard
- [ ] **Navigate to:** Project → Settings → General
- [ ] **Check field:** "Output Directory"
- [ ] **If has value:** Delete it
- [ ] **Click:** Save
- [ ] **Result:** Field should be empty or auto-show "apps/web/out"

### Deployment Trigger

- [ ] **Option A:** Redeploy from dashboard (Deployments → ⋯ → Redeploy)
- [ ] **Option B:** Commit turbo.json and push (auto-deploy)
- [ ] **Option C:** Wait for auto-deploy if already configured

---

## 🚀 Deployment Process

### Step 1: Dashboard Verification (5 minutes)

```
Action: Check and clear Output Directory override
Time: ~5 minutes
Critical: YES - This is why it was failing
```

**Exact steps:**
1. Go to https://vercel.com/dashboard
2. Click your project
3. Click Settings (top nav)
4. Click General (left sidebar)
5. Find "Output Directory" field
6. If it contains: `dist` or any value → DELETE
7. Click Save

**Expected result:** Field is empty (or shows auto-detected value)

---

### Step 2: Trigger Redeploy (1 minute)

**After clearing the override, redeploy immediately:**

1. Go to Vercel dashboard
2. Click "Deployments" tab
3. Click the latest deployment (at top)
4. Click the three dots menu (⋯)
5. Select "Redeploy"
6. Confirm when prompted

**Expected result:** New deployment starts building

---

### Step 3: Monitor Build (2-3 minutes)

**Watch the deployment:**

1. Stay on the Deployments page
2. Watch the build progress
3. Look for build logs to appear
4. Wait for completion message

**Success indicators:**
- ✅ Build log shows "Build completed successfully"
- ✅ Deployment status shows checkmark (✓ Ready)
- ✅ Preview URL is clickable

**Failure indicators:**
- ❌ Red error message in logs
- ❌ Message about missing output directory
- ❌ Reference to "dist" directory

---

### Step 4: Verify Deployment (2 minutes)

**After deployment completes:**

1. Click "Visit" or the preview URL
2. Site should load without 404
3. Check browser console (F12) for errors
4. Navigate to different pages to verify routing

**What to expect:**
- ✅ Home page loads
- ✅ About/Contact/Services pages load
- ✅ Images display correctly
- ✅ No 404 errors

---

## 🎯 The Three Scenarios

### Scenario 1: Dashboard is CORRECT (Output Directory Empty)

```
Status: ✅ PASS
Action: Proceed to redeploy
Time: ~5 minutes
```

- [x] Output Directory field is empty
- [ ] Trigger redeploy
- [ ] Monitor build
- [ ] Test site

---

### Scenario 2: Dashboard Shows `apps/web/out`

```
Status: ✅ PASS
Action: Proceed to redeploy
Time: ~5 minutes
```

- [x] Output Directory shows "apps/web/out"
- [ ] Trigger redeploy (to use it)
- [ ] Monitor build
- [ ] Test site

---

### Scenario 3: Dashboard Shows `dist` or Other Value

```
Status: ❌ FAIL → REQUIRES FIX
Action: Delete override, then redeploy
Time: ~10 minutes
```

- [ ] Found custom Output Directory value
- [ ] Delete the value
- [ ] Click Save
- [ ] Trigger redeploy
- [ ] Monitor build
- [ ] Test site

---

## 🆘 Troubleshooting Flowchart

```
Deploy Started?
├─ NO: Check that you clicked Redeploy in dashboard
├─ YES: Go to next
    │
    Build Completed Successfully?
    ├─ NO: Check error in build logs (see below)
    ├─ YES: Go to next
        │
        Site loads without errors?
        ├─ NO: Hard refresh (Cmd+Shift+R)
        ├─ YES: ✅ SUCCESS! Done.

ERROR in Build Logs?
├─ "Output directory does not exist"
│   └─ OUTPUT DIRECTORY OVERRIDE IS STILL SET
│       Action: Go back to dashboard, check Settings → General
│       Delete any value in Output Directory field
│       Save and redeploy
│
├─ "dist not found"
│   └─ SAME ISSUE - Override still set
│       Action: Delete the override and redeploy
│
├─ "Build failed" (other)
│   └─ Run locally first:
│       $ pnpm build
│       Look at local error, fix it, commit, and push
│       Then redeploy in Vercel
```

---

## ⏱️ Timeline

| Step | Action | Time | Status |
|------|--------|------|--------|
| 1 | Dashboard verification | 5 min | ⚠️ TODO |
| 2 | Clear override if found | 2 min | ⚠️ TODO |
| 3 | Trigger redeploy | 1 min | ⚠️ TODO |
| 4 | Monitor build | 3 min | ⚠️ TODO |
| 5 | Test site | 2 min | ⚠️ TODO |
| **Total** | **End-to-end** | **~13 min** | ⏳ |

---

## 📸 Screenshots to Look For

### When Checking Dashboard Settings

```
Look for this field:
┌──────────────────────────────────────────┐
│ Output Directory                         │
│ [________________________________]       │
│ Leave empty to use vercel.json config    │
└──────────────────────────────────────────┘

✅ Correct states:
- [________________________________]  (EMPTY)
- [apps/web/out_________________]  (AUTO-DETECTED)

❌ Wrong states:
- [dist_____________________]
- [public___________________]
- [build____________________]
- [.next____________________]
```

### When Viewing Build Progress

```
✅ Success:
✓ Build completed successfully
✓ Ready to deploy...
✓ Deployment complete [...]

❌ Failure:
✗ Build failed
✗ Output directory does not exist
✗ apps/web/out not found
```

---

## 📞 Quick Reference

### Files to Know

| File | Purpose | Status |
|------|---------|--------|
| `vercel.json` | Vercel config file | ✅ Correct |
| `apps/web/next.config.ts` | Next.js config | ✅ Correct |
| `turbo.json` | Build orchestration | ⚠️ Has pending changes |
| `apps/web/out/` | Build output | ✅ Exists |

### Commands to Run Locally

```bash
# Verify config locally
pnpm build                    # Should work

# Check output
ls apps/web/out              # Should show files

# Git status
git log -1 --oneline         # Should show 129f868
git status                   # Should be clean or only turbo.json

# If needed, rebuild
rm -rf apps/web/out          # Clear old build
pnpm build                   # Rebuild
```

---

## ✨ Success Criteria

✅ **You'll know it worked when:**

1. Vercel dashboard shows deployment ✓ Ready
2. Site loads without 404 errors
3. Pages navigate correctly
4. Images display properly
5. No errors in browser console

---

## 🎉 Completion

Once the deployment succeeds and the site works:

- ✅ Vercel issue is resolved
- ✅ Static export migration complete
- ✅ Site is live and functional

**Optional cleanup:**
```bash
git add turbo.json
git commit -m "chore: update turbo outputs for static export"
git push origin main
```

---

**Last Updated:** March 5, 2026  
**Status:** Ready for dashboard verification  
**Next Action:** Visit https://vercel.com/dashboard and follow Step 1  


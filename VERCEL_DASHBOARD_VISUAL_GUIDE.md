# Vercel Dashboard - Visual Navigation Guide

## 🗺️ Finding the Output Directory Setting

### Step 1: Access Vercel Dashboard

**URL:** `https://vercel.com/dashboard`

```
┌─────────────────────────────────────────────────────────┐
│  Vercel Dashboard                          [Avatar] [⚙️]  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Your Projects                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │  🔍 Search projects...                              │ │
│  │                                                       │ │
│  │  📦 over-time-security    [Visit] [⋯]              │ │ ← CLICK HERE
│  │     Production Domain: ...                          │ │
│  │                                                       │ │
│  │  Other projects...                                  │ │
│  │                                                       │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Action:** Click on your **over-time-security** project

---

### Step 2: Open Project Page

After clicking the project, you'll see the project dashboard:

```
┌──────────────────────────────────────────────────────────────┐
│  over-time-security         [Edit]  [Settings] [⋯] [Docs]   │
├──────────────────────────────────────────────────────────────┤
│  📋 Deployments  🎯 Analytics  ⚙️ Settings  🔗 Environment   │
│  ────────────────────────────────────────────────────────────│
│                                                               │
│  Deployments (showing recent builds...)                      │
│                                                               │
│  ✓ 2 hours ago      main    Build completed                  │
│  ✓ 5 hours ago      main    Build completed                  │
│  ✗ 1 day ago        main    Build failed                     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Action:** Click the **Settings** tab (top navigation)

---

### Step 3: Access Project Settings

```
┌──────────────────────────────────────────────────────────────┐
│  over-time-security         [Edit]  [Settings] [⋯] [Docs]   │
├──────────────────────────────────────────────────────────────┤
│  🔧 Project Settings                                         │
│  ────────────────────────────────────────────────────────────│
│                                                               │
│  Left Sidebar Menu:                                          │
│  ┌─────────────────────────────────┐                        │
│  │ 📋 General              ← CLICK │                        │
│  │ 🔑 Environment                  │                        │
│  │ 📦 Build & Development          │                        │
│  │ 🌐 Domains                      │                        │
│  │ 🔒 Security                     │                        │
│  │ 💳 Billing                      │                        │
│  └─────────────────────────────────┘                        │
│                                                               │
│  Main Content Area:                                          │
│  (will show General settings after clicking)                 │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Action:** Click on **General** in the left sidebar

---

### Step 4: Find Output Directory Field

Once you click "General", scroll down to find this section:

```
┌──────────────────────────────────────────────────────────────┐
│  ⚙️ General Settings                                         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  [Various settings above...]                                 │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  Build & Deployment                                    │  │
│  │  ─────────────────────                                 │  │
│  │                                                          │  │
│  │  Framework Preset:        [Next.js ▼]                 │  │
│  │                                                          │  │
│  │  Build Command:           [pnpm build]                │  │
│  │                                                          │  │
│  │  Output Directory:        [_____________] ← THIS ONE   │  │
│  │                           Leave empty to use           │  │
│  │                           vercel.json config           │  │
│  │                                                          │  │
│  │  Install Command:         [pnpm install]              │  │
│  │                                                          │  │
│  │  Node.js Version:         [20.x ▼]                    │  │
│  │                                                          │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  [More settings below...]                                    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**This is the field you need to check!**

---

## ✅ What You Should See

### Scenario 1: Correct State (Empty) ✅

```
Output Directory:    [___________________________]
                     (empty field)
```
**Action:** No action needed. Proceed to redeploy.

---

### Scenario 2: Correct State (Auto-populated) ✅

```
Output Directory:    [apps/web/out_______________]
                     (auto-detected from vercel.json)
```
**Action:** No action needed. Proceed to redeploy.

---

### Scenario 3: Wrong State ❌

```
Output Directory:    [dist_______________________]
                     ↑ DELETE THIS
```

OR

```
Output Directory:    [public_____________________]
                     ↑ DELETE THIS
```

**Action Required:**
1. Click in the field (to position cursor)
2. Select all (Cmd+A on Mac, Ctrl+A on Windows/Linux)
3. Delete (Press Delete or Backspace)
4. Result should be empty field
5. Click "Save" button (usually at bottom of page)

---

## 🔍 Detailed Instructions for Clearing Field

### If Output Directory Shows a Custom Value:

```
BEFORE (Showing "dist"):
┌────────────────────────────────┐
│ Output Directory               │
│ [dist_______________________] │
└────────────────────────────────┘

ACTION 1: Click in the field
┌────────────────────────────────┐
│ Output Directory               │
│ [|dist_____________________] │  ← cursor here
└────────────────────────────────┘

ACTION 2: Select all (Cmd+A or Ctrl+A)
┌────────────────────────────────┐
│ Output Directory               │
│ [████████████████████████████] │  ← all selected
└────────────────────────────────┘

ACTION 3: Delete
┌────────────────────────────────┐
│ Output Directory               │
│ [|______________________________] │  ← now empty
└────────────────────────────────┘

ACTION 4: Scroll down and click "Save"
        ┌──────────┐
        │  Save  │  ← Click here
        └──────────┘
        (Usually at bottom of settings page)

RESULT: Field is now empty ✅
        Page shows "Changes saved"
```

---

## 📍 Alternative: Direct Link

If you can't find the settings, you can try going directly to:

```
https://vercel.com/dashboard/[YOUR_PROJECT_NAME]/settings/general
```

Replace `[YOUR_PROJECT_NAME]` with your actual project name.

For this project, it might be:
```
https://vercel.com/dashboard/over-time-security/settings/general
```

---

## 💾 Saving Your Changes

After deleting the Output Directory value:

```
SETTINGS PAGE:

    ┌─────────────────────────────────────┐
    │  [Cancel]                  [Save]  │  ← Click Save
    └─────────────────────────────────────┘

CONFIRMATION:

    ┌──────────────────────────────────────────┐
    │  ✓ Changes saved successfully            │  ← Wait for this
    └──────────────────────────────────────────┘
```

---

## 🔄 After Saving: Trigger Redeploy

Once you've saved the changes:

```
STEP 1: Go to Deployments tab
┌──────────────────────────────────────────┐
│  📋 Deployments  🎯 Analytics  ⚙️ Settings│
│  ────────────────────────────────────────│
└──────────────────────────────────────────┘

STEP 2: Find latest deployment (top of list)
┌──────────────────────────────────────────┐
│  Deployment List                          │
│  ┌──────────────────────────────────────┐ │
│  │ ✓ 2 hours ago  main  Ready  [⋯]    │ │ ← Click ⋯
│  │ ✓ 5 hours ago  main  Ready  [⋯]    │ │
│  └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘

STEP 3: Click three dots menu and select "Redeploy"
┌──────────────────────────────────┐
│  More Options ▼                   │
│  ──────────────────────────────── │
│  📊 View Deployment               │
│  🔄 Redeploy          ← Click here│
│  🗑️ Delete                         │
│  ├ Copy URL                       │
│  └ ...                            │
└──────────────────────────────────┘

STEP 4: Confirm redeploy
┌──────────────────────────────────┐
│  Redeploy?                        │
│                                  │
│  This will rebuild and           │
│  redeploy the project.           │
│                                  │
│  [Cancel]  [Redeploy] ← Click    │
└──────────────────────────────────┘

RESULT: New deployment starts building ✅
```

---

## ⏱️ Timeline from This Point

| Action | Time | What to Look For |
|--------|------|------------------|
| Save settings | ~10s | Confirmation message |
| Trigger redeploy | ~5s | Deployment list updates |
| Build (build logs appear) | ~2-3 min | Watch the progress |
| Build completes | ~3 min | "✓ Build completed successfully" |
| Deployment ready | ~1 min | Status shows "✓ Ready" |
| **Total** | **~8-10 min** | Live deployment! |

---

## 📞 Still Confused?

Check:
1. Are you logged into Vercel with the correct account?
2. Are you looking at the right project?
3. Is the Output Directory field visible on the General settings page?
4. If you can't find it, scroll down - it might be further down the page

**Common location:** Grouped with Build Command, Framework Preset settings

---

**Visual Guide Created:** March 5, 2026  
**For:** Vercel Dashboard navigation  
**Next:** Follow these steps and then refer to DEPLOYMENT_CHECKLIST.md  


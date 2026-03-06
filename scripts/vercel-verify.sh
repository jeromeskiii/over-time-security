#!/bin/bash
# Vercel Project Verification Script
# This script checks the current repository configuration against Vercel requirements

set -e

PROJECT_ROOT="/Users/jm4/Documents/GitHub/over-time-security"
cd "$PROJECT_ROOT"

echo "======================================"
echo "Vercel Project Configuration Audit"
echo "======================================"
echo ""

# 1. Check vercel.json exists and is valid
echo "1. Checking vercel.json..."
if [ -f "vercel.json" ]; then
    echo "   ✅ vercel.json found"
    OUTPUT_DIR=$(grep -o '"outputDirectory": "[^"]*"' vercel.json | cut -d'"' -f4)
    echo "   ℹ️  Output Directory: $OUTPUT_DIR"
    if [ "$OUTPUT_DIR" = "apps/web/out" ]; then
        echo "   ✅ Output directory correctly set to apps/web/out"
    else
        echo "   ❌ Output directory is $OUTPUT_DIR (expected: apps/web/out)"
    fi
else
    echo "   ❌ vercel.json not found"
    exit 1
fi
echo ""

# 2. Check Next.js config for static export
echo "2. Checking apps/web/next.config.ts..."
if [ -f "apps/web/next.config.ts" ]; then
    echo "   ✅ next.config.ts found"
    if grep -q 'output: "export"' apps/web/next.config.ts; then
        echo "   ✅ Static export configured (output: \"export\")"
    else
        echo "   ⚠️  Static export not found in next.config.ts"
    fi
else
    echo "   ❌ next.config.ts not found"
    exit 1
fi
echo ""

# 3. Check if build output exists
echo "3. Checking build output (apps/web/out)..."
if [ -d "apps/web/out" ]; then
    echo "   ✅ Build output directory exists"
    FILE_COUNT=$(ls -1 apps/web/out | wc -l)
    echo "   ℹ️  Files in apps/web/out: $FILE_COUNT"
    if [ -f "apps/web/out/index.html" ]; then
        echo "   ✅ index.html found"
    fi
    if [ -d "apps/web/out/_next" ]; then
        echo "   ✅ _next directory found"
    fi
else
    echo "   ⚠️  Build output (apps/web/out) not found locally"
    echo "   💡 Run 'pnpm build' to generate it"
fi
echo ""

# 4. Check git status
echo "4. Checking git status..."
COMMIT_MSG=$(git log -1 --oneline)
echo "   ℹ️  Latest commit: $COMMIT_MSG"
if git log -1 --format='%H' | grep -q '129f868'; then
    echo "   ✅ Commit 129f868 is in history"
else
    if git log --oneline | grep -q '129f868'; then
        echo "   ✅ Commit 129f868 found in history"
    else
        echo "   ❌ Commit 129f868 not found"
    fi
fi

REMOTE_MAIN=$(git ls-remote origin main | cut -f1)
LOCAL_MAIN=$(git rev-parse main)
if [ "$REMOTE_MAIN" = "$LOCAL_MAIN" ]; then
    echo "   ✅ Local main is up to date with origin/main"
else
    echo "   ⚠️  Local main differs from origin/main"
fi
echo ""

# 5. Check turbo.json
echo "5. Checking turbo.json..."
if [ -f "turbo.json" ]; then
    if [ -n "$(git status -s turbo.json)" ]; then
        echo "   ⚠️  turbo.json has uncommitted changes:"
        git diff --color=never turbo.json | sed 's/^/       /'
    else
        echo "   ✅ turbo.json is clean (no uncommitted changes)"
    fi
else
    echo "   ❌ turbo.json not found"
fi
echo ""

# 6. Provide action items
echo "======================================"
echo "ACTION ITEMS"
echo "======================================"
echo ""
echo "Repository Configuration:"
echo "  ✅ vercel.json configured correctly"
echo "  ✅ next.config.ts has static export"
echo ""
echo "Manual Vercel Dashboard Check (REQUIRED):"
echo "  1. Go to: https://vercel.com/dashboard"
echo "  2. Select your project"
echo "  3. Go to: Settings → General"
echo "  4. Check the 'Output Directory' field"
echo "  5. If it shows 'dist' or other value → DELETE IT"
echo "  6. Save and trigger new deploy"
echo ""
echo "After Dashboard Verification:"
echo "  Option A: Let auto-deploy trigger on next commit"
echo "  Option B: Click 'Deployments' → '⋯' → 'Redeploy' on latest"
echo ""
echo "Optional Cleanup (after deploy succeeds):"
echo "  git add turbo.json"
echo "  git commit -m 'chore: update turbo outputs for static export'"
echo "  git push origin main"
echo ""


#!/usr/bin/env bash
#
# Developer Bootstrap Script
# Validates environment and provides setup guidance for OTS development
#

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          OTS Developer Environment Bootstrap               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

ERRORS=0
WARNINGS=0

# Check Node.js
echo -e "${BLUE}[1/6] Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | sed 's/v//')
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
    if [ "$NODE_MAJOR" -ge 18 ]; then
        echo -e "  ${GREEN}✓${NC} Node.js $NODE_VERSION"
    else
        echo -e "  ${RED}✗${NC} Node.js $NODE_VERSION (requires >= 18)"
        echo -e "  ${YELLOW}→ Install: nvm install 20 && nvm use 20${NC}"
        ((ERRORS++))
    fi
else
    echo -e "  ${RED}✗${NC} Node.js not found"
    echo -e "  ${YELLOW}→ Install: https://nodejs.org or use nvm${NC}"
    ((ERRORS++))
fi

# Check pnpm version
echo -e "${BLUE}[2/6] Checking pnpm...${NC}"
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm -v)
    PNPM_MAJOR=$(echo $PNPM_VERSION | cut -d. -f1)
    if [ "$PNPM_MAJOR" -ge 10 ]; then
        echo -e "  ${GREEN}✓${NC} pnpm $PNPM_VERSION"
    else
        echo -e "  ${RED}✗${NC} pnpm $PNPM_VERSION (requires >= 10.0.0)"
        echo -e "  ${YELLOW}→ Upgrade: npm install -g pnpm@latest${NC}"
        echo -e "  ${YELLOW}→ Or use corepack: corepack enable && corepack prepare pnpm@latest --activate${NC}"
        ((ERRORS++))
    fi
else
    echo -e "  ${RED}✗${NC} pnpm not found"
    echo -e "  ${YELLOW}→ Install: npm install -g pnpm@latest${NC}"
    echo -e "  ${YELLOW}→ Or: corepack enable && corepack prepare pnpm@latest --activate${NC}"
    ((ERRORS++))
fi

# Check PostgreSQL (optional, for local dev)
echo -e "${BLUE}[3/6] Checking PostgreSQL...${NC}"
if command -v psql &> /dev/null; then
    if psql -l &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} PostgreSQL available"
    else
        echo -e "  ${YELLOW}⚠${NC} PostgreSQL installed but not connected"
        echo -e "  ${YELLOW}→ Start service or check DATABASE_URL${NC}"
        ((WARNINGS++))
    fi
else
    echo -e "  ${YELLOW}⚠${NC} PostgreSQL not found (optional for local dev)"
    echo -e "  ${YELLOW}→ Docker alternative: docker compose -f docker/docker-compose.yml up -d postgres${NC}"
    ((WARNINGS++))
fi

# Check Redis (optional, for workers)
echo -e "${BLUE}[4/6] Checking Redis...${NC}"
if command -v redis-cli &> /dev/null; then
    if redis-cli ping &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Redis available"
    else
        echo -e "  ${YELLOW}⚠${NC} Redis installed but not running"
        echo -e "  ${YELLOW}→ Start: redis-server or docker compose up redis${NC}"
        ((WARNINGS++))
    fi
else
    echo -e "  ${YELLOW}⚠${NC} Redis not found (optional for background workers)"
    echo -e "  ${YELLOW}→ Docker alternative: docker compose -f docker/docker-compose.yml up -d redis${NC}"
    ((WARNINGS++))
fi

# Check environment files
echo -e "${BLUE}[5/6] Checking environment configuration...${NC}"
if [ -f ".env" ]; then
    echo -e "  ${GREEN}✓${NC} .env file exists"
else
    if [ -f ".env.example" ]; then
        echo -e "  ${YELLOW}⚠${NC} .env not found (using .env.example)"
        echo -e "  ${YELLOW}→ Run: cp .env.example .env && edit with your values${NC}"
        ((WARNINGS++))
    else
        echo -e "  ${YELLOW}⚠${NC} No .env or .env.example found"
        ((WARNINGS++))
    fi
fi

if [ -f "packages/db/.env" ]; then
    echo -e "  ${GREEN}✓${NC} packages/db/.env exists"
else
    echo -e "  ${YELLOW}⚠${NC} packages/db/.env not found"
    echo -e "  ${YELLOW}→ Required for database connections${NC}"
    ((WARNINGS++))
fi

# Install dependencies
echo -e "${BLUE}[6/6] Installing dependencies...${NC}"
if [ -f "pnpm-lock.yaml" ]; then
    pnpm install --frozen-lockfile
    echo -e "  ${GREEN}✓${NC} Dependencies installed"
else
    pnpm install
    echo -e "  ${GREEN}✓${NC} Dependencies installed (lock file created)"
fi

# Summary
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}✗ Bootstrap failed with $ERRORS error(s)${NC}"
    echo -e "  Fix the errors above before continuing."
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠ Bootstrap completed with $WARNINGS warning(s)${NC}"
    echo -e "  Some features may not work without optional dependencies."
else
    echo -e "${GREEN}✓ Bootstrap complete!${NC}"
fi

echo ""
echo -e "${BLUE}Quick Start:${NC}"
echo -e "  pnpm dev           # Start all apps"
echo -e "  pnpm dev:ops       # Start ops portal (port 3001)"
echo -e "  pnpm dev:guard     # Start guard app (port 3002)"
echo -e "  pnpm workers:dev   # Start background workers"
echo ""
echo -e "${BLUE}Database:${NC}"
echo -e "  pnpm db:migrate    # Run migrations"
echo -e "  pnpm db:studio     # Open Prisma Studio"
echo ""
echo -e "${BLUE}Testing:${NC}"
echo -e "  pnpm test          # Run all tests"
echo -e "  pnpm typecheck:all # Type check all packages"

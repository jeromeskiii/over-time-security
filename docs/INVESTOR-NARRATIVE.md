# Over Time Security — Investor Narrative

## The Strategy

**Phase 1: Security Lead Engine + Ops Stack** (now)
**Phase 2: AI Security Orchestration Platform** (evolution)

Start with customer acquisition. Upsell intelligence.

---

## The Problem

Security guard operations are a $50B+ U.S. market running on pen and paper. But the bigger problem? **Security firms can't find customers reliably.**

- Lead generation is word-of-mouth or expensive referrals
- Quote requests take days to process
- No systematic way to capture, qualify, and close leads

Meanwhile, once they win contracts, they struggle to deliver:
- Guards no-show, supervisors don't know
- Clients get reports days late, if at all
- Compliance is manual and unverifiable

---

## The Solution

### Phase 1: Security Lead Engine + Ops Stack

**Customer acquisition meets operational execution.**

| Component | What It Does |
|-----------|--------------|
| **Lead Engine** | SEO-optimized landing pages, instant quote requests, AI-powered estimates |
| **Ops Stack** | Guard scheduling, incident tracking, basic compliance, client portal |

This is the **balanced startup path**:
- Dominate customer acquisition first
- Build operational software to deliver on promises
- Create recurring revenue from day one

### Phase 2: AI Security Orchestration Platform

**Palantir for physical security.**

Once we have the data flowing (leads → contracts → operations), we layer on AI:

| Layer | Capability |
|-------|------------|
| **Automated Dispatch** | AI decides which guard, which shift, which response |
| **Compliance Intelligence** | Real-time scoring, predictive alerts, audit trails |
| **Risk Prediction** | Pattern recognition across sites, guards, incidents |
| **Workforce Intelligence** | Guard performance, reliability scoring, optimal scheduling |

---

## The Moat

**Data flywheel.**

```
Leads → Contracts → Operations → Data → AI → Better Leads
```

1. Lead engine captures intent
2. Ops stack captures execution
3. AI layer extracts patterns
4. Better predictions win more business
5. More data, better AI

Competitors have point solutions. We have the full stack.

---

## Product Axis

**Phase 1: Lead Generation + Lightweight Ops**

| App | Purpose |
|-----|---------|
| `apps/web` | Marketing site, SEO pages, quote forms, lead capture |
| `apps/ops` | Scheduling, incident logs, basic reports, client portal |
| `apps/guard` | Check-in, patrol logging, incident reporting |

**Phase 2: AI Orchestration**

| Package | Capability |
|---------|------------|
| `@ots/automation` | Event-driven workflows, alert chains, compliance scoring |
| `@ots/orchestrator` | AI dispatch decisions, risk prediction, workforce intelligence |

---

## Go-to-Market

**Service-first, software-second.**

1. **Phase 1 (Year 1)** — Run a security company. Use our own software. Prove the model.
2. **Phase 2 (Year 2)** — Sell leads + ops software to other security firms. SaaS revenue.
3. **Phase 3 (Year 3+)** — Sell AI orchestration to enterprise clients, insurance carriers, property managers.

---

## Traction

- ✅ Lead capture live — quote forms, auto-response, AI estimates
- ✅ Ops portal live — dashboard, guard management, shift scheduling
- ✅ Guard PWA live — check-in, patrol scans, incident reporting
- ✅ Automation layer — event-driven workflows, compliance scoring, alerts

**Phase 1 infrastructure complete. Ready for customers.**

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.8 |
| Database | PostgreSQL + Prisma |
| Styling | Tailwind CSS v4 |
| Monorepo | pnpm + Turborepo |
| AI | Google Gemini |
| Queue | BullMQ + Redis |
| Notifications | Resend (email) + Twilio (SMS) |

---

## Architecture

```
                    @ots/domain (no UI deps)
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      @ots/ui          @ots/db       @ots/automation
          │                │                │
          └───────────────┼────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      apps/web        apps/ops        apps/guard
    (lead gen)      (ops portal)    (field ops)
```

---

## The Ask

We're raising $[X] to:

1. **Scale lead generation** — SEO, content, paid acquisition for security contracts
2. **Hire 1 engineer** — accelerate ops features (client portal, billing, PDF reports)
3. **Validate the flywheel** — prove leads → contracts → data → AI loop works

---

## Why Now

- **Fragmented market** — 10,000+ small security firms, no dominant software player
- **Service-first advantage** — We run operations, we understand the pain
- **AI maturity** — LLMs can finally automate quotes, reports, compliance

**Lead with acquisition. Win with operations. Scale with AI.**

---

## One-Liner

> Over Time Security is building the AI-powered operating system for physical security — starting with lead generation, evolving into intelligent orchestration.

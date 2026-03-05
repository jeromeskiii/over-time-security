# Overtime Security

California-based private security firm providing professional protection services for commercial, construction, event, residential, and institutional clients across the state.

## Overview

Overtime Security is a marketing and lead-generation website built with React, TypeScript, and Vite. It showcases the firm's service capabilities, builds trust through social proof, and drives quote requests via a contact form.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Routing | React Router DOM v7 |
| Animation | Motion (Framer Motion) |
| Icons | Lucide React |
| AI Integration | Google Generative AI |
| Backend | Next.js API Routes + Prisma + PostgreSQL |

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.tsx         # Page shell with Navbar + Footer
│   │   └── MobileCTA.tsx      # Sticky mobile call-to-action bar
│   ├── FeatureSection.tsx     # Why choose us / differentiators
│   ├── Footer.tsx             # Site-wide footer
│   ├── Hero.tsx               # Landing hero with animated nodes
│   ├── IndustryGrid.tsx       # Industries served grid
│   ├── Navbar.tsx             # Responsive top navigation
│   ├── QuoteForm.tsx          # Lead capture form
│   ├── ScrollToTop.tsx        # Scroll restoration on route change
│   ├── ServicesGrid.tsx       # Services overview grid
│   ├── Testimonials.tsx       # Client testimonials carousel
│   └── TrustBar.tsx           # Trust signals / credential bar
├── lib/
│   ├── leadsApi.ts            # Lead capture API client helper
│   └── utils.ts               # clsx + tailwind-merge helper
├── pages/
│   ├── About.tsx              # Company background and team
│   ├── Contact.tsx            # Contact page with quote form
│   ├── Home.tsx               # Homepage composition
│   ├── ServiceDetail.tsx      # Dynamic service detail pages
│   └── Services.tsx           # All services overview
├── App.tsx                    # Router configuration
├── main.tsx                   # React entry point
└── index.css                  # Global styles + Tailwind directives

backend/
├── prisma/schema.prisma       # Lead model + statuses
└── src/app/
    ├── api/leads              # Lead create/list/update API routes
    └── dashboard              # Sales dashboard UI
```

## Services Covered

- **Armed & Unarmed Security** — Critical asset and facility protection
- **Mobile Patrols** — GPS-tracked randomized vehicular patrols
- **Fire Watch** — NFPA-compliant monitoring for impaired fire systems
- **Event Security** — Crowd management for large-scale events
- **Executive Protection** — Close protection for high-value individuals
- **Construction Security** — Job site vandalism deterrence and material protection

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and populate required values:

```bash
cp .env.example .env
```

### Frontend Development

```bash
npm run dev
# Starts Vite dev server at http://localhost:3000
```

### Backend Development (Lead Pipeline)

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma generate
npm run dev
# Starts backend at http://localhost:3001
```

Sales dashboard: `http://localhost:3001/dashboard`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Type Check

```bash
npm run lint
```

## License

Private — All rights reserved. Overtime Security.

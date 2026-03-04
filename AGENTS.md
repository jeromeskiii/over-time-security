# AGENTS.md — Over Time Security

Guide for AI agents working in this React + Vite marketing website for a California private security firm.

---

## Project Overview

**Over Time Security** — Marketing and lead-generation website for a California-based private security company. Dark tactical aesthetic with orange safety accents. Focus on trust-building and quote conversion.

- **Stack**: React 19 + TypeScript + Vite 6 + Tailwind CSS v4
- **Routing**: React Router DOM v7 (BrowserRouter)
- **Animation**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **Styling**: Tailwind CSS v4 with custom theme tokens
- **Build Output**: `dist/` (Vite default)

---

## Essential Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at http://localhost:3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Type check only (`tsc --noEmit`) |
| `npm run clean` | Remove `dist/` folder |

**No test runner** is configured. `npm run lint` only runs TypeScript type checking.

---

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.tsx          # Page wrapper with Navbar/Footer
│   │   ├── MobileCTA.tsx       # Sticky mobile call-to-action bar
│   │   └── Backdrop.tsx        # Background grid effects
│   ├── FeatureSection.tsx      # "Why choose us" section
│   ├── Footer.tsx              # Site footer
│   ├── Hero.tsx                # Homepage hero with animated nodes
│   ├── IndustryGrid.tsx        # Industries served grid
│   ├── Navbar.tsx              # Top navigation
│   ├── QuoteForm.tsx           # Lead capture form
│   ├── ScrollToTop.tsx         # Route change scroll reset
│   ├── ServicesGrid.tsx        # Services overview cards
│   ├── Testimonials.tsx        # Client testimonials carousel
│   └── TrustBar.tsx            # Trust signals bar
├── lib/
│   └── utils.ts                # `cn()` utility for Tailwind classes
├── pages/
│   ├── Home.tsx                # Homepage composition
│   ├── About.tsx               # Company story
│   ├── Contact.tsx             # Contact page + form
│   ├── Services.tsx            # Services list page
│   └── ServiceDetail.tsx       # Dynamic service detail pages
├── App.tsx                     # Router configuration
├── main.tsx                    # React entry point
└── index.css                   # Global styles + Tailwind v4 theme
```

---

## Design System

### Color Tokens (Tailwind CSS v4 Theme)

| Token | Value | Usage |
|-------|-------|-------|
| `bg-base` | `#05070a` | Page background |
| `bg-surface` | `#0b0f14` | Cards, elevated surfaces |
| `text-text-primary` | `#e6e6e6` | Primary text |
| `text-text-secondary` | `#9ca3af` | Secondary/muted text |
| `text-brand-accent` | `#ff6200` | Orange accent (CTAs, highlights) |
| `bg-brand-accent-hover` | `#e65800` | Orange hover state |
| `text-secondary-accent` | `#2563eb` | Blue accent (rarely used) |

### Typography

- **Font**: Inter (loaded from Google Fonts in `index.css`)
- **Weights**: 300, 400, 500, 600, 700, 800, 900 available
- **Style**: Heavy uppercase headings with tight tracking

**Heading Pattern**:
```tsx
<h1 className="text-[48px] md:text-[72px] font-black text-text-primary leading-[0.95] tracking-tighter uppercase">
```

**Label Pattern**:
```tsx
<span className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px]">
```

**Body Pattern**:
```tsx
<p className="text-[16px] text-text-secondary uppercase tracking-widest leading-relaxed">
```

### Common Component Patterns

**Primary CTA Button**:
```tsx
<Link
  to="/contact"
  className="inline-flex items-center justify-center gap-3 bg-brand-accent hover:bg-brand-accent-hover text-white px-8 py-5 rounded-sm font-black text-xs tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(255,98,0,0.2)] hover:shadow-[0_0_30px_rgba(255,98,0,0.4)] uppercase"
>
  Get Security Coverage
  <ArrowRight size={18} />
</Link>
```

**Service Card**:
```tsx
<Link
  to="/services/armed-unarmed"
  className="group block h-full relative bg-surface border border-white/5 p-10 hover:border-brand-accent/40 transition-all duration-500 overflow-hidden rounded-sm"
>
  {/* Content */}
</Link>
```

**Section Container**:
```tsx
<section className="py-32 bg-base">
  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</section>
```

---

## Routing

React Router v7 with nested routes defined in `App.tsx`:

```tsx
<Route path="/" element={<Layout />}>
  <Route index element={<Home />} />
  <Route path="about" element={<About />} />
  <Route path="contact" element={<Contact />} />
  <Route path="services" element={<Services />} />
  <Route path="services/:id" element={<ServiceDetail />} />
  <Route path="*" element={<Home />} />
</Route>
```

### Service Detail Routes

| ID | Path | Title |
|----|------|-------|
| `armed-unarmed` | `/services/armed-unarmed` | Armed & Unarmed Guards |
| `mobile-patrols` | `/services/mobile-patrols` | Mobile Patrol Services |
| `fire-watch` | `/services/fire-watch` | Fire Watch Services |
| `event-security` | `/services/event-security` | Event Security |
| `executive-protection` | `/services/executive-protection` | Executive Protection |
| `site-specific` | `/services/site-specific` | Site-Specific Security Plans |

**Service data is hardcoded** in `ServiceDetail.tsx` as a `servicesData` object — no external API or CMS.

---

## Code Patterns

### Animation with Motion

```tsx
import { motion } from 'motion/react';

// Fade up on scroll (most common)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
>

// Staggered children
<motion.div transition={{ duration: 0.4, delay: index * 0.1 }}>

// Hover effect
<motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
```

### Class Name Utilities

```tsx
import { cn } from '@/lib/utils';

className={cn(
  "base-classes",
  isActive && "active-classes",
  openFaq === index ? "border-brand-accent/50" : "border-white/5 hover:border-white/10"
)}
```

### Icons

```tsx
import { Shield, ArrowRight, Map, Flame, Calendar, Users, Briefcase } from 'lucide-react';

<Shield size={24} className="text-brand-accent" strokeWidth={1.5} />
```

### Path Aliases

| Alias | Target |
|-------|--------|
| `@/*` | `./src/*` |

```tsx
import { Hero } from '@/components/Hero';
import { cn } from '@/lib/utils';
```

---

## Environment Configuration

### Files

- `.env.example` — Template with required variables
- `.env` — Local environment (gitignored)

### Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `GEMINI_API_KEY` | Google AI API for optional AI features | No |

Environment variables are exposed to the client via `vite.config.ts` `define` config.

---

## Tailwind CSS v4 Configuration

Tailwind v4 uses **CSS-based configuration** in `index.css`, not `tailwind.config.js`:

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --color-base: #05070a;
  --color-surface: #0b0f14;
  /* ... more tokens */
}

@layer components {
  .surface-card {
    @apply bg-surface border border-white/[0.05] rounded-lg p-6;
  }
}
```

**Do not use `@tailwind` directives** — use `@import "tailwindcss"` instead.

---

## Vite Configuration

Key settings in `vite.config.ts`:

- **HMR**: Disabled when `DISABLE_HMR=true` (AI Studio environment)
- **Port**: 3000
- **Host**: 0.0.0.0
- **Path alias**: `@/` → `./src/`

**Do not modify HMR config** — file watching is disabled to prevent flickering during agent edits.

---

## Key Gotchas

1. **No ESLint**: Only TypeScript checking via `tsc --noEmit` in `npm run lint`

2. **No Test Framework**: No Jest, Vitest, or other test runner configured

3. **Inline Service Data**: Service pages (`ServiceDetail.tsx`) use hardcoded data object, not an API

4. **MobileCTA Component**: Shows only on mobile (`md:hidden`) — persistent sticky CTA

5. **ScrollToTop**: Automatically resets scroll on route changes

6. **Grid Background**: Applied globally to `body` via CSS — 80px grid pattern

7. **Unsplash Images**: Service pages use external Unsplash URLs with `referrerPolicy="no-referrer"`

8. **Phone Number**: Hardcoded as `1-800-555-0199` throughout — placeholder/fictional

---

## Reference Documentation

| File | Purpose |
|------|---------|
| `.aiassistant/rules/Overtime Security PRD.md` | Full product requirements document |
| `metadata.json` | Project metadata for AI tools |
| `README.md` | Human-readable project overview |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template (optional)
cp .env.example .env

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000
```

---

## When Adding New Components

1. **Use functional components** with named exports
2. **Place in appropriate folder**:
   - `components/` — Reusable UI components
   - `components/layout/` — Layout-specific components
   - `pages/` — Route-level page components
3. **Import via alias**: `import { X } from '@/components/X'`
4. **Use Motion** for entrance animations with `viewport={{ once: true }}`
5. **Follow typography patterns**: Uppercase, tracking-heavy text
6. **Use color tokens**: `bg-surface`, `text-brand-accent`, etc.
7. **Section spacing**: Use `py-32` for major section padding
8. **Container width**: Use `max-w-[1200px]` for content containers

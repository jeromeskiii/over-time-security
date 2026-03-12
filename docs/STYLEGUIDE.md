# Style Guide

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `base` | #05070a | Page background |
| `surface` | #0b0f14 | Cards, elevated surfaces |
| `text-primary` | #e6e6e6 | Primary text |
| `text-secondary` | #9ca3af | Muted text |
| `brand-accent` | #ff6200 | CTAs, highlights |
| `brand-accent-hover` | #e65800 | Hover states |
| `warning` | #f59e0b | Warning state |
| `critical` | #ef4444 | Critical/error state |
| `success` | #10b981 | Success state |
| `secondary-accent` | #2563eb | Secondary highlights |

### Color System Behavior (Structural, Not Decorative)

Colors define system behavior, not decoration:

- **Neutrals define structure** — Base, surface, text tokens create hierarchy and spatial relationships
- **Accent defines action** — Brand-accent reserved for CTAs and interactive elements only
- **Semantic colors define state** — Warning, critical, success indicate system status
- **Strong visuals reserved for hero + system signals** — No decorative gradients or visual noise fields

Rules:
- No constant gradients
- No visual noise fields
- No decorative color application

---

## Typography System

Typography acts as a navigation device, reducing reliance on decorative UI.

### Font
- **Family**: Inter
- **Weights**: 300, 400, 500, 600, 700, 800, 900
- **Mono**: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas

### Typography Roles

| Role | Purpose | Pattern |
|------|---------|---------|
| **Display** | Command authority | Page titles, hero headlines |
| **Heading** | Operational grouping | Section titles, card headers |
| **Body** | Explanation | Paragraphs, descriptions |
| **Label** | Module identity | Tags, badges, identifiers |
| **Meta** | Telemetry / timestamps | Time stamps, system info, codes |

### Implementation

```tsx
// Display — Command authority
<h1 className="text-[48px] md:text-[72px] font-black leading-[0.95] tracking-tighter uppercase">

// Heading — Operational grouping
<h2 className="text-[36px] md:text-[52px] font-black leading-[0.95] tracking-[-0.05em] uppercase">
<h3 className="text-[22px] md:text-[28px] font-black uppercase tracking-[0.08em]">

// Body — Explanation
<p className="text-sm leading-7 text-text-secondary">
<p className="text-[16px] text-text-secondary uppercase tracking-widest leading-relaxed">

// Label — Module identity
<span className="text-[10px] font-bold uppercase tracking-[0.34em] text-brand-accent">
<span className="text-[10px] font-black uppercase tracking-[0.32em] text-text-secondary">

// Meta — Telemetry / timestamps
<span className="font-mono text-[8px] uppercase tracking-[0.2em] text-text-secondary/60">
<span className="font-mono text-[9px] text-brand-accent">
<time className="font-mono text-[10px] text-text-secondary/40">
```

---

## Spacing & Density System

### Token Ladder

```
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64
```

| Token | Tailwind | Usage |
|-------|----------|-------|
| 4 | `gap-1`, `p-1` | Micro spacing |
| 8 | `gap-2`, `p-2` | Tight grouping |
| 12 | `gap-3`, `p-3` | Label proximity |
| 16 | `gap-4`, `p-4` | Element separation |
| 24 | `gap-6`, `p-6` | Panel internal padding |
| 32 | `gap-8`, `p-8`, `py-32` | Section rhythm |
| 48 | `gap-12`, `px-12` | Section gutters |
| 64 | `py-16` | Major section breaks |

### Hero Rhythm

```
Meta → Display: 16px (mb-4)
Display → Body: 24px (mt-6)
Body → CTA: 32px (mt-8)
```

### Panel Internal Padding

- Standard panels: `p-8` (32px)
- Compact panels: `p-6` (24px)
- Micro cards: `p-5` (20px)

### Section Gutters

- Section padding: `py-32` (128px total)
- Container max-width: `max-w-[1200px]` or `max-w-[1400px]`
- Horizontal padding: `px-4 sm:px-6 lg:px-8`

### Density Rule

- **Left side** = Low density (more whitespace, fewer elements)
- **Right side** = Medium density (cards, modules)
- **Never high density above the fold**

---

## Components

### Buttons

```tsx
// Primary CTA — Action
<button className="bg-brand-accent hover:bg-brand-accent-hover text-white px-8 py-5 font-black text-xs tracking-[0.2em] uppercase">

// Secondary
<button className="border border-white/20 hover:border-white/40 text-text-primary px-8 py-5 font-bold text-xs tracking-[0.2em] uppercase">

// Danger (semantic state)
<button className="bg-critical hover:bg-red-700 text-white px-6 py-3 font-bold text-sm uppercase">
```

### Cards (Signal Panels)

```tsx
// Standard card
<div className="signal-panel rounded-[28px] p-8">

// Compact card
<div className="signal-panel rounded-2xl px-5 py-5">

// Panel with internal sections
<div className="signal-panel rounded-[32px] p-8">
```

### Sections

```tsx
<section className="section-anchor py-32">
  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</section>
```

---

## Operational Panel System

Panels are composed of four distinct component types:

### A. Status Strip (Card Row)

**Purpose**: Immediate trust signal. Reduces uncertainty instantly.

```tsx
// Example: ACTIVE | CALIFORNIA | < 60 MIN | SUPERVISED
<div className="flex flex-wrap items-center justify-between gap-4">
  <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
    {metrics.map((m) => (
      <div key={m.label} className="flex flex-col gap-0.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary">
          {m.label}
        </span>
        <span className="font-mono text-[13px] font-bold tracking-wider text-text-primary">
          {m.value}
        </span>
      </div>
    ))}
  </div>
  <StatusBadge status="Active" variant="active" />
</div>
```

### B. Network Visualization (Primary Panel Card)

**Purpose**: Imply backend coordination.

**Must show**:
- Nodes (location markers)
- Connections (lines between nodes)
- Signal pulse (activity indication)
- Density hint (coverage spread)

**Not** literal map marketing.

```tsx
// Network nodes with connections
<svg className="absolute inset-0 h-full w-full">
  {nodes.map((node, i) => (
    <motion.line
      key={`${node.id}-${target.id}`}
      stroke="currentColor"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.15 }}
    />
  ))}
</svg>
{nodes.map((node) => (
  <div className="h-2.5 w-2.5 rounded-none rotate-45 bg-brand-accent" />
))}
```

### C. Capability Modules (Micro Cards)

**Purpose**: Translate operations into system capabilities.

**Examples**: PATROL ROUTES | DISPATCH NETWORK | INCIDENT SIGNALS | SHIFT VERIFICATION

```tsx
<div className="grid grid-cols-3 divide-x divide-white/5">
  <div className="flex flex-col gap-1 p-5">
    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-text-secondary">
      Latency
    </span>
    <span className="font-mono text-lg font-black leading-none text-brand-accent">
      42ms
    </span>
  </div>
  {/* ... more modules */}
</div>
```

Cards must feel **functional, not promotional**.

### D. Contextual Log (Structured List)

**Purpose**: Temporal realism. Gives system continuity illusion.

```tsx
// Example:
// 03:42 Patrol Verification Complete
// 03:28 Supervisor Check-In
// 03:10 Dispatch Sync
<div className="space-y-2">
  {logs.map((log) => (
    <div className="flex items-center gap-3">
      <time className="font-mono text-[10px] text-text-secondary/60">
        {log.time}
      </time>
      <span className="text-sm text-text-secondary">
        {log.message}
      </span>
    </div>
  ))}
</div>
```

---

## Motion System

Motion answers:
- What is active
- What changed
- What confirmed

### Motion Tokens

```ts
const motionTokens = {
  duration: {
    instant: 0.1,
    fast: 0.16,
    base: 0.22,
    medium: 0.32,
    slow: 0.48,
    section: 0.4,
    ambientSlow: 8,
    pulse: 2.2,
    ring: 3,
  },
  easing: {
    standard: [0.22, 1, 0.36, 1],
    exit: [0.4, 0, 1, 1],
    soft: [0.25, 0.1, 0.25, 1],
  },
  distance: { xs: 4, sm: 8, md: 16, lg: 24 },
  scale: { hover: 1.02, press: 0.98, statusPulse: 1.05 },
};
```

### Allowed Motion Types

| Type | Usage | Implementation |
|------|-------|----------------|
| **Node pulse** | Active status indication | `statusPulse`, `ringPulse` |
| **Signal sweep** | Panel activity | `.signal-panel::before` animation |
| **Hover lift** | Interactive feedback | `hoverLift`, `buttonMotion` |
| **Log fade** | Temporal entry appearance | `revealUp` with reduced motion support |
| **Badge pulse** | Status indicator | `statusPulse` |

### Forbidden Motion Types

- ❌ Hero spectacle
- ❌ Bouncing cards
- ❌ Neon gimmicks
- ❌ Dramatic parallax

### Standard Patterns

```tsx
// Reveal on scroll
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={revealUp(reducedMotion, 24)}
  transition={{ duration: 0.4, ease: signatureEase }}
>

// Staggered children
<motion.div variants={staggerParent}>
  {items.map((item) => (
    <motion.div variants={revealUp(reducedMotion, 20)} />
  ))}
</motion.div>

// Status pulse (allowed)
<motion.div animate={statusPulse.animate} />

// Hover lift (allowed)
<motion.div initial="rest" whileHover="hover" whileTap="tap" variants={hoverLift} />
```

### Reduced Motion Support

All motion must respect `prefers-reduced-motion`:

```tsx
const reducedMotion = useReducedMotion();

// In variant functions:
export function revealUp(reduced: boolean | null, distance = 24): Variants {
  return reduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: distance }, visible: { opacity: 1, y: 0 } };
}
```

Motion cadence must be tokenized — never use arbitrary values.

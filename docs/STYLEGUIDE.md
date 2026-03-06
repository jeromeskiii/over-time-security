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

---

## Typography

### Font
- **Family**: Inter
- **Weights**: 300, 400, 500, 600, 700, 800, 900

### Headings

```tsx
// Page title
<h1 className="text-[48px] md:text-[72px] font-black leading-[0.95] tracking-tighter uppercase">

// Section title
<h2 className="text-[36px] md:text-[48px] font-black leading-[0.95] tracking-tighter uppercase">

// Card title
<h3 className="text-lg font-bold uppercase tracking-wider">
```

### Labels

```tsx
<span className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px]">
```

### Body

```tsx
<p className="text-[16px] text-text-secondary uppercase tracking-widest leading-relaxed">
```

---

## Components

### Buttons

```tsx
// Primary CTA
<button className="bg-brand-accent hover:bg-brand-accent-hover text-white px-8 py-5 font-black text-xs tracking-[0.2em] uppercase">

// Secondary
<button className="border border-white/20 hover:border-white/40 text-text-primary px-8 py-5 font-bold text-xs tracking-[0.2em] uppercase">

// Danger
<button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-bold text-sm uppercase">
```

### Cards

```tsx
<div className="bg-surface border border-white/5 p-8 hover:border-brand-accent/40 transition-all duration-500">
```

### Sections

```tsx
<section className="py-32 bg-base">
  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</section>
```

---

## Spacing

- Section padding: `py-32`
- Container max-width: `max-w-[1200px]`
- Card padding: `p-8` or `p-6`
- Element gaps: `gap-4`, `gap-6`, `gap-8`

---

## Animation

Using Motion (Framer Motion):

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
>
```

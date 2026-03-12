export const colors = {
  base: "#05070a",
  surface: "#0b0f14",
  surfaceHover: "#111827",
  textPrimary: "#e6e6e6",
  textSecondary: "#9ca3af",
  brandAccent: "#ff6200",
  brandAccentHover: "#e65800",
  secondaryAccent: "#2563eb",
  border: "rgba(255, 255, 255, 0.05)",
  borderHover: "rgba(255, 255, 255, 0.10)",
} as const;

export const spacing = {
  "4": "0.25rem", // 4px
  "8": "0.5rem",  // 8px
  "12": "0.75rem", // 12px
  "16": "1rem",   // 16px
  "24": "1.5rem", // 24px
  "32": "2rem",   // 32px
  "48": "3rem",   // 48px
  "64": "4rem",   // 64px
  // Legacy mappings for backward compatibility
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
} as const;

export const typography = {
  fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
  headingTracking: "-0.05em",
  labelTracking: "0.3em",
} as const;

export const shadows = {
  accentGlow: "0 0 20px rgba(255, 98, 0, 0.2)",
  accentGlowHover: "0 0 30px rgba(255, 98, 0, 0.4)",
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

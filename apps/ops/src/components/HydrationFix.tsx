"use client";

import { useEffect, useState } from "react";

export function HydrationFix({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch from browser extensions
  if (!mounted) {
    return <div suppressHydrationWarning />;
  }

  return <>{children}</>;
}

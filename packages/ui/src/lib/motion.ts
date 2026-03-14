import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function motionSafe(className: string): string {
  if (typeof window === "undefined") return className;
  
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
  if (prefersReducedMotion) {
    return className
      .split(" ")
      .filter((cls) => !cls.startsWith("transition") && !cls.startsWith("duration") && !cls.startsWith("ease"))
      .join(" ");
  }
  
  return className;
}

export function motionClasses(normalClasses: string, reducedClasses: string = ""): string {
  if (typeof window === "undefined") return normalClasses;
  
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return prefersReducedMotion ? reducedClasses : normalClasses;
}

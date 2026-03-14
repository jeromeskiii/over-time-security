import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function motionClasses(normalClasses: string, reducedClasses: string = ""): string {
  if (typeof window === "undefined") return normalClasses;
  
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return prefersReducedMotion ? reducedClasses : normalClasses;
}

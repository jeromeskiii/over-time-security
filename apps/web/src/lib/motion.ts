"use client";

import { useReducedMotion } from "motion/react";

export function useMotionSafe() {
  const prefersReducedMotion = useReducedMotion();

  return {
    prefersReducedMotion,
    allowAmbient: !prefersReducedMotion,
    allowEntrance: true,
    allowHover: true,
    allowStatus: true,
  };
}

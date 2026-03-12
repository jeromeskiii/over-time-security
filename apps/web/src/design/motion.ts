import type { Transition, Variants } from "motion/react";

export const motionTokens = {
  duration: {
    instant: 0.1,
    fast: 0.16,
    base: 0.22,
    medium: 0.32,
    slow: 0.48,
    section: 0.4,
    ambientSlow: 8,
    ambientSlower: 12,
    pulse: 2.2,
    ring: 3,
  },
  easing: {
    standard: [0.22, 1, 0.36, 1] as const,
    exit: [0.4, 0, 1, 1] as const,
    linear: "linear" as const,
    soft: [0.25, 0.1, 0.25, 1] as const,
  },
  distance: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  scale: {
    hover: 1.02,
    press: 0.98,
    modalEnter: 0.98,
    statusPulse: 1.05,
  },
  opacity: {
    subtle: 0.65,
    muted: 0.45,
    low: 0.18,
  },
} as const;

export const signatureEase = motionTokens.easing.standard;

const standardTransition: Transition = {
  duration: motionTokens.duration.base,
  ease: motionTokens.easing.standard,
};

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: motionTokens.distance.lg,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.section,
      ease: motionTokens.easing.standard,
    },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: motionTokens.duration.section,
      ease: motionTokens.easing.standard,
    },
  },
};

export const staggerContainer = (stagger = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: 0.04,
    },
  },
});

export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

export function revealUp(reduced: boolean | null, distance = 28): Variants {
  return reduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: distance }, visible: { opacity: 1, y: 0 } };
}

export function revealSide(
  reduced: boolean | null,
  distance = 36,
  direction: 1 | -1 = 1,
): Variants {
  return reduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, x: distance * direction },
        visible: { opacity: 1, x: 0 },
      };
}

export const hoverLift = {
  rest: {
    y: 0,
    scale: 1,
    transition: standardTransition,
  },
  hover: {
    y: -4,
    scale: motionTokens.scale.hover,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.easing.standard,
    },
  },
  tap: {
    scale: motionTokens.scale.press,
    y: 0,
    transition: {
      duration: motionTokens.duration.instant,
      ease: motionTokens.easing.standard,
    },
  },
};

export const buttonMotion = {
  rest: {
    y: 0,
    scale: 1,
    transition: standardTransition,
  },
  hover: {
    y: -2,
    scale: motionTokens.scale.hover,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.easing.standard,
    },
  },
  tap: {
    scale: motionTokens.scale.press,
    transition: {
      duration: motionTokens.duration.instant,
      ease: motionTokens.easing.standard,
    },
  },
};

export const statusPulse = {
  animate: {
    opacity: [0.55, 1, 0.55],
    scale: [1, motionTokens.scale.statusPulse, 1],
    transition: {
      duration: motionTokens.duration.pulse,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

export const ringPulse = {
  animate: {
    scale: [0.8, 1.4],
    opacity: [0.45, 0],
    transition: {
      duration: motionTokens.duration.ring,
      repeat: Infinity,
      ease: "easeOut" as const,
    },
  },
};

export const signalSweep = {
  animate: {
    x: ["-100%", "100%"],
    transition: {
      duration: motionTokens.duration.ambientSlow,
      repeat: Infinity,
      ease: motionTokens.easing.linear,
    },
  },
};

export const ambientDrift = {
  animate: {
    scale: [1.02, 1],
    y: [0, -6, 0],
    transition: {
      duration: motionTokens.duration.ambientSlower,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

export const navUnderline: Variants = {
  rest: {
    scaleX: 0,
    opacity: 0,
    transformOrigin: "left center",
  },
  hover: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.easing.standard,
    },
  },
  active: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.easing.standard,
    },
  },
};

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: motionTokens.scale.modalEnter,
    y: 8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.base,
      ease: motionTokens.easing.standard,
    },
  },
  exit: {
    opacity: 0,
    scale: motionTokens.scale.modalEnter,
    y: 8,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.easing.exit,
    },
  },
};

export const drawerVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 24,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.26,
      ease: motionTokens.easing.standard,
    },
  },
  exit: {
    opacity: 0,
    x: 24,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.easing.exit,
    },
  },
};

export const accordionVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: motionTokens.duration.base,
      ease: motionTokens.easing.standard,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.easing.exit,
    },
  },
};

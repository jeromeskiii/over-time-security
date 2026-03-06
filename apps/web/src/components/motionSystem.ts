export const signatureEase = [0.16, 1, 0.3, 1] as const;

export function revealUp(reduced: boolean | null, distance = 28) {
  return reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0 },
      };
}

export function revealSide(reduced: boolean | null, distance = 36, direction: 1 | -1 = 1) {
  return reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, x: distance * direction },
        visible: { opacity: 1, x: 0 },
      };
}

export const staggerParent = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

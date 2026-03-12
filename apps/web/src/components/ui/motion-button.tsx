"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { buttonMotion } from "@/design/motion";
import { cn } from "@ots/ui";

type MotionButtonProps = HTMLMotionProps<"button"> & {
  className?: string;
};

export function MotionButton({
  children,
  className,
  ...props
}: MotionButtonProps) {
  return (
    <motion.button
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap="tap"
      variants={buttonMotion}
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium",
        "bg-brand-accent text-white shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-base",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

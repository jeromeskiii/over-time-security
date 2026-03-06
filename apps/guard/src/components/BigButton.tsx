"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface BigButtonProps {
  icon: LucideIcon;
  label: string;
  sublabel?: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "danger" | "success" | "neutral";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const variants = {
  primary: "bg-brand-accent text-white shadow-[0_0_20px_rgba(255,98,0,0.3)]",
  secondary:
    "bg-surface border-2 border-brand-accent/30 text-brand-accent hover:bg-brand-accent/10",
  danger: "bg-red-600/20 border-2 border-red-500/40 text-red-400 hover:bg-red-600/30",
  success:
    "bg-emerald-600/20 border-2 border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30",
  neutral: "bg-surface border-2 border-white/10 text-text-primary hover:bg-surface-hover",
};

export function BigButton({
  icon: Icon,
  label,
  sublabel,
  onClick,
  href,
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = true,
  className,
}: BigButtonProps) {
  const content = (
    <>
      {loading ? (
        <Loader2 className="w-10 h-10 animate-spin" />
      ) : (
        <Icon className="w-10 h-10" strokeWidth={1.5} />
      )}
      <div className="flex flex-col items-center gap-1">
        <span className="text-lg font-black uppercase tracking-wider">
          {label}
        </span>
        {sublabel && (
          <span className="text-xs opacity-70 uppercase tracking-widest">
            {sublabel}
          </span>
        )}
      </div>
    </>
  );

  const baseClasses = cn(
    "relative flex flex-col items-center justify-center gap-3",
    "min-h-[140px] rounded-xl",
    "transition-all duration-200",
    "active:scale-[0.98]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    fullWidth && "w-full",
    variants[variant],
    className
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={baseClasses}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.button>
  );
}

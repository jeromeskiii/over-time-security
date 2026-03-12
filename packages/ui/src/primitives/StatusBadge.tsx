import * as React from "react";
import { cn } from "../lib/utils";

export type StatusBadgeVariant =
  | "active"
  | "inactive"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "critical"
  | "neutral";

const variantStyles: Record<StatusBadgeVariant, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  inactive: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  scheduled: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  in_progress: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  critical: "bg-red-500/15 text-red-400 border-red-500/30",
  neutral: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: string;
  variant?: StatusBadgeVariant;
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, variant = "neutral", className, ...props }, ref) => {
    const style = variantStyles[variant] ?? variantStyles.neutral;
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[11px] font-semibold uppercase tracking-wider border",
          style,
          className
        )}
        {...props}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 shrink-0 animate-pulse" />
        {status}
      </span>
    );
  }
);
StatusBadge.displayName = "StatusBadge";

export { StatusBadge };

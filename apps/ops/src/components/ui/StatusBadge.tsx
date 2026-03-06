"use client";
import { cn } from "@/lib/utils";

type Status =
  | "active"
  | "inactive"
  | "suspended"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "new"
  | "contacted"
  | "quoted"
  | "won"
  | "lost"
  | "low"
  | "medium"
  | "high"
  | "critical";

const statusConfig: Record<Status, { label: string; className: string }> = {
  active:      { label: "Active",      className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  inactive:    { label: "Inactive",    className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30" },
  suspended:   { label: "Suspended",   className: "bg-red-500/15 text-red-400 border-red-500/30" },
  scheduled:   { label: "Scheduled",   className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  in_progress: { label: "In Progress", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  completed:   { label: "Completed",   className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  cancelled:   { label: "Cancelled",   className: "bg-red-500/15 text-red-400 border-red-500/30" },
  new:         { label: "New",         className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  contacted:   { label: "Contacted",   className: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  quoted:      { label: "Quoted",      className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  won:         { label: "Won",         className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  lost:        { label: "Lost",        className: "bg-red-500/15 text-red-400 border-red-500/30" },
  low:         { label: "Low",         className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  medium:      { label: "Medium",      className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  high:        { label: "High",        className: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  critical:    { label: "Critical",    className: "bg-red-500/15 text-red-400 border-red-500/30" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase() as Status;
  const config = statusConfig[normalized] ?? { label: status, className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30" };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[11px] font-semibold uppercase tracking-wider border",
        config.className,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {config.label}
    </span>
  );
}

"use client";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  timestamp: string;
  type?: "info" | "success" | "warning" | "danger";
}

const typeColor: Record<NonNullable<ActivityItem["type"]>, string> = {
  info:    "bg-blue-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger:  "bg-red-500",
};

interface ActivityFeedProps {
  items: ActivityItem[];
  className?: string;
}

export function ActivityFeed({ items, className }: ActivityFeedProps) {
  return (
    <ol className={cn("relative", className)}>
      {items.map((item, i) => (
        <li key={item.id} className="flex gap-4 pb-6 last:pb-0">
          {/* Timeline line + dot */}
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "w-2 h-2 rounded-full mt-1 shrink-0",
                typeColor[item.type ?? "info"]
              )}
            />
            {i < items.length - 1 && (
              <span className="w-px flex-1 bg-white/10 mt-1" />
            )}
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-text-primary leading-snug">{item.title}</p>
              <time className="text-[11px] text-text-secondary whitespace-nowrap shrink-0">
                {item.timestamp}
              </time>
            </div>
            {item.description && (
              <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

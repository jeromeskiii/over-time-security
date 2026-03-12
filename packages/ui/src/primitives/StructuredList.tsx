import * as React from "react";
import { cn } from "../lib/utils";

export interface StructuredListItem {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  meta?: string;
  type?: "info" | "success" | "warning" | "danger" | "neutral";
}

const typeDotStyles: Record<NonNullable<StructuredListItem["type"]>, string> = {
  info: "bg-blue-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  neutral: "bg-zinc-500",
};

export interface StructuredListProps extends React.HTMLAttributes<HTMLOListElement> {
  items: StructuredListItem[];
  /** Accessibility label for the log/list */
  ariaLabel?: string;
}

const StructuredList = React.forwardRef<HTMLOListElement, StructuredListProps>(
  ({ items, ariaLabel = "Activity log", className, ...props }, ref) => {
    return (
      <ol
        ref={ref}
        aria-label={ariaLabel}
        className={cn("relative list-none", className)}
        {...props}
      >
        {items.map((item, i) => {
          const dotStyle = typeDotStyles[item.type ?? "neutral"];
          return (
            <li key={item.id} className="flex gap-4 pb-4 last:pb-0">
              <div className="flex flex-col items-center shrink-0">
                <span className={cn("w-2 h-2 rounded-full mt-1 shrink-0", dotStyle)} />
                {i < items.length - 1 && (
                  <span className="w-px flex-1 min-h-2 bg-white/10 mt-1" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-text-primary leading-snug">
                    {item.title}
                  </p>
                  {item.timestamp && (
                    <time className="text-[11px] text-text-secondary whitespace-nowrap shrink-0">
                      {item.timestamp}
                    </time>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                )}
                {item.meta && (
                  <p className="text-[10px] text-text-secondary/70 mt-1 font-mono uppercase tracking-wider">
                    {item.meta}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    );
  }
);
StructuredList.displayName = "StructuredList";

export { StructuredList };

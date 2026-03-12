import * as React from "react";
import { cn } from "../lib/utils";

export interface DataVisualizationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional title/label for the visualization (e.g. "Live.Overview.Surface") */
  title?: string;
  /** Optional subtitle or ID (e.g. "ID: OTS-NET-CA-01") */
  subtitle?: string;
  /** Compact mode for mobile: reduced padding, simpler chrome */
  compact?: boolean;
}

const DataVisualization = React.forwardRef<HTMLDivElement, DataVisualizationProps>(
  ({ title, subtitle, compact = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden bg-base/50 border border-white/5",
          compact ? "p-4" : "p-6",
          className
        )}
        {...props}
      >
        {(title || subtitle) && (
          <div className="flex flex-col gap-0.5 mb-4">
            {title && (
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-text-primary">
                {title}
              </span>
            )}
            {subtitle && (
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-text-secondary/60">
                {subtitle}
              </span>
            )}
          </div>
        )}
        {children}
      </div>
    );
  }
);
DataVisualization.displayName = "DataVisualization";

export { DataVisualization };

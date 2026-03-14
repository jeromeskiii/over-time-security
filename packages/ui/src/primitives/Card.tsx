import * as React from "react";
import { cn, motionClasses } from "../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "bg-surface border border-white/5 rounded-sm p-6",
          hoverable && cn("hover:border-brand-accent/40 cursor-pointer", motionClasses("transition-all duration-500")),
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export { Card };

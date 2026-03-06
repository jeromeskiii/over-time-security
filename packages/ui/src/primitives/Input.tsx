import * as React from "react";
import { cn } from "../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-bold tracking-widest uppercase text-text-secondary mb-2">
            {label}
          </label>
        )}
        <input
          className={cn(
            "w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-primary",
            "placeholder:text-text-secondary/50",
            "focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/20",
            "transition-colors",
            error && "border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

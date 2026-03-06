import * as React from "react";
import { cn } from "../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-brand-accent hover:bg-brand-accent-hover text-white shadow-[0_0_20px_rgba(255,98,0,0.2)] hover:shadow-[0_0_30px_rgba(255,98,0,0.4)]":
              variant === "primary",
            "bg-surface border border-white/10 hover:border-white/20 text-text-primary":
              variant === "secondary",
            "bg-transparent hover:bg-white/5 text-text-primary": variant === "ghost",
            "bg-red-600 hover:bg-red-700 text-white": variant === "danger",
          },
          {
            "px-4 py-2 text-xs": size === "sm",
            "px-6 py-3 text-sm": size === "md",
            "px-8 py-4 text-base": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

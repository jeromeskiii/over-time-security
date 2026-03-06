import * as React from "react";
import { cn } from "../lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  label?: string;
  className?: string;
}

export function PageHeader({ title, description, label, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-12", className)}>
      {label && (
        <span className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">
          {label}
        </span>
      )}
      <h1 className="text-[48px] md:text-[72px] font-black text-text-primary leading-[0.95] tracking-tighter uppercase">
        {title}
      </h1>
      {description && (
        <p className="mt-6 text-[16px] text-text-secondary uppercase tracking-widest leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}

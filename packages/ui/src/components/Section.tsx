import * as React from "react";
import { cn } from "../lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-32 bg-base", className)}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

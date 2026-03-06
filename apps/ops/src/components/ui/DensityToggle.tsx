"use client";
import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

type Density = "comfortable" | "compact";

interface DensityContextValue {
  density: Density;
  setDensity: (d: Density) => void;
  rowPadding: string;
}

const DensityContext = createContext<DensityContextValue>({
  density: "comfortable",
  setDensity: () => {},
  rowPadding: "px-4 py-3",
});

export function DensityProvider({ children }: { children: React.ReactNode }) {
  const [density, setDensity] = useState<Density>("comfortable");
  const rowPadding = density === "comfortable" ? "px-4 py-3" : "px-4 py-1.5";
  return (
    <DensityContext.Provider value={{ density, setDensity, rowPadding }}>
      {children}
    </DensityContext.Provider>
  );
}

export function useDensity() {
  return useContext(DensityContext);
}

export function DensityToggle({ className }: { className?: string }) {
  const { density, setDensity } = useDensity();
  return (
    <div className={cn("flex items-center gap-1 bg-white/5 rounded-sm p-0.5", className)}>
      {(["comfortable", "compact"] as Density[]).map((d) => (
        <button
          key={d}
          onClick={() => setDensity(d)}
          className={cn(
            "px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-sm transition-colors",
            density === d
              ? "bg-brand-accent text-white"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          {d}
        </button>
      ))}
    </div>
  );
}

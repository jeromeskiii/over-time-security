"use client";

import { motion } from "framer-motion";
import { Check, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckpointProgressProps {
  total: number;
  completed: number;
  checkpointNames?: string[];
  currentIndex?: number;
  className?: string;
}

export function CheckpointProgress({
  total,
  completed,
  checkpointNames,
  currentIndex = completed,
  className,
}: CheckpointProgressProps) {
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-secondary uppercase tracking-wider font-semibold">
            Progress
          </span>
          <span className="text-brand-accent font-black text-lg">
            {completed}/{total}
          </span>
        </div>
        <div className="h-3 bg-surface rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-accent to-orange-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Checkpoint Dots */}
      <div className="flex items-center justify-between gap-1">
        {Array.from({ length: total }).map((_, index) => {
          const isCompleted = index < completed;
          const isCurrent = index === currentIndex;
          const name = checkpointNames?.[index];

          return (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              <motion.div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  isCompleted && "bg-emerald-500",
                  isCurrent && !isCompleted && "bg-brand-accent ring-4 ring-brand-accent/20",
                  !isCompleted && !isCurrent && "bg-surface border-2 border-white/10"
                )}
                animate={isCurrent && !isCompleted ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                ) : isCurrent ? (
                  <MapPin className="w-5 h-5 text-white" strokeWidth={2} />
                ) : (
                  <span className="text-text-secondary text-sm font-bold">
                    {index + 1}
                  </span>
                )}
              </motion.div>
              {name && (
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-wider text-center leading-tight truncate w-full",
                    isCompleted && "text-emerald-400",
                    isCurrent && "text-brand-accent font-semibold",
                    !isCompleted && !isCurrent && "text-text-secondary"
                  )}
                >
                  {name}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

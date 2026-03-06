"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Cloud, CloudOff } from "lucide-react";

interface SavedToastProps {
  show: boolean;
  mode?: "saved" | "offline" | "syncing";
  message?: string;
}

export function SavedToast({ show, mode = "saved", message }: SavedToastProps) {
  const icons = {
    saved: Check,
    offline: CloudOff,
    syncing: Cloud,
  };

  const labels = {
    saved: "SAVED",
    offline: "SAVED OFFLINE",
    syncing: "SYNCING...",
  };

  const colors = {
    saved: "bg-emerald-500",
    offline: "bg-amber-500",
    syncing: "bg-blue-500",
  };

  const Icon = icons[mode];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className={`
              flex items-center gap-3 px-6 py-3 rounded-full
              ${colors[mode]} text-white shadow-lg
              font-bold text-sm uppercase tracking-wider
            `}
          >
            <Icon className="w-5 h-5" />
            <span>{message || labels[mode]}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

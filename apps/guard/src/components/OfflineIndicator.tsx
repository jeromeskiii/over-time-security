"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CloudOff, Wifi } from "lucide-react";
import { useOnlineStatus, useOutbox } from "@/lib/hooks";

export function OfflineIndicator() {
  const online = useOnlineStatus();
  const { pendingCount } = useOutbox();

  return (
    <AnimatePresence>
      {!online || pendingCount > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`
            fixed top-0 left-0 right-0 z-50 px-4 py-2
            flex items-center justify-center gap-2
            ${online ? "bg-amber-600" : "bg-red-600"}
            text-white text-xs font-bold uppercase tracking-wider
          `}
        >
          {!online ? (
            <>
              <CloudOff className="w-4 h-4" />
              <span>Offline Mode</span>
              {pendingCount > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full">
                  {pendingCount} pending
                </span>
              )}
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4" />
              <span>Syncing {pendingCount} items...</span>
            </>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

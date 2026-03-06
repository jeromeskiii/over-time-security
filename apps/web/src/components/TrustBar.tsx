"use client";

import { motion, useReducedMotion } from "motion/react";
import { revealUp, signatureEase, staggerParent } from "@/components/motionSystem";

const trustItems = [
  { value: "24/7", label: "Dispatch Coverage" },
  { value: "BSIS", label: "Licensed Officers" },
  { value: "GPS", label: "Patrol Verification" },
  { value: "Live", label: "Incident Reporting" },
];

export function TrustBar() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="section-anchor border-y border-white/10 bg-surface/70 py-8" id="coverage">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={staggerParent}
          className="grid gap-3 md:grid-cols-4"
        >
          {trustItems.map((item) => (
            <motion.div
              key={item.label}
              variants={revealUp(reducedMotion, 18)}
              transition={{ duration: 0.4, ease: signatureEase }}
              className="signal-panel rounded-2xl px-5 py-4"
            >
              <p className="text-2xl font-black uppercase tracking-[-0.04em] text-text-primary">
                {item.value}
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.24em] text-text-secondary">
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

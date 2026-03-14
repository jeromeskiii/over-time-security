"use client";

import { motion, useReducedMotion } from "motion/react";
import { revealSide, revealUp, signatureEase, staggerParent } from "@/components/motionSystem";
import { DispatchIntakeForm } from "@/components/DispatchIntakeForm";

export function FinalCTA() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="section-anchor relative overflow-hidden py-32" id="dispatch">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,98,0,0.14),transparent_34%),radial-gradient(circle_at_72%_78%,rgba(37,99,235,0.1),transparent_28%)]" />
      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={revealSide(reducedMotion, 30, -1)}
            transition={{ duration: 0.55, ease: signatureEase }}
          >
            <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.34em] text-brand-accent">
              Dispatch Intake
            </span>
            <h2 className="max-w-xl text-[38px] font-black uppercase leading-[0.94] tracking-[-0.05em] text-text-primary md:text-[60px]">
              Need coverage tonight?
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-text-secondary">
              Submit your coverage request below and dispatch will contact you within 15 minutes
              to confirm details and deploy personnel.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={revealSide(reducedMotion, 30, 1)}
            transition={{ duration: 0.55, ease: signatureEase }}
            className="signal-panel rounded-[32px] p-8"
          >
            <DispatchIntakeForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

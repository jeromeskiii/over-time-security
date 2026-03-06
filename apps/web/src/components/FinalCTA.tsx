"use client";

import { motion, useReducedMotion } from "motion/react";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { revealSide, revealUp, signatureEase, staggerParent } from "@/components/motionSystem";

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
              Call dispatch for immediate deployment or send the site profile by email.
              This page is now a complete single-surface intake path instead of a handoff to
              missing routes.
            </p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={staggerParent}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <motion.a
                variants={revealUp(reducedMotion, 18)}
                transition={{ duration: 0.42, ease: signatureEase }}
                href="tel:5622431678"
                className="inline-flex items-center justify-center gap-3 rounded-sm bg-brand-accent px-8 py-5 text-xs font-black uppercase tracking-[0.24em] text-white transition-all hover:bg-brand-accent-hover"
              >
                <Phone size={17} />
                Call Dispatch
              </motion.a>
              <motion.a
                variants={revealUp(reducedMotion, 18)}
                transition={{ duration: 0.42, ease: signatureEase }}
                href="mailto:dispatch@overtimesecurity.com?subject=Coverage%20Request"
                className="inline-flex items-center justify-center gap-3 rounded-sm border border-white/15 bg-white/5 px-8 py-5 text-xs font-black uppercase tracking-[0.24em] text-text-primary transition-colors hover:border-white/30 hover:bg-white/10"
              >
                <Mail size={17} className="text-brand-accent" />
                Send Site Profile
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={revealSide(reducedMotion, 30, 1)}
            transition={{ duration: 0.55, ease: signatureEase }}
            className="signal-panel rounded-[32px] p-8"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Property type",
                "Coverage hours",
                "Armed or patrol need",
                "Site address and access notes",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-white/10 bg-base/70 p-5"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent">
                    Intake field
                  </p>
                  <p className="mt-3 text-sm font-black uppercase tracking-[0.14em] text-text-primary">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[28px] border border-white/10 bg-base/70 px-6 py-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent">
                Coverage Promise
              </p>
              <p className="mt-4 text-sm uppercase leading-7 tracking-[0.14em] text-text-secondary">
                Purpose-built interaction, working navigation, accessible focus states, and
                motion that feels like instrumentation rather than decoration.
              </p>
              <div className="mt-6 inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.24em] text-brand-accent">
                Production homepage upgraded
                <ArrowRight size={15} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

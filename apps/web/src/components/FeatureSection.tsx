"use client";

import { motion, useReducedMotion } from "motion/react";
import { Shield, Clock3, RadioTower, FileCheck2, ArrowRight } from "lucide-react";
import { revealSide, revealUp, signatureEase, staggerParent } from "@/components/motionSystem";

const protocolSteps = [
  "Threat profile and coverage map built before first shift.",
  "Post orders issued to officers and supervisors from the same operating brief.",
  "Client receives live incident updates, patrol logs, and escalation notes.",
  "Coverage cadence adjusts when the site pattern changes, not weeks later.",
];

const artifacts = [
  {
    icon: Shield,
    label: "Command Coverage",
    detail: "Supervisor-aware deployment instead of isolated field staffing.",
  },
  {
    icon: RadioTower,
    label: "Incident Signal",
    detail: "Escalations routed through dispatch with response context attached.",
  },
  {
    icon: FileCheck2,
    label: "Reporting Package",
    detail: "Site logs, patrol checks, and exceptions collected in one client view.",
  },
  {
    icon: Clock3,
    label: "Shift Rhythm",
    detail: "Coverage remains structured under overnight, event, and emergency load.",
  },
];

export function FeatureSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="section-anchor py-32" id="protocol">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={revealSide(reducedMotion, 34, -1)}
            transition={{ duration: 0.55, ease: signatureEase }}
          >
            <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.34em] text-brand-accent">
              Operating Protocol
            </span>
            <h2 className="max-w-xl text-[36px] font-black uppercase leading-[0.95] tracking-[-0.05em] text-text-primary md:text-[52px]">
              The difference is not guard count. It is control.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-text-secondary">
              Premium security feels different when the visual language matches the operations:
              less brochure, more system. The site now mirrors that idea with deliberate rhythm,
              anchored hierarchy, and motion that behaves like instrumentation.
            </p>

            <motion.ol
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={staggerParent}
              className="mt-10 space-y-4"
            >
              {protocolSteps.map((step, index) => (
                <motion.li
                  key={step}
                  variants={revealUp(reducedMotion, 20)}
                  transition={{ duration: 0.42, ease: signatureEase }}
                  className="signal-panel rounded-2xl px-5 py-5"
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-brand-accent/20 bg-brand-accent/10 text-[10px] font-black uppercase tracking-[0.22em] text-brand-accent">
                      0{index + 1}
                    </span>
                    <p className="text-sm uppercase leading-7 tracking-[0.12em] text-text-secondary">
                      {step}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={revealSide(reducedMotion, 34, 1)}
            transition={{ duration: 0.55, ease: signatureEase }}
            className="section-anchor"
            id="proof"
          >
            <div className="signal-panel rounded-[32px] p-8">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.34em] text-brand-accent">
                    Proof Stack
                  </span>
                  <h3 className="mt-3 text-[28px] font-black uppercase tracking-[0.08em] text-text-primary">
                    Every touchpoint earns its place.
                  </h3>
                </div>
                <ArrowRight size={22} className="hidden text-brand-accent sm:block" />
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerParent}
                className="mt-8 grid gap-4 md:grid-cols-2"
              >
                {artifacts.map(({ icon: Icon, label, detail }) => (
                  <motion.div
                    key={label}
                    variants={revealUp(reducedMotion, 18)}
                    transition={{ duration: 0.42, ease: signatureEase }}
                    className="rounded-[24px] border border-white/10 bg-base/70 p-5"
                  >
                    <Icon size={20} className="text-brand-accent" strokeWidth={1.5} />
                    <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-text-primary">
                      {label}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-text-secondary">
                      {detail}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Shield, Car, Flame, Calendar, UserCheck, Map, ArrowRight } from "lucide-react";
import { revealUp, signatureEase, staggerParent, TypingText } from "@/components/motionSystem";

const services = [
  {
    icon: Shield,
    title: "Armed & Unarmed Guards",
    description: "Visible deterrence, gate control, post orders, and escalation-ready site presence.",
    code: "OT-01",
  },
  {
    icon: Car,
    title: "Mobile Patrols",
    description: "Randomized patrol patterns with supervisor oversight and digital verification.",
    code: "OT-02",
  },
  {
    icon: Flame,
    title: "Fire Watch",
    description: "Emergency deployment when fire systems fail and logs must stay inspection-ready.",
    code: "OT-03",
  },
  {
    icon: Calendar,
    title: "Event Security",
    description: "Guest flow, bag checks, perimeter control, and incident response for live environments.",
    code: "OT-04",
  },
  {
    icon: UserCheck,
    title: "Executive Protection",
    description: "Low-profile movement planning and close protection for principals under pressure.",
    code: "OT-05",
  },
  {
    icon: Map,
    title: "Site-Specific Plans",
    description: "Coverage maps, patrol cadence, staffing logic, and reporting formats built for the property.",
    code: "OT-06",
  },
];

export function ServicesGrid() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="section-anchor py-32" id="capabilities">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={revealUp(reducedMotion, 26)}
          transition={{ duration: 0.48, ease: signatureEase }}
          className="mb-16 max-w-3xl"
        >
          <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.34em] text-brand-accent">
            Capability Matrix
          </span>
          <h2 className="text-[36px] font-black uppercase leading-[0.95] tracking-[-0.05em] text-text-primary md:text-[52px]">
            Services built to feel like one command system, not six separate vendors.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerParent}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {services.map((service) => (
            <motion.article
              key={service.code}
              variants={revealUp(reducedMotion, 22)}
              transition={{ duration: 0.45, ease: signatureEase }}
              className="signal-panel rounded-[28px] p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-accent/20 bg-brand-accent/10">
                  <service.icon size={26} className="text-brand-accent" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.32em] text-text-secondary">
                  <TypingText text={service.code} speed={60} />
                </span>
              </div>
              <h3 className="mt-8 text-[22px] font-black uppercase tracking-[0.08em] text-text-primary">
                {service.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-text-secondary">
                {service.description}
              </p>
              <Link
                href="#dispatch"
                className="mt-8 inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.24em] text-brand-accent transition-transform hover:translate-x-1"
              >
                Request deployment scope
                <ArrowRight size={15} />
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";
import { Quote } from "lucide-react";
import { revealUp, signatureEase, staggerParent } from "@/components/motionSystem";

const testimonials = [
  {
    quote:
      "The difference was immediate. We did not just get guards, we got a coverage plan with reporting that our managers could actually use.",
    author: "Operations Director",
    role: "Industrial Portfolio / Southern California",
  },
  {
    quote:
      "Their dispatch tone feels like a command center, not a call center. That confidence shows up before the first unit arrives.",
    author: "Site Manager",
    role: "Emergency Fire Watch Deployment",
  },
  {
    quote:
      "Night coverage used to feel improvised. Now our patrol, supervisor notes, and incident updates all read like one system.",
    author: "Asset Protection Lead",
    role: "Multi-site Retail Program",
  },
];

export function Testimonials() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="section-anchor py-32" id="proof-clients">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={revealUp(reducedMotion, 24)}
          transition={{ duration: 0.46, ease: signatureEase }}
          className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.34em] text-brand-accent">
              Client Signal
            </span>
            <h2 className="text-[36px] font-black uppercase leading-[0.95] tracking-[-0.05em] text-text-primary md:text-[52px]">
              The page now carries proof in the same tone as the service.
            </h2>
          </div>
          <div className="signal-panel rounded-2xl px-6 py-5 text-sm uppercase tracking-[0.18em] text-text-secondary">
            Testimonials moved from generic praise to operational evidence.
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerParent}
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {testimonials.map((testimonial) => (
            <motion.article
              key={testimonial.author}
              variants={revealUp(reducedMotion, 20)}
              transition={{ duration: 0.44, ease: signatureEase }}
              className="signal-panel rounded-[28px] p-8"
            >
              <Quote size={24} className="text-brand-accent" strokeWidth={1.4} />
              <p className="mt-6 text-[15px] leading-8 text-text-primary">
                “{testimonial.quote}”
              </p>
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-text-primary">
                  {testimonial.author}
                </p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.24em] text-text-secondary">
                  {testimonial.role}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

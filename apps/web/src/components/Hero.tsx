"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Phone, Radar, ShieldCheck, Waypoints } from "lucide-react";
import { revealSide, revealUp, signatureEase, staggerParent, NumberFlow } from "@/components/motionSystem";

export function Hero() {
  const reducedMotion = useReducedMotion();
  const headlineVariant = revealSide(reducedMotion, 40, -1);
  const panelVariant = revealSide(reducedMotion, 40, 1);

  const intelligenceMarks = [
    "ARMED OFFICERS DEPLOYED",
    "PATROL ROUTES ACTIVE",
    "INCIDENT REPORTS DELIVERED",
    "SUPERVISOR ON-CALL 24/7",
  ];

  return (
    <section className="section-anchor relative flex min-h-screen items-center overflow-hidden pt-28" id="home">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,98,0,0.16),transparent_34%),radial-gradient(circle_at_88%_24%,rgba(37,99,235,0.12),transparent_28%),radial-gradient(circle_at_72%_76%,rgba(255,255,255,0.06),transparent_26%)]" />
        <div className="signal-grid absolute inset-x-0 bottom-0 top-24 opacity-[0.14]" />
      </div>

      <div className="relative mx-auto grid max-w-[1200px] gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(440px,0.85fr)] lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={headlineVariant}
          transition={{ duration: 0.65, ease: signatureEase }}
          className="relative z-10"
        >
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-brand-accent/25 bg-brand-accent/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.32em] text-brand-accent">
            <Radar size={14} />
            Rapid Security Command
          </div>

          <h1 className="max-w-4xl text-[46px] font-black uppercase leading-[0.92] tracking-[-0.05em] text-text-primary md:text-[72px] lg:text-[84px]">
            California
            <span className="block text-brand-accent">Security Command</span>
            Dispatch-Grade Coverage
            <span className="block text-text-secondary">in Under 4 Minutes</span>
          </h1>

          <p className="mt-8 max-w-2xl border-l-2 border-brand-accent/65 pl-6 text-[15px] font-medium uppercase leading-8 tracking-[0.18em] text-text-secondary sm:text-[16px]">
            Armed officers dispatched to high-risk California properties.
            Patrol routes established. Incident reports delivered.
            Your coverage plan ready today.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="#dispatch"
              className="inline-flex items-center justify-center gap-3 rounded-sm bg-brand-accent px-8 py-5 text-xs font-black uppercase tracking-[0.24em] text-white transition-all hover:bg-brand-accent-hover"
            >
              Get Your Coverage Plan
              <ArrowRight size={18} />
            </Link>
            <a
              href="tel:5622431678"
              className="inline-flex items-center justify-center gap-3 rounded-sm border border-white/15 bg-white/5 px-8 py-5 text-xs font-black uppercase tracking-[0.24em] text-text-primary transition-colors hover:border-white/30 hover:bg-white/10"
            >
              <Phone size={16} className="text-brand-accent" />
              Call Dispatch Now
            </a>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerParent}
            className="mt-12 grid gap-3 sm:grid-cols-2"
          >
            {intelligenceMarks.map((mark) => (
              <motion.div
                key={mark}
                variants={revealUp(reducedMotion, 18)}
                transition={{ duration: 0.45, ease: signatureEase }}
                className="signal-panel rounded-2xl px-5 py-4 text-[11px] font-bold uppercase tracking-[0.26em] text-text-secondary"
              >
                {mark}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

<motion.div
                initial="hidden"
                animate="visible"
                variants={panelVariant}
                transition={{ duration: 0.7, delay: 0.08, ease: signatureEase }}
                className="relative z-10"
              >
                <div className="signal-panel rounded-[32px] p-6 sm:p-8">
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.32em] text-brand-accent">
                        Command Status
                      </p>
                      <p className="mt-2 text-lg font-black uppercase tracking-[0.14em] text-text-primary">
                        Ready to Deploy
                      </p>
                    </div>
                    <div className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                      Dispatch Active
                    </div>
                  </div>

                  <div className="relative mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-base/80 p-6">
                    <div className="pointer-events-none absolute inset-0 signal-grid opacity-[0.18]" />
                    <div
                      className="pointer-events-none absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-accent/20"
                      style={reducedMotion ? undefined : { animation: "soft-float 10s ease-in-out infinite" }}
                    />
                    <motion.div
                      aria-hidden
                      animate={reducedMotion ? undefined : { rotate: 360 }}
                      transition={reducedMotion ? undefined : { duration: 18, repeat: Infinity, ease: "linear" }}
                      className="pointer-events-none absolute left-1/2 top-1/2 h-[16rem] w-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
                    >
                      <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent shadow-[0_0_16px_rgba(255,98,0,0.75)]" />
                      <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/70" />
                    </motion.div>

                    <motion.div
                      aria-hidden
                      animate={reducedMotion ? undefined : { rotate: -360 }}
                      transition={reducedMotion ? undefined : { duration: 11, repeat: Infinity, ease: "linear" }}
                      className="pointer-events-none absolute left-1/2 top-1/2 h-[10rem] w-[10rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-accent/35"
                    >
                      <div className="absolute right-0 top-1/2 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent" />
                    </motion.div>

                    <div className="relative z-10 grid gap-4 sm:grid-cols-2">
                      {[
                        { label: "Dispatch Time", value: "< 4 minutes" },
                        { label: "Coverage Type", value: "Armed / Patrol / Fire Watch" },
                        { label: "Supervision", value: "On-call escalation" },
                        { label: "Reporting", value: "Digital shift logs" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm"
                        >
                          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-accent">
                            {item.label}
                          </p>
                          <p className="mt-3 text-sm font-black uppercase tracking-[0.14em] text-text-primary">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="relative z-10 mt-6 grid gap-3 sm:grid-cols-3">
                      {[
                        { icon: ShieldCheck, label: "POSTED ORDERS", tone: "text-emerald-300" },
                        { icon: Waypoints, label: "PATROL LOGS", tone: "text-text-primary" },
                        { icon: Radar, label: "ALERT SYSTEM", tone: "text-brand-accent" },
                      ].map(({ icon: Icon, label, tone }) => (
                        <div
                          key={label}
                          className="rounded-2xl border border-white/10 bg-base/70 px-4 py-3"
                        >
                          <Icon size={18} className={tone} strokeWidth={1.6} />
                          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.26em] text-text-secondary">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="relative z-10 mt-8 grid grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="text-center">
                        <NumberFlow
                          value={8}
                          className="block text-3xl font-black uppercase tracking-wider text-brand-accent"
                        />
                        <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-text-secondary">
                          Years
                        </span>
                      </div>
                      <div className="text-center">
                        <NumberFlow
                          value={240}
                          className="block text-3xl font-black uppercase tracking-wider text-brand-accent"
                        />
                        <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-text-secondary">
                          Guards
                        </span>
                      </div>
                      <div className="text-center">
                        <NumberFlow
                          value={98}
                          format={(n) => `${n}%`}
                          className="block text-3xl font-black uppercase tracking-wider text-brand-accent"
                        />
                        <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-text-secondary">
                          Uptime
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
      </div>
    </section>
  );
}

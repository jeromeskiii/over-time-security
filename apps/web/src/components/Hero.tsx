"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Activity, MapPin, Clock, Layers, Shield, Radio, Users, AlertTriangle } from "lucide-react";
import {
  HeroValidationPanel,
  Button,
  StatusBadge,
  DataVisualization,
} from "@ots/ui";
import { revealUp, revealSide } from "@/design/motion";
import { useMotionSafe } from "@/lib/motion";
import { MotionButton } from "@/components/ui/motion-button";

const statusMetrics = [
  { label: "COVERAGE", value: "ACTIVE", icon: Activity },
  { label: "REGION", value: "CALIFORNIA", icon: MapPin },
  { label: "RESPONSE", value: "< 60 MIN", icon: Clock },
  { label: "SUPERVISION", value: "ATTACHED", icon: Layers },
];

const deploymentMetrics = [
  { label: "ACTIVE OFFICERS", value: "47" },
  { label: "PATROL ROUTES", value: "12" },
  { label: "SUPERVISORS", value: "6" },
  { label: "INCIDENTS", value: "0" },
];

const systemLogs = [
  { time: "03:42:17", message: "Patrol Verification Complete", type: "success" },
  { time: "03:28:44", message: "Supervisor Check-In Verified", type: "info" },
  { time: "03:10:22", message: "Dispatch Coordination Active", type: "info" },
  { time: "02:55:08", message: "Coverage Zone Updated", type: "success" },
  { time: "02:41:31", message: "Guard Deployment Confirmed", type: "success" },
];

const nodePositions = [
  { id: 1, x: 25, y: 55, active: true, label: "LA", officers: 18 },
  { id: 2, x: 50, y: 20, active: true, label: "SF", officers: 12 },
  { id: 3, x: 75, y: 50, active: true, label: "SD", officers: 8 },
  { id: 4, x: 40, y: 40, active: true, label: "FRESNO", officers: 5 },
  { id: 5, x: 60, y: 35, active: true, label: "SAC", officers: 4 },
];

function NetworkMap() {
  const { allowAmbient } = useMotionSafe();

  // Client-side time update to avoid hydration mismatch
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeElement = document.querySelector('.time-update');
      if (timeElement) {
        timeElement.textContent = now.toISOString().split('T')[1].slice(0, 8);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full min-h-[280px] overflow-hidden p-6 md:p-8">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,98,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,98,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      {allowAmbient && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-accent/10"
          style={{ width: "120%", height: "120%" }}
          animate={{ scale: [0.6, 1.2], opacity: [0.15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      )}
      <svg className="absolute inset-0 h-full w-full pointer-events-none">
        {nodePositions.map((node, i) =>
          nodePositions.slice(i + 1).map((target) => (
            <motion.line
              key={`${node.id}-${target.id}`}
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${target.x}%`}
              y2={`${target.y}%`}
              stroke="currentColor"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.15 }}
              transition={{ duration: 1.5, delay: i * 0.2 }}
              className="text-brand-accent/40"
            />
          ))
        )}
      </svg>
      {nodePositions.map((node) => (
        <div
          key={node.id}
          className="absolute"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="group relative">
            <div
              className={`h-3 w-3 rounded-none rotate-45 ${
                node.active ? "bg-brand-accent" : "bg-white/20"
              } shadow-[0_0_15px_rgba(255,98,0,0.3)]`}
            />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap flex flex-col items-center gap-0.5">
              <span className="font-mono text-[9px] font-bold tracking-tighter text-text-primary/80 group-hover:text-brand-accent transition-colors">
                {node.label}
              </span>
              <span className="font-mono text-[7px] text-brand-accent/60">
                {node.officers} officers
              </span>
            </div>
            <div className="absolute inset-0 scale-[3] opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="h-full w-full rounded-full border border-brand-accent/40" />
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-6 left-6 flex flex-col gap-1">
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-text-secondary/60">
          Dispatch.Status
        </span>
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-white/10">
            {allowAmbient && (
              <motion.div
                className="h-full bg-brand-accent/60"
                animate={{ width: ["100%", "30%", "80%", "100%"] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            )}
          </div>
          <span className="font-mono text-[9px] text-brand-accent">COORDINATING</span>
        </div>
      </div>
      <div className="absolute bottom-6 right-6 flex flex-col items-end gap-1">
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-text-secondary/60">
          System.Time
        </span>
        <span className="font-mono text-[10px] text-text-secondary/40 time-update">
          {process.env.BUILD_TIMESTAMP?.slice(11, 19) || '00:00:00'}
        </span>
      </div>
    </div>
  );
}

export function Hero() {
  const { prefersReducedMotion } = useMotionSafe();
  const sectionVariant = revealUp(prefersReducedMotion, 24);

  return (
    <section
      className="section-anchor relative flex min-h-screen items-center overflow-hidden bg-base pt-24"
      id="home"
      aria-label="Overtime Security Coverage Network"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,98,0,0.08),transparent_40%),radial-gradient(circle_at_88%_24%,rgba(37,99,235,0.05),transparent_32%)]" />
        <div className="signal-grid absolute inset-0 opacity-[0.05]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-16 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariant}
        >
          <HeroValidationPanel
            metaLabel={
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="h-px w-12 bg-brand-accent/40" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.34em] text-text-secondary">
                    OVERTIME SECURITY
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.34em] text-brand-accent ml-15">
                  California Security Operations
                </span>
              </div>
            }
            headline={
              <>
                <span className="text-brand-accent">Dispatch-Level</span>
                <br />
                Security Coverage
                <br />
                Built for{" "}
                <span className="text-brand-accent">Real-World</span>
                <br />
                Operations
              </>
            }
            supporting={
              <p className="text-[16px] leading-relaxed tracking-wide normal-case">
                Licensed officers, centralized supervision, and structured incident reporting
                for commercial properties, construction sites, and active environments.
              </p>
            }
            primaryAction={
              <Link href="#dispatch">
                <MotionButton
                  className="bg-brand-accent text-white px-10 py-5 font-black text-[11px] tracking-[0.2em] uppercase rounded-none"
                >
                  Request Security Deployment
                </MotionButton>
              </Link>
            }
            secondaryAction={
              <Link href="#protocol">
                <Button variant="secondary" size="lg" className="rounded-none px-10 py-5 text-[11px] tracking-[0.2em]">
                  View Coverage Protocol
                </Button>
              </Link>
            }
            panelTitle="Coverage.Operations.Surface"
            panelSubtitle="DEPLOYMENT ID: OTS-CA-2024"
            statusStrip={
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
                  {statusMetrics.map((m) => (
                    <div key={m.label} className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <m.icon
                          size={10}
                          className="text-brand-accent/60"
                        />
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary">
                          {m.label}
                        </span>
                      </div>
                      <span className="font-mono text-[13px] font-bold tracking-wider text-text-primary">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
                <StatusBadge status="Active" variant="active" />
              </div>
            }
            visualization={
              <DataVisualization>
                <NetworkMap />
              </DataVisualization>
            }
            moduleHints={
              <>
                <div className="grid grid-cols-4 divide-x divide-white/5 border-b border-white/5">
                  {deploymentMetrics.map((m) => (
                    <div key={m.label} className="flex flex-col gap-0.5 p-4">
                      <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-text-secondary/60">
                        {m.label}
                      </span>
                      <span className="font-mono text-base font-black leading-none text-text-primary">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 divide-x divide-white/5">
                  <div className="flex flex-col gap-1 p-4">
                    <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-text-secondary/60">
                      Avg Response
                    </span>
                    <span className="font-mono text-lg font-black leading-none text-brand-accent">
                      42min
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-text-secondary/60">
                      Coverage
                    </span>
                    <span className="font-mono text-lg font-black leading-none text-text-primary">
                      87%
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-text-secondary/60">
                      Reliability
                    </span>
                    <span className="font-mono text-lg font-black leading-none text-text-primary">
                      99.9%
                    </span>
                  </div>
                </div>
                <div className="border-t border-white/10 px-6 py-4 bg-black/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse" />
                      <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-text-secondary">
                        Operations.Feed
                      </span>
                    </div>
                    <span className="font-mono text-[7px] text-text-secondary/40">LIVE</span>
                  </div>
                  <div className="space-y-2 max-h-[120px] overflow-hidden">
                    {systemLogs.map((log, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <time className="font-mono text-[8px] text-text-secondary/60 shrink-0 w-14">
                          {log.time}
                        </time>
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="font-mono text-[8px] text-text-secondary/80 truncate">
                          {log.message}
                        </span>
                        <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                          log.type === "success" ? "bg-emerald-500/60" : "bg-brand-accent/60"
                        }`} />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            }
          />
        </motion.div>
      </div>
    </section>
  );
}

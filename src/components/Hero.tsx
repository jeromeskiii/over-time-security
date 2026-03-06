import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const floatingNodes = [
  { left: '12%', top: '24%', duration: 8 },
  { left: '26%', top: '68%', duration: 10 },
  { left: '41%', top: '18%', duration: 7 },
  { left: '58%', top: '62%', duration: 9 },
  { left: '74%', top: '28%', duration: 11 },
  { left: '86%', top: '74%', duration: 8.5 },
];

export function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-base">
      <img
        src="/images/hero-night.webp"
        alt="Security team at night"
        className="absolute inset-0 h-full w-full object-cover opacity-28"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-base/92 via-base/84 to-base/95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,98,0,0.14),transparent_42%),radial-gradient(circle_at_16%_72%,rgba(37,99,235,0.07),transparent_48%)]" />

      {/* Subtle Floating Nodes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {floatingNodes.map((node, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-brand-accent/20 rounded-full"
            initial={{
              x: node.left,
              y: node.top,
            }}
            animate={reducedMotion ? { opacity: 0.25 } : {
              y: ['-10%', '10%'],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={reducedMotion ? undefined : {
              duration: node.duration,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Heavy Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brand-accent/10 border border-brand-accent/20 text-brand-accent font-bold text-[10px] tracking-[0.2em] uppercase mb-8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
              Operational Intelligence / California
            </div>
            <h1 className="text-[48px] md:text-[72px] font-black text-text-primary leading-[0.95] tracking-tighter mb-8 uppercase">
              24/7 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-[#ff8c42]">Security Coverage</span> <br />
              Across California
            </h1>
            <p className="text-[16px] text-text-secondary font-medium leading-relaxed mb-10 max-w-xl border-l-2 border-brand-accent pl-6 uppercase tracking-widest">
              Armed guards, mobile patrols, fire watch, and event security <br />
              managed with real-time reporting and veteran leadership.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-3 bg-brand-accent hover:bg-brand-accent-hover text-white px-8 py-5 rounded-sm font-black text-xs tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(255,98,0,0.2)] hover:shadow-[0_0_30px_rgba(255,98,0,0.4)] uppercase"
              >
                Get Security Coverage
                <ArrowRight size={18} />
              </Link>
              <a
                href="tel:5622431678"
                className="inline-flex items-center justify-center gap-3 bg-white/6 hover:bg-white/12 border border-white/15 text-text-primary px-8 py-5 rounded-sm font-black text-xs tracking-[0.2em] transition-all uppercase backdrop-blur-sm"
              >
                Call 24/7 Dispatch
              </a>
            </div>
          </motion.div>

          {/* Right Side Dovetail Orbital Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex relative h-[600px] w-full items-center justify-center"
          >
            <div className="relative h-[420px] w-full flex items-center justify-center">
              {/* Outer Orbit */}
              <motion.div
                className="absolute w-[340px] h-[340px] border border-white/10 rounded-full"
                animate={reducedMotion ? undefined : { rotate: 360 }}
                transition={reducedMotion ? undefined : { duration: 40, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full" />
                <div className="absolute bottom-1/4 right-0 translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-white/30 rounded-full" />
              </motion.div>

              {/* Inner Orbit */}
              <motion.div
                className="absolute w-[220px] h-[220px] border border-brand-accent/40 rounded-full"
                animate={reducedMotion ? undefined : { rotate: -360 }}
                transition={reducedMotion ? undefined : { duration: 25, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-1/4 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-brand-accent rounded-full shadow-[0_0_10px_rgba(255,98,0,0.8)]" />
              </motion.div>

              {/* Animated Lines connecting nodes */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <motion.path
                  d="M 50 210 L 150 210 L 210 150"
                  stroke="var(--color-brand-accent)"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={reducedMotion ? { pathLength: 1, opacity: 0.35 } : { pathLength: 1, opacity: 0.5 }}
                  transition={reducedMotion ? { duration: 0.3 } : { duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <motion.path
                  d="M 370 100 L 280 100 L 210 170"
                  stroke="var(--color-brand-accent)"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={reducedMotion ? { pathLength: 1, opacity: 0.2 } : { pathLength: 1, opacity: 0.3 }}
                  transition={reducedMotion ? { duration: 0.3 } : { duration: 4, repeat: Infinity, ease: 'linear', delay: 1 }}
                />
              </svg>

              {/* Center Dot */}
              <div className={`absolute w-4 h-4 bg-brand-accent rounded-full shadow-[0_0_20px_rgba(255,98,0,1)] ${reducedMotion ? '' : 'animate-pulse'}`} />
              
              {/* Tactical Stats Overlay */}
              <div className="absolute top-10 right-4 space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="bg-surface/60 backdrop-blur-md border border-white/10 p-4 rounded-sm"
                >
                  <p className="text-[8px] text-brand-accent font-black tracking-widest uppercase mb-1">Status</p>
                  <p className="text-xs font-bold text-text-primary uppercase tracking-widest">Operational</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="bg-surface/60 backdrop-blur-md border border-white/10 p-4 rounded-sm"
                >
                  <p className="text-[8px] text-brand-accent font-black tracking-widest uppercase mb-1">Response Time</p>
                  <p className="text-xs font-bold text-text-primary uppercase tracking-widest">&lt; 58 min avg</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

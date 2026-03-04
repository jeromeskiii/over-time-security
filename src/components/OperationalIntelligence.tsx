import { motion } from 'motion/react';
import { FileText, Radio, BarChart3, Clock } from 'lucide-react';

const bullets = [
  { icon: FileText, label: 'Real-Time Patrol Reports' },
  { icon: Radio, label: 'Live Incident Alerts' },
  { icon: BarChart3, label: 'Monthly Analytics Dashboard' },
  { icon: Clock, label: '24/7 Activity Logging' },
];

const activityRows = [
  { ok: true, text: 'Patrol completed', time: '2m ago' },
  { ok: true, text: 'Check-in Zone A', time: '15m ago' },
  { ok: false, text: 'Motion detected', time: '23m ago' },
  { ok: true, text: 'Shift started', time: '1h ago' },
];

function DashboardMockup() {
  return (
    <div className="bg-surface border border-white/10 rounded-lg overflow-hidden shadow-[0_0_60px_rgba(255,98,0,0.08)]">
      {/* Browser chrome */}
      <div className="bg-[#0d1117] border-b border-white/5 px-4 py-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500/70" />
        <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
        <span className="w-2 h-2 rounded-full bg-green-500/70" />
        <span className="ml-3 text-text-secondary text-[11px] tracking-wider">Over Time Security Portal</span>
      </div>

      <div className="p-4 space-y-3">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: '12', label: 'Active' },
            { value: '3', label: 'Alerts' },
            { value: '0', label: 'Issues' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-[#0d1117] border border-white/5 rounded-md p-3 text-center">
              <div className="text-brand-accent font-black text-2xl leading-none">{value}</div>
              <div className="text-text-secondary text-[10px] uppercase tracking-wider mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Activity log */}
        <div className="bg-[#0d1117] border border-white/5 rounded-md p-3">
          <div className="text-text-secondary text-[10px] uppercase tracking-wider mb-2">Recent Activity</div>
          <div className="space-y-2">
            {activityRows.map(({ ok, text, time }) => (
              <div key={text} className="flex items-center gap-2">
                <span className={`text-[11px] font-bold ${ok ? 'text-green-400' : 'text-yellow-400'}`}>
                  {ok ? '✓' : '⚠'}
                </span>
                <span className="text-text-secondary text-[11px] flex-1">{text}</span>
                <span className="text-white/20 text-[10px]">{time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom panels */}
        <div className="grid grid-cols-2 gap-2">
          {/* Coverage map */}
          <div className="bg-[#0d1117] border border-white/5 rounded-md p-3">
            <div className="text-text-secondary text-[10px] uppercase tracking-wider mb-2">Coverage Map</div>
            <div className="grid grid-cols-6 gap-1">
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    [2, 5, 8, 11, 14, 17].includes(i)
                      ? 'bg-brand-accent/70'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Guard performance */}
          <div className="bg-[#0d1117] border border-white/5 rounded-md p-3">
            <div className="text-text-secondary text-[10px] uppercase tracking-wider mb-2">Guard Perf.</div>
            <div className="space-y-1.5">
              {[90, 75, 60, 85].map((pct, i) => (
                <div key={i} className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-accent/60 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OperationalIntelligence() {
  return (
    <section className="py-32 bg-base">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px]">
              Operational Intelligence
            </span>
            <h2 className="mt-4 text-[36px] md:text-[48px] font-black text-text-primary leading-[0.95] tracking-tighter uppercase">
              Operational Visibility for Every Site
            </h2>
            <p className="mt-6 text-[16px] text-text-secondary leading-relaxed">
              Clients receive real-time reports, patrol logs, and incident documentation from every guard deployment.
            </p>

            <ul className="mt-8 space-y-4">
              {bullets.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <Icon size={18} className="text-brand-accent flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-text-secondary text-sm uppercase tracking-wider font-medium">{label}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right — dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

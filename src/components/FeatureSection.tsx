import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const operationalFeatures = [
  {
    title: 'GPS OPERATIONAL TRACKING',
    description: 'REAL-TIME GEO-FENCED MONITORING OF ALL DEPLOYED UNITS.',
  },
  {
    title: 'DIGITAL INCIDENT PROTOCOLS',
    description: 'INSTANT TRANSMISSION OF FIELD REPORTS AND ACTIONABLE DATA.',
  },
  {
    title: 'COMMAND CENTER UPTIME',
    description: '24/7 TACTICAL OVERWATCH AND IMMEDIATE DISPATCH INTEGRATION.',
  },
  {
    title: 'BIOMETRIC AUTHENTICATION',
    description: 'SECURE VERIFICATION OF ALL PERSONNEL AT CRITICAL ACCESS POINTS.',
  }
];

const caseStudies = [
  {
    title: 'Critical Asset Recovery',
    sector: 'Industrial / Logistics',
    result: '40% reduction in theft incidents within 90 days of deployment.',
  },
  {
    title: 'High-Density Event Control',
    sector: 'Event Operations',
    result: 'Zero safety breaches across 15,000+ attendee environment.',
  }
];

export function FeatureSection() {
  return (
    <>
      {/* Operational Features */}
      <section className="py-32 bg-surface border-y border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            {operationalFeatures.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white/[0.03] backdrop-blur-md p-10 border border-white/10 group hover:border-brand-accent/30 transition-colors"
              >
                <h4 className="text-brand-accent font-black text-[10px] tracking-[0.3em] mb-4">{feature.title}</h4>
                <p className="text-text-primary text-xs font-bold leading-relaxed uppercase tracking-wider">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Analysis */}
      <section className="py-32 bg-surface">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-4">Strategic Outcomes</h2>
            <h3 className="text-[32px] md:text-[40px] font-black text-text-primary tracking-tighter uppercase mb-8 leading-none">CASE ANALYSIS</h3>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {caseStudies.map((study, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white/[0.03] backdrop-blur-md p-12 border border-white/10 relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4">
                  <ArrowRight size={24} className="text-brand-accent/20 group-hover:text-brand-accent transition-colors" />
                </div>
                <h4 className="text-brand-accent font-black text-[10px] tracking-[0.3em] mb-6 uppercase">{study.sector}</h4>
                <h5 className="text-[20px] font-black text-text-primary mb-6 uppercase tracking-tight">{study.title}</h5>
                <p className="text-text-secondary text-[16px] font-bold uppercase tracking-widest leading-relaxed">{study.result}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

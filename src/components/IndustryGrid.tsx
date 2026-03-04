import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

const industries = [
  { id: 'construction', title: 'Construction Security', image: '/images/construction-guard.webp' },
  { id: 'retail', title: 'Retail Security', image: '/images/retail.webp' },
  { id: 'corporate', title: 'Corporate Security', image: '/images/corporate-offices.webp' },
  { id: 'healthcare', title: 'Healthcare Security', image: '/images/healthcare-offices.webp' },
  { id: 'events', title: 'Event Security', image: '/images/event-concert.webp' },
  { id: 'government', title: 'Government Security', image: '/images/government-offices.webp' },
];

export function IndustryGrid() {
  return (
    <section id="industries" className="py-32 bg-base">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield size={14} className="text-brand-accent" strokeWidth={2} />
            <span className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px]">
              Industries We Protect
            </span>
          </div>
          <h2 className="text-[36px] md:text-[48px] font-black text-text-primary leading-[0.95] tracking-tighter uppercase">
            Security Solutions<br />
            <span className="text-brand-accent">For Every Sector</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
            >
              <div className="group relative aspect-[16/9] rounded-sm overflow-hidden border border-white/5 hover:border-brand-accent/40 transition-all duration-500">
                <img
                  src={industry.image}
                  alt={industry.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white font-black text-[18px] uppercase tracking-[0.1em] leading-tight">
                    {industry.title}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from 'motion/react';
import { Shield, Star } from 'lucide-react';

const testimonials = [
  {
    quote: "WE NEEDED ARMED GUARDS OVERNIGHT AFTER A BREAK-IN. OVERTIME SECURITY HAD COVERAGE IN UNDER AN HOUR. THEIR DISPATCH IS ELITE.",
    author: "SITE MANAGER",
    role: "LOS ANGELES",
  }
];

export function Testimonials() {
  return (
    <section className="py-32 bg-base border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-12 md:p-24 relative overflow-hidden rounded-sm"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Shield size={200} className="text-white" />
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="flex gap-1 mb-12">
              {[...Array(5)].map((_, j) => (
                <Star key={j} size={14} className="text-brand-accent fill-brand-accent" />
              ))}
            </div>
            
            <h3 className="text-3xl md:text-[40px] font-black text-text-primary leading-[1.1] tracking-tighter mb-12 uppercase italic">
              "{testimonials[0].quote}"
            </h3>
            
            <div className="flex items-center gap-6">
              <div className="h-px w-12 bg-brand-accent" />
              <div>
                <p className="text-text-primary font-black text-sm tracking-[0.2em] uppercase">{testimonials[0].author}</p>
                <p className="text-text-secondary text-[10px] font-bold tracking-[0.2em] uppercase mt-1">{testimonials[0].role}</p>
              </div>
            </div>
          </div>

          {/* Tactical Grid Detail */}
          <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <defs>
                <pattern id="grid-small" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid-small)" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

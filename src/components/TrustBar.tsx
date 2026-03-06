import { motion } from 'motion/react';

const trustSignals = [
  "Veteran Led",
  "24/7 Dispatch",
  "Fully Insured",
  "California Statewide",
  "Rapid Response"
];

export function TrustBar() {
  return (
    <section className="bg-surface border-y border-white/5 py-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center text-text-secondary text-xs lg:text-sm font-black tracking-[0.2em] uppercase items-center"
        >
          {trustSignals.map((signal, i) => (
            <span key={i} className="hover:text-text-primary transition-colors cursor-default">
              {signal}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

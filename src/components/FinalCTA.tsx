import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Phone } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="py-32 bg-base relative overflow-hidden">
      {/* Accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,98,0,0.07),transparent_65%)]"
      />

      {/* Top border line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-brand-accent/40" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Label */}
          <span className="inline-block text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-8">
            Immediate Deployment Available
          </span>

          {/* Heading */}
          <h2 className="text-[48px] md:text-[80px] font-black text-text-primary leading-[0.92] tracking-tighter uppercase mb-8">
            Need Security<br />Coverage Tonight?
          </h2>

          {/* Sub */}
          <p className="text-text-secondary text-[15px] font-bold uppercase tracking-widest leading-relaxed max-w-lg mx-auto mb-14">
            Get a quote in under 60 seconds or call dispatch.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-3 bg-brand-accent hover:bg-brand-accent-hover text-white px-10 py-5 rounded-sm font-black text-xs tracking-[0.2em] transition-all shadow-[0_0_24px_rgba(255,98,0,0.25)] hover:shadow-[0_0_36px_rgba(255,98,0,0.45)] uppercase"
            >
              Get Quote
              <ArrowRight size={17} />
            </Link>
            <a
              href="tel:5622431678"
              className="inline-flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-text-primary px-10 py-5 rounded-sm font-black text-xs tracking-[0.2em] transition-all uppercase"
            >
              <Phone size={15} className="text-brand-accent" />
              Call Dispatch
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom border line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-t from-transparent to-brand-accent/20" />
    </section>
  );
}


import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export function NotFound() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="py-32 bg-base min-h-[70vh] flex items-center"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <span className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px]">
          Error 404
        </span>
        <h1 className="text-[64px] md:text-[96px] font-black text-text-primary leading-[0.95] tracking-tighter uppercase mt-4 mb-6">
          Page Not Found
        </h1>
        <p className="text-[16px] text-text-secondary uppercase tracking-widest leading-relaxed max-w-xl mx-auto mb-10">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-3 bg-brand-accent hover:bg-brand-accent-hover text-white px-8 py-5 rounded-sm font-black text-xs tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(255,98,0,0.2)] hover:shadow-[0_0_30px_rgba(255,98,0,0.4)] uppercase"
        >
          Return Home
          <ArrowRight size={18} />
        </Link>
      </div>
    </motion.section>
  );
}

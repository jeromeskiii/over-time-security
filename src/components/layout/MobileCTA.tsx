import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MobileCTA() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-base border-t border-white/5 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
      <div className="flex">
        <a
          href="tel:5622431678"
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-surface text-text-primary font-bold text-[10px] tracking-[0.2em] uppercase"
        >
          <Phone size={16} className="text-brand-accent" />
          DIRECT LINE
        </a>
        <Link
          to="/contact"
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-brand-accent text-white font-bold text-[10px] tracking-[0.2em] uppercase"
        >
          GET QUOTE
        </Link>
      </div>
    </div>
  );
}

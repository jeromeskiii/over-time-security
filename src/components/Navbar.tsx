import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Services', path: '/services' },
  { name: 'Industries', path: '/#industries' },
  { name: 'About', path: '/about' },
  { name: 'Blog', path: '/#blog' },
  { name: 'Contact', path: '/contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-base/80 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/images/logoOrange.webp" alt="Over Time Security" className="h-10 w-auto" />
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight leading-none text-text-primary">OVER TIME</span>
              <span className="font-semibold text-[10px] tracking-widest text-brand-accent uppercase leading-none mt-0.5">Security</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-1 bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200',
                    isActive
                      ? 'bg-brand-accent/15 text-brand-accent'
                      : 'text-text-secondary hover:bg-white/10 hover:text-text-primary'
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:5622431678" className="flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors">
              <Phone size={14} className="text-brand-accent" />
              <span>24/7 DISPATCH</span>
            </a>
            <Link
              to="/contact"
              className="bg-brand-accent hover:bg-brand-accent-hover text-white px-4 py-2 rounded-sm font-bold text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(255,98,0,0.2)] hover:shadow-[0_0_20px_rgba(255,98,0,0.4)] uppercase"
            >
              GET QUOTE
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-text-secondary hover:text-text-primary p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="md:hidden bg-base border-t border-white/5"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'text-sm font-bold uppercase tracking-widest py-3 border-b border-white/5',
                    (location.pathname + location.hash) === link.path ? 'text-brand-accent' : 'text-text-secondary'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-3">
                <a
                  href="tel:5622431678"
                  className="flex items-center justify-center gap-2 bg-surface text-text-primary py-3 rounded-sm font-bold text-sm"
                >
                  <Phone size={18} className="text-brand-accent" />
                  CALL DISPATCH
                </a>
                <Link
                  to="/contact"
                  className="flex items-center justify-center bg-brand-accent text-white py-3 rounded-sm font-bold text-sm uppercase tracking-widest"
                >
                  GET INSTANT QUOTE
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

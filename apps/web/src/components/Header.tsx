"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Menu, X, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { signatureEase } from "@/components/motionSystem";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#capabilities", label: "Capabilities" },
    { href: "#protocol", label: "Protocol" },
    { href: "#proof", label: "Proof" },
    { href: "#dispatch", label: "Dispatch" },
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-white/10 bg-base/82 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-brand-accent/25 bg-brand-accent/10">
              <Shield className="h-5 w-5 text-brand-accent" strokeWidth={1.6} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm uppercase tracking-[0.32em] text-text-primary sm:text-base">
                Over Time
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.34em] text-text-secondary">
                California Coverage Network
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur-sm md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <a
              href="tel:5622431678"
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-text-secondary transition-colors hover:text-text-primary"
            >
              <Phone size={14} className="text-brand-accent" />
              24/7 Dispatch
            </a>
            <Link
              href="#dispatch"
              className="inline-flex items-center gap-2 rounded-sm bg-brand-accent px-5 py-3 text-xs font-black uppercase tracking-[0.24em] text-white transition-all hover:bg-brand-accent-hover"
            >
              Request Coverage
            </Link>
          </div>

          <button
            className="rounded-sm border border-white/10 bg-white/5 p-2 text-text-secondary transition-colors hover:text-text-primary md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle site menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: signatureEase }}
            className="border-b border-white/10 bg-base/96 px-4 pb-5 pt-1 backdrop-blur-xl md:hidden"
          >
            <nav className="signal-panel rounded-2xl p-4">
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-xl border border-transparent px-4 py-3 text-sm font-bold uppercase tracking-[0.22em] text-text-secondary transition-colors hover:border-white/10 hover:bg-white/5 hover:text-text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <a
                  href="tel:5622431678"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-text-primary"
                >
                  Call Dispatch
                </a>
                <Link
                  href="#dispatch"
                  className="inline-flex items-center justify-center rounded-xl bg-brand-accent px-4 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Request Quote
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

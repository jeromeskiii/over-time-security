"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Menu, X, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { signatureEase } from "@/design/motion";

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
          ? "border-b border-white/10 bg-base/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 py-4">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="flex h-10 w-10 items-center justify-center border border-brand-accent/25 bg-brand-accent/5 transition-colors group-hover:bg-brand-accent/10">
              <Shield className="h-5 w-5 text-brand-accent" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-black uppercase tracking-[0.4em] text-text-primary">
                OVERTIME SECURITY
              </span>
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-text-secondary/60">
                California Operations
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 border border-white/5 bg-white/[0.02] p-1 backdrop-blur-md md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-5 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-6 md:flex">
            <a
              href="tel:5622431678"
              className="font-mono flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary transition-colors hover:text-text-primary"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse" />
              24/7 Dispatch
            </a>
            <Link
              href="#dispatch"
              className="bg-brand-accent px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Request Deployment
            </Link>
          </div>

          <button
            className="border border-white/10 bg-white/5 p-2 text-text-secondary transition-colors hover:text-text-primary md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle site menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: signatureEase }}
            className="border-b border-white/10 bg-base/95 px-6 pb-8 pt-2 backdrop-blur-2xl md:hidden"
          >
            <nav className="border border-white/5 bg-white/[0.02] p-4">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block border border-transparent px-4 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary transition-colors hover:border-white/5 hover:bg-white/5 hover:text-text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-1 gap-3">
                <a
                  href="tel:5622431678"
                  className="flex items-center justify-center border border-white/10 bg-white/5 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-primary"
                >
                  Call Dispatch
                </a>
                <Link
                  href="#dispatch"
                  className="flex items-center justify-center bg-brand-accent py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Request Deployment
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

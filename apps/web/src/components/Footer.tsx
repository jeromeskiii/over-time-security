import Link from "next/link";
import { Shield, Phone, Mail, MapPin, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5 py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-brand-accent/25 bg-brand-accent/10">
                <Shield className="h-5 w-5 text-brand-accent" strokeWidth={1.5} />
              </div>
              <span className="font-black text-lg uppercase tracking-[0.2em]">Over Time Security</span>
            </Link>
            <p className="text-text-secondary text-sm leading-7">
              California private security coverage with dispatch-minded presentation, real CTA
              paths, and a stronger production standard across motion and accessibility.
            </p>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-[0.22em] text-sm mb-4">Sections</h4>
            <ul className="space-y-2">
              {[
                ["#capabilities", "Capabilities"],
                ["#protocol", "Protocol"],
                ["#proof", "Proof Stack"],
                ["#dispatch", "Dispatch"],
              ].map(([href, label]) => (
                <li key={label}>
                  <Link href={href} className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm transition-colors">
                    <ArrowRight size={14} className="text-brand-accent" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-[0.22em] text-sm mb-4">Coverage</h4>
            <ul className="space-y-2">
              <li className="text-text-secondary text-sm">Armed and unarmed details</li>
              <li className="text-text-secondary text-sm">Mobile patrol routes</li>
              <li className="text-text-secondary text-sm">Fire watch response</li>
              <li className="text-text-secondary text-sm">Event security operations</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-[0.22em] text-sm mb-4">Dispatch</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-text-secondary text-sm">
                <Phone size={16} className="text-brand-accent" />
                (562) 243-1678
              </li>
              <li className="flex items-center gap-3 text-text-secondary text-sm">
                <Mail size={16} className="text-brand-accent" />
                dispatch@overtimesecurity.com
              </li>
              <li className="flex items-start gap-3 text-text-secondary text-sm">
                <MapPin size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                Los Angeles, California
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm">
            © {new Date().getFullYear()} Over Time Security. All rights reserved.
          </p>
          <p className="text-text-secondary text-sm uppercase tracking-[0.2em]">
            Built for immediate coverage requests
          </p>
        </div>
      </div>
    </footer>
  );
}

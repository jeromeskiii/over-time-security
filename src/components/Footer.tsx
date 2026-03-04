import { Link } from 'react-router-dom';
import { ShieldAlert, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

const services = [
  { name: 'Armed Security', path: '/services/armed-unarmed' },
  { name: 'Mobile Patrols', path: '/services/mobile-patrols' },
  { name: 'Fire Watch', path: '/services/fire-watch' },
  { name: 'Event Security', path: '/services/event-security' },
  { name: 'Executive Protection', path: '/services/executive-protection' },
  { name: 'Construction Security', path: '/services/site-specific' },
];

export function Footer() {
  return (
    <footer className="bg-base border-t border-white/5 pt-20 pb-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-2 group inline-flex">
              <div className="bg-brand-accent text-white p-1.5 rounded-sm group-hover:bg-brand-accent-hover transition-colors">
                <ShieldAlert size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight leading-none text-text-primary">OVER TIME</span>
                <span className="font-semibold text-[10px] tracking-widest text-brand-accent uppercase leading-none mt-0.5">Security</span>
              </div>
            </Link>
            <p className="text-text-secondary text-xs leading-relaxed uppercase tracking-wider">
              VETERAN-LED PRIVATE SECURITY INFRASTRUCTURE DELIVERING FAST, TACTICAL PROTECTION ACROSS CALIFORNIA. BSIS-TRAINED OPERATORS, 24/7 COMMAND CENTER.
            </p>
            <div className="flex flex-col gap-3">
              <span className="bg-surface text-text-primary text-[10px] font-bold px-4 py-2 rounded-sm border border-white/10 tracking-[0.2em] uppercase text-center">
                BSIS LICENSED PPO #120934
              </span>
              <span className="bg-surface text-text-primary text-[10px] font-bold px-4 py-2 rounded-sm border border-white/10 tracking-[0.2em] uppercase text-center">
                VETERAN-LED OPERATIONS
              </span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-text-primary font-bold tracking-[0.3em] uppercase mb-10 text-[10px]">Capabilities</h3>
            <ul className="space-y-4">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className="text-text-secondary hover:text-brand-accent text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight size={14} className="text-brand-accent opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-text-primary font-bold tracking-[0.3em] uppercase mb-10 text-[10px]">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-text-secondary hover:text-brand-accent text-xs font-bold uppercase tracking-widest transition-colors">
                  MISSION
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-text-secondary hover:text-brand-accent text-xs font-bold uppercase tracking-widest transition-colors">
                  DEPLOYMENT & QUOTE
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-text-secondary hover:text-brand-accent text-xs font-bold uppercase tracking-widest transition-colors">
                  CAPABILITIES
                </Link>
              </li>
              <li>
                <Link to="/services/fire-watch" className="text-text-secondary hover:text-brand-accent text-xs font-bold uppercase tracking-widest transition-colors">
                  FIRE WATCH
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-text-primary font-bold tracking-[0.3em] uppercase mb-10 text-[10px]">Command Center</h3>
            <ul className="space-y-6">
              <li>
                <a href="tel:18005550199" className="flex items-start gap-4 group">
                  <div className="bg-surface p-2 rounded-sm border border-white/5 group-hover:border-brand-accent/30 transition-colors">
                    <Phone size={18} className="text-brand-accent" />
                  </div>
                  <div>
                    <p className="text-text-primary font-black text-xl leading-none">1-800-555-0199</p>
                    <p className="text-text-secondary text-[10px] uppercase tracking-widest mt-2">24/7 DIRECT LINE</p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-surface p-2 rounded-sm border border-white/5">
                  <Mail size={18} className="text-brand-accent" />
                </div>
                <div>
                  <p className="text-text-primary font-bold text-xs uppercase tracking-widest">DISPATCH@OVERTIMESECURITY.COM</p>
                  <p className="text-text-secondary text-[10px] uppercase tracking-widest mt-2">QUOTES & INQUIRIES</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-surface p-2 rounded-sm border border-white/5">
                  <MapPin size={18} className="text-brand-accent" />
                </div>
                <div>
                  <p className="text-text-primary font-bold text-xs uppercase tracking-widest">LOS ANGELES HQ</p>
                  <p className="text-text-secondary text-[10px] uppercase tracking-widest mt-2">SERVING ALL OF CALIFORNIA</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-text-secondary text-[10px] font-bold tracking-[0.2em] uppercase">
            &copy; {new Date().getFullYear()} OVER TIME SECURITY. ALL SYSTEMS PROTECTED.
          </p>
          <div className="h-px w-12 bg-white/10 hidden md:block"></div>
          <p className="text-text-secondary text-[10px] font-bold tracking-[0.2em] uppercase">
            CALIFORNIA BSIS PPO LICENSE #120934
          </p>
        </div>
      </div>
    </footer>
  );
}

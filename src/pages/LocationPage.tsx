import { motion } from 'motion/react';
import { Shield, CheckCircle, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QuoteForm } from '@/components/QuoteForm';

export interface LocationService {
  title: string;
  description: string;
}

export interface LocationData {
  city: string;
  state: string;
  intro: string;
  services: LocationService[];
  trustPoints: string[];
  areas: string[];
  areaContext: string;
  heroImage: string;
}

interface LocationPageProps {
  data: LocationData;
}

export function LocationPage({ data }: LocationPageProps) {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden bg-base">
        <div className="absolute inset-0 z-0">
          <img
            src={data.heroImage}
            alt={`Security Guards in ${data.city}`}
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base via-base/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <MapPin size={14} className="text-brand-accent" strokeWidth={2} />
              <span className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px]">
                {data.state} — Local Coverage
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-text-primary leading-[0.95] tracking-tighter mb-8 uppercase">
              SECURITY GUARDS IN<br />
              <span className="text-brand-accent">{data.city.toUpperCase()}</span>
            </h1>
            <p className="text-base md:text-lg text-text-secondary font-medium leading-relaxed max-w-3xl mx-auto border-t border-white/10 pt-8 uppercase tracking-widest">
              {data.intro}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-3 bg-brand-accent hover:bg-brand-accent-hover text-white px-8 py-4 rounded-sm font-black text-xs tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(255,98,0,0.2)] hover:shadow-[0_0_30px_rgba(255,98,0,0.4)] uppercase"
              >
                Get Coverage in {data.city}
                <ArrowRight size={16} />
              </Link>
              <a
                href="tel:5622431678"
                className="inline-flex items-center justify-center gap-3 bg-surface border border-white/10 hover:border-brand-accent/40 text-text-primary px-8 py-4 rounded-sm font-black text-xs tracking-[0.2em] transition-all uppercase"
              >
                Call (562) 243-1678
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Available */}
      <section className="py-32 bg-base">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield size={14} className="text-brand-accent" strokeWidth={2} />
              <span className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px]">
                Available in {data.city}
              </span>
            </div>
            <h2 className="text-[36px] md:text-[48px] font-black text-text-primary leading-[0.95] tracking-tighter uppercase">
              SERVICES WE DEPLOY<br />
              <span className="text-brand-accent">IN YOUR AREA</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="bg-surface border border-white/5 p-8 hover:border-brand-accent/40 transition-all duration-500 rounded-sm"
              >
                <Shield size={20} className="text-brand-accent mb-5" strokeWidth={1.5} />
                <h3 className="text-sm font-black text-text-primary mb-3 uppercase tracking-tight">
                  {service.title}
                </h3>
                <p className="text-text-secondary text-xs leading-relaxed uppercase tracking-widest">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose OTS */}
      <section className="py-32 bg-surface">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Shield size={14} className="text-brand-accent" strokeWidth={2} />
                <span className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px]">
                  Local Advantage
                </span>
              </div>
              <h2 className="text-[36px] md:text-[48px] font-black text-text-primary leading-[0.95] tracking-tighter uppercase mb-8">
                WHY CHOOSE OVERTIME<br />
                <span className="text-brand-accent">IN {data.city.toUpperCase()}</span>
              </h2>
              <p className="text-text-secondary text-xs leading-relaxed uppercase tracking-widest mb-10">
                {data.areaContext}
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 bg-brand-accent hover:bg-brand-accent-hover text-white px-6 py-4 rounded-sm font-black text-xs tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(255,98,0,0.2)] uppercase"
              >
                Request a Quote
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {data.trustPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-base border border-white/5 p-6 rounded-sm hover:border-brand-accent/30 transition-all duration-300"
                >
                  <CheckCircle size={18} className="text-brand-accent mt-0.5 shrink-0" strokeWidth={1.5} />
                  <p className="text-text-secondary text-xs leading-relaxed uppercase tracking-widest">{point}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Areas Served */}
      <section className="py-32 bg-base">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <MapPin size={14} className="text-brand-accent" strokeWidth={2} />
              <span className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px]">
                Coverage Zones
              </span>
            </div>
            <h2 className="text-[36px] md:text-[48px] font-black text-text-primary leading-[0.95] tracking-tighter uppercase">
              NEIGHBORHOODS &<br />
              <span className="text-brand-accent">AREAS WE SERVE</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {data.areas.map((area, index) => (
              <motion.div
                key={area}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="bg-surface border border-white/5 px-5 py-4 rounded-sm hover:border-brand-accent/30 transition-all duration-300 flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                <span className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">{area}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <QuoteForm />
    </div>
  );
}

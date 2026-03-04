import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Shield, Users, Flame, Calendar, Briefcase, Map, ArrowRight } from 'lucide-react';

const services = [
  {
    title: 'Armed Security',
    description: 'High-stakes protection for critical assets, retail, and industrial facilities.',
    icon: Shield,
    path: '/services/armed-unarmed',
  },
  {
    title: 'Mobile Patrols',
    description: 'Randomized vehicular patrols with real-time GPS tracking and instant reporting.',
    icon: Map,
    path: '/services/mobile-patrols',
  },
  {
    title: 'Fire Watch',
    description: 'NFPA-compliant monitoring for buildings with compromised fire systems.',
    icon: Flame,
    path: '/services/fire-watch',
  },
  {
    title: 'Event Security',
    description: 'Comprehensive crowd management and site control for large-scale operations.',
    icon: Calendar,
    path: '/services/event-security',
  },
  {
    title: 'Executive Protection',
    description: 'Low-profile close protection for high-value individuals and leadership.',
    icon: Users,
    path: '/services/executive-protection',
  },
  {
    title: 'Construction Security',
    description: 'Vandalism deterrence and material protection for active job sites.',
    icon: Briefcase,
    path: '/services/site-specific',
    image: '/images/construction-guard.webp',
  },
];

export function Services() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-base">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2532&auto=format&fit=crop"
            alt="Los Angeles Skyline at Night"
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
            <h1 className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-6">Operational Scope</h1>
            <h2 className="text-6xl md:text-8xl font-black text-text-primary leading-[0.95] tracking-tighter mb-8 uppercase">
              CAPABILITIES
            </h2>
            <p className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed max-w-2xl mx-auto border-t border-white/10 pt-8 uppercase tracking-widest">
              MISSION-CRITICAL PROTECTION SERVICES FOR HIGH-STAKES ENVIRONMENTS.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 bg-base">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.title}
                  to={service.path}
                  className="group relative bg-surface border border-white/5 p-10 hover:border-brand-accent/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(255,98,0,0.05)] transition-all duration-500 overflow-hidden rounded-sm flex flex-col justify-between"
                >
                  <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-accent/5 rounded-full blur-2xl group-hover:bg-brand-accent/10 transition-colors" />
                  
                  <div>
                    <Icon size={24} className="text-brand-accent mb-10 relative z-10" strokeWidth={1.5} />
                    <h4 className="text-lg font-black text-text-primary mb-4 relative z-10 tracking-tight uppercase">{service.title}</h4>
                    <p className="text-text-secondary text-xs leading-relaxed mb-10 relative z-10 uppercase tracking-widest line-clamp-2 h-8">{service.description}</p>
                    {service.image && (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-44 object-cover rounded-sm border border-white/10"
                      />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-brand-accent font-black text-[10px] tracking-[0.3em] relative z-10 uppercase pt-6 border-t border-white/5 group-hover:border-brand-accent/20 transition-colors">
                    DEPLOY MODULE
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

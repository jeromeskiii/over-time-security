import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Shield, Map, Flame, Calendar, Users, Briefcase, ArrowRight } from 'lucide-react';

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
    title: 'Construction',
    description: 'Vandalism deterrence and material protection for active job sites.',
    icon: Briefcase,
    path: '/services/site-specific',
  },
  {
    title: 'Executive Protection',
    description: 'Low-profile close protection for high-value individuals and leadership.',
    icon: Users,
    path: '/services/executive-protection',
  },
];

export function ServicesGrid() {
  return (
    <section className="py-32 bg-base">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-20 text-center"
        >
          <h2 className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-4">Core Capabilities</h2>
          <h3 className="text-[32px] md:text-[40px] font-black text-text-primary tracking-tighter mb-6 uppercase">Mission-Critical Services</h3>
          <p className="text-[16px] text-text-secondary leading-relaxed max-w-2xl mx-auto">
            We deploy advanced security protocols tailored to high-density urban environments and sensitive infrastructure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={service.path}
                  className="group block h-full bg-white/[0.03] border border-white/10 rounded-xl p-6 hover:border-brand-accent/40 transition-all duration-300"
                >
                  <div className="mb-4 text-brand-accent">
                    <Icon size={28} strokeWidth={1.5} />
                  </div>

                  <h4 className="text-lg font-semibold text-text-primary mb-2">
                    {service.title}
                  </h4>

                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-2 text-brand-accent text-xs font-medium tracking-wide group-hover:gap-3 transition-all">
                    Learn more
                    <ArrowRight size={14} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

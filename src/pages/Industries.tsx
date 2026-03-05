import { motion } from 'motion/react';
import { Shield, Building2, HardHat, ShoppingBag, HeartPulse, Landmark, Home, Warehouse, GraduationCap } from 'lucide-react';
import { IndustryGrid } from '@/components/IndustryGrid';
import { QuoteForm } from '@/components/QuoteForm';

const industries = [
  {
    icon: Building2,
    title: 'Corporate Offices',
    description:
      'Corporate environments demand discreet, professional security that protects employees, executives, and sensitive data without disrupting business operations. Our officers are trained in access control, visitor management, and threat de-escalation to maintain a safe workplace at every level.',
  },
  {
    icon: HardHat,
    title: 'Construction Sites',
    description:
      'Active job sites are high-value targets for equipment theft, vandalism, and unauthorized entry — especially after hours. Overtime Security deploys armed and unarmed guards, mobile patrols, and perimeter monitoring to protect your materials, machinery, and workforce throughout every phase of construction.',
  },
  {
    icon: ShoppingBag,
    title: 'Retail & Shopping Centers',
    description:
      'Retail loss prevention requires a visible deterrent combined with tactical response capability. Our guards are trained in shoplifting prevention, crowd control, and emergency response — keeping customers safe and shrinkage low across single-location stores and multi-tenant shopping centers.',
  },
  {
    icon: HeartPulse,
    title: 'Healthcare Facilities',
    description:
      'Hospitals, clinics, and care facilities face unique security challenges including patient aggression, unauthorized access to restricted areas, and protection of controlled substances. Our licensed officers bring calm, professional presence to sensitive healthcare environments 24 hours a day.',
  },
  {
    icon: Landmark,
    title: 'Government Buildings',
    description:
      'Public-sector facilities require officers who understand compliance requirements, access credentialing, and dignified public-facing conduct. Overtime Security provides cleared, background-checked personnel qualified for municipal, county, and state-level facility protection.',
  },
  {
    icon: Home,
    title: 'Residential Communities',
    description:
      'Gated communities, HOAs, and multi-unit residential properties benefit from consistent patrol schedules, gate access enforcement, and rapid incident response. Our residential security programs reduce crime, increase resident confidence, and maintain a professional community image.',
  },
  {
    icon: Warehouse,
    title: 'Warehouses & Distribution',
    description:
      'High-volume logistics facilities are vulnerable to cargo theft, employee theft, and perimeter breaches. We provide around-the-clock stationary guards and vehicle patrols tailored to shift schedules, dock operations, and inventory protection across Southern California distribution networks.',
  },
  {
    icon: GraduationCap,
    title: 'Educational Institutions',
    description:
      'Schools, colleges, and universities require security that balances an open, welcoming environment with firm threat prevention. Overtime Security works alongside campus safety teams to enforce access policies, monitor common areas, and respond to incidents with professionalism and care.',
  },
];

export function Industries() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-base">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2670&auto=format&fit=crop"
            alt="Industries We Protect"
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
              <Shield size={14} className="text-brand-accent" strokeWidth={2} />
              <span className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px]">
                Sector Coverage
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-text-primary leading-[0.95] tracking-tighter mb-8 uppercase">
              INDUSTRIES WE PROTECT
            </h1>
            <p className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed max-w-2xl mx-auto border-t border-white/10 pt-8 uppercase tracking-widest">
              SPECIALIZED SECURITY PROGRAMS BUILT FOR THE UNIQUE THREATS EACH SECTOR FACES.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Industry Grid */}
      <IndustryGrid />

      {/* Industry Detail Cards */}
      <section className="py-32 bg-surface">
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
                Sector Intelligence
              </span>
            </div>
            <h2 className="text-[36px] md:text-[48px] font-black text-text-primary leading-[0.95] tracking-tighter uppercase">
              TAILORED PROGRAMS<br />
              <span className="text-brand-accent">FOR EVERY ENVIRONMENT</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <motion.div
                  key={industry.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-base border border-white/5 p-10 hover:border-brand-accent/40 transition-all duration-500 rounded-sm group"
                >
                  <Icon size={24} className="text-brand-accent mb-6" strokeWidth={1.5} />
                  <h3 className="text-lg font-black text-text-primary mb-4 uppercase tracking-tight">
                    {industry.title}
                  </h3>
                  <p className="text-text-secondary text-xs leading-relaxed uppercase tracking-widest">
                    {industry.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <QuoteForm />
    </div>
  );
}

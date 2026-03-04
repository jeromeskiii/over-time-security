import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Map, Flame, Calendar, Users, Briefcase, ArrowRight, CheckCircle2, ChevronDown, Phone } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const servicesData = {
  'armed-unarmed': {
    title: 'Armed & Unarmed Guards',
    description: 'Professional officers trained to protect people, property, and operations.',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=2532&auto=format&fit=crop',
    process: [
      'Site Assessment & Threat Analysis',
      'Officer Selection & Site-Specific Training',
      'Deployment & Daily Reporting',
      'Continuous Management & Review',
    ],
    pricing: 'Custom Quote Based on Risk Profile & Hours',
    faqs: [
      { q: 'Are your armed guards licensed?', a: 'Yes, all armed officers hold active BSIS exposed firearm permits and undergo continuous tactical training.' },
      { q: 'How quickly can you deploy guards?', a: 'Depending on the location and requirements, we can often deploy emergency unarmed guards within 2-4 hours.' },
      { q: 'Do you provide daily reports?', a: 'Yes, our officers use digital reporting tools to provide real-time updates and daily shift logs.' },
    ]
  },
  'mobile-patrols': {
    title: 'Mobile Patrol Services',
    description: 'Scheduled or random patrols to deter theft, vandalism, and trespassing.',
    icon: Map,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=2532&auto=format&fit=crop',
    process: [
      'Route Planning & Vulnerability Mapping',
      'Vehicle Assignment & GPS Tracking Setup',
      'Randomized Patrol Execution',
      'Incident Reporting & Client Dashboard Access',
    ],
    pricing: 'Starting at $XXX/month per location',
    faqs: [
      { q: 'Are patrols scheduled or random?', a: 'We recommend randomized patrols to prevent predictable patterns that criminals can exploit, but we can accommodate fixed schedules if required.' },
      { q: 'What happens if an incident occurs?', a: 'Our patrol officers are trained to de-escalate, contact local law enforcement if necessary, and immediately notify our 24/7 dispatch and the client.' },
      { q: 'Do you use marked vehicles?', a: 'Yes, all patrol vehicles are clearly marked and equipped with light bars for maximum visibility and deterrence.' },
    ]
  },
  'fire-watch': {
    title: 'Fire Watch Services',
    description: 'Temporary monitoring for buildings when fire protection systems are down.',
    icon: Flame,
    image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2532&auto=format&fit=crop',
    process: [
      'Emergency Dispatch & Rapid Deployment',
      'Site Familiarization & Hazard Identification',
      'Continuous Foot Patrols & Log Maintenance',
      'Coordination with Local Fire Marshal',
    ],
    pricing: 'Hourly Rates Available (Emergency Deployment Fees May Apply)',
    faqs: [
      { q: 'How fast can a fire watch guard arrive?', a: 'We prioritize fire watch requests and typically have personnel on-site within 1-3 hours in major metro areas.' },
      { q: 'Do your guards maintain the required logs?', a: 'Yes, our officers maintain detailed, time-stamped logs that comply with local fire marshal regulations.' },
      { q: 'Can you cover 24/7 fire watch?', a: 'Absolutely. We can staff continuous 24/7 fire watch operations for as long as your system is down.' },
    ]
  },
  'event-security': {
    title: 'Event Security',
    description: 'Crowd management and site protection for concerts, festivals, and private events.',
    icon: Calendar,
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2532&auto=format&fit=crop',
    process: [
      'Pre-Event Security Planning & Coordination',
      'Access Control & Perimeter Setup',
      'Crowd Management & VIP Protection',
      'Post-Event Debriefing',
    ],
    pricing: 'Custom Quote Based on Event Size & Risk',
    faqs: [
      { q: 'Do you handle access control?', a: 'Yes, we manage guest lists, ticket scanning, bag checks, and metal detection if required.' },
      { q: 'Can you provide plainclothes officers?', a: 'Yes, we offer both uniformed officers for visible deterrence and plainclothes personnel for discreet security.' },
      { q: 'Do you coordinate with local police?', a: 'For large events, we work directly with local law enforcement and emergency services to ensure a comprehensive security plan.' },
    ]
  },
  'executive-protection': {
    title: 'Executive Protection',
    description: 'Personal security for high-profile individuals and sensitive situations.',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1621360841013-c76831f1628c?q=80&w=2532&auto=format&fit=crop',
    process: [
      'Threat Assessment & Intelligence Gathering',
      'Advance Route & Venue Reconnaissance',
      'Close Protection Execution',
      'Secure Transportation Logistics',
    ],
    pricing: 'Custom Quote Required',
    faqs: [
      { q: 'Are your EP agents armed?', a: 'Yes, our executive protection agents are highly trained, armed professionals, often with military or law enforcement backgrounds.' },
      { q: 'Do you provide secure transportation?', a: 'Yes, we can arrange secure transportation and trained evasive driving specialists.' },
      { q: 'Is this service discreet?', a: 'Absolutely. Our agents are trained to blend in and provide low-profile protection while maintaining complete situational awareness.' },
    ]
  },
  'site-specific': {
    title: 'Site-Specific Security Plans',
    description: 'Custom security strategies designed for complex environments.',
    icon: Briefcase,
    image: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?q=80&w=2532&auto=format&fit=crop',
    process: [
      'Comprehensive Vulnerability Audit',
      'Custom Protocol Development',
      'Technology & Personnel Integration',
      'Ongoing Optimization & Reporting',
    ],
    pricing: 'Custom Quote Required',
    faqs: [
      { q: 'What industries do you specialize in?', a: 'We create custom plans for construction sites, healthcare facilities, industrial warehouses, and corporate campuses.' },
      { q: 'Do you integrate with existing security cameras?', a: 'Yes, our plans often combine physical guard presence with remote monitoring and existing access control systems.' },
      { q: 'How often are the plans updated?', a: 'We conduct regular reviews and adjust protocols based on incident reports, changing threat landscapes, and client feedback.' },
    ]
  },
};

export function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const service = id ? servicesData[id as keyof typeof servicesData] : null;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!service) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-[70vh] flex items-center justify-center bg-base px-4"
      >
        <div className="w-full max-w-3xl bg-surface border border-white/5 rounded-sm p-10 md:p-14 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <p className="text-brand-accent font-black tracking-[0.3em] uppercase text-[10px] mb-5">Service 404</p>
          <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-6 uppercase tracking-tighter leading-[0.95]">
            Service Not Found
          </h1>
          <p className="text-text-secondary text-xs md:text-sm uppercase tracking-widest leading-relaxed max-w-2xl mx-auto mb-10">
            The requested security service could not be located. Please review available services or contact command for immediate assistance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-3 bg-brand-accent hover:bg-brand-accent-hover text-white px-8 py-4 rounded-sm font-black text-xs tracking-[0.2em] transition-all uppercase shadow-[0_0_20px_rgba(255,98,0,0.2)]"
            >
              View All Services
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-3 border border-white/15 hover:border-brand-accent/40 text-text-primary px-8 py-4 rounded-sm font-black text-xs tracking-[0.2em] transition-all uppercase"
            >
              Contact Command
              <Phone size={16} />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  const Icon = service.icon;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-base">
        <div className="absolute inset-0 z-0">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base via-base/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-brand-accent/10 border border-brand-accent/20 mb-8">
              <Icon size={24} className="text-brand-accent" />
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-text-primary leading-[0.95] tracking-tighter mb-8 uppercase">
              {service.title}
            </h1>
            <p className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed mb-10 border-l-2 border-brand-accent pl-6 uppercase tracking-widest">
              {service.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-3 bg-brand-accent hover:bg-brand-accent-hover text-white px-8 py-4 rounded-sm font-black text-xs tracking-[0.2em] transition-all uppercase shadow-[0_0_20px_rgba(255,98,0,0.2)]"
              >
                INITIALIZE DEPLOYMENT
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process & Details */}
      <section className="py-32 bg-surface">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* Process */}
            <div>
              <h2 className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-4">Operational Protocol</h2>
              <h3 className="text-4xl md:text-6xl font-black text-text-primary tracking-tighter mb-12 uppercase">
                THE PROCESS
              </h3>
              
              <div className="space-y-4">
                {service.process.map((step, index) => (
                  <div key={index} className="flex items-start gap-6 bg-base p-8 rounded-sm border border-white/5 relative group hover:border-brand-accent/30 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-brand-accent/10 text-brand-accent font-black text-[10px] shrink-0 border border-brand-accent/20">
                      0{index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary text-sm tracking-widest uppercase mt-1.5">{step}</h4>
                    </div>
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                      <div className="text-[40px] font-black text-white leading-none">0{index + 1}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing & CTA */}
            <div className="space-y-12">
              <div className="bg-base p-10 rounded-sm border border-white/5">
                <h3 className="text-lg font-black text-text-primary tracking-tighter mb-6 uppercase">PRICING ARCHITECTURE</h3>
                <div className="flex items-center gap-5 mb-8">
                  <div className="bg-brand-accent/10 p-3 rounded-sm border border-brand-accent/20">
                    <Briefcase className="text-brand-accent" size={20} />
                  </div>
                  <p className="text-xl font-bold text-text-primary tracking-tight uppercase">{service.pricing}</p>
                </div>
                <p className="text-text-secondary text-sm mb-10 leading-relaxed uppercase tracking-wider">
                  EVERY ENGAGEMENT IS UNIQUE. WE DO NOT PROVIDE TEMPLATIZED QUOTES. REQUEST A DETAILED ASSESSMENT FOR TRANSPARENT, MISSION-SPECIFIC PRICING.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-3 w-full bg-white text-base hover:bg-white/90 px-8 py-5 rounded-sm font-black text-xs tracking-[0.2em] transition-all uppercase"
                >
                  REQUEST PARAMETERS
                </Link>
              </div>

              <div className="bg-brand-accent p-10 rounded-sm shadow-[0_0_40px_rgba(255,98,0,0.15)]">
                <h3 className="text-2xl font-black text-white tracking-tight mb-4 uppercase">URGENT DEPLOYMENT?</h3>
                <p className="text-white/80 mb-8 font-bold text-xs uppercase tracking-[0.2em] leading-relaxed">OUR COMMAND CENTER IS ACTIVE 24/7/365.</p>
                <a
                  href="tel:5622431678"
                  className="inline-flex items-center justify-center gap-4 bg-base text-white hover:bg-base/90 px-8 py-5 rounded-sm font-black text-xl tracking-[0.1em] w-full transition-all uppercase"
                >
                  <Phone size={24} className="text-brand-accent" />
                  (562) 243-1678
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-32 bg-base border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-4">Intel Briefing</h2>
            <h3 className="text-4xl md:text-6xl font-black text-text-primary tracking-tighter uppercase">
              FREQUENT QUESTIONS
            </h3>
          </div>

          <div className="space-y-4">
            {service.faqs.map((faq, index) => (
              <div 
                key={index} 
                className={cn(
                  "bg-surface border transition-colors rounded-sm",
                  openFaq === index ? "border-brand-accent/50" : "border-white/5 hover:border-white/10"
                )}
              >
                <button
                  className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-bold text-text-primary text-sm uppercase tracking-[0.1em] pr-8">{faq.q}</span>
                  <ChevronDown 
                    size={16} 
                    className={cn(
                      "text-brand-accent shrink-0 transition-transform duration-500",
                      openFaq === index ? "rotate-180" : ""
                    )} 
                  />
                </button>
                <div 
                  className={cn(
                    "px-8 overflow-hidden transition-all duration-500 ease-in-out",
                    openFaq === index ? "max-h-60 pb-8 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <p className="text-text-secondary text-sm uppercase tracking-wider leading-relaxed border-t border-white/5 pt-6">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

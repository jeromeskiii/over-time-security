import { motion } from 'motion/react';
import { Shield, CheckCircle2, Award, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-base">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?q=80&w=2532&auto=format&fit=crop"
            alt="Security Team"
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base via-base/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-6">Strategic Origin</h1>
            <h2 className="text-6xl md:text-8xl font-black text-text-primary leading-[0.95] tracking-tighter mb-8">
              VETERAN-LED.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-[#ff8c42]">FIELD-TESTED.</span>
            </h2>
            <p className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed max-w-3xl mx-auto border-t border-white/10 pt-8">
              ENGINEERING SECURITY INFRASTRUCTURE FOR HIGH-STAKES ENVIRONMENTS. 
              NO ENDLESS PHONE TREES. NO UNTRAINED OPERATORS. JUST RESULTS.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values / Why Us */}
      <section className="py-32 bg-surface">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-4">Tactical Advantage</h2>
              <h3 className="text-4xl md:text-6xl font-black text-text-primary tracking-tighter mb-12 uppercase">
                OPERATIONAL<br />INTELLIGENCE
              </h3>
              <div className="space-y-12">
                <div className="flex gap-6">
                  <div className="bg-brand-accent/10 p-3 rounded-sm border border-brand-accent/20 shrink-0 h-fit">
                    <Award className="text-brand-accent" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary mb-3 tracking-[0.2em] uppercase">VETERAN COMMAND</h4>
                    <p className="text-text-secondary text-sm leading-relaxed uppercase tracking-wider">
                      Military discipline applied to private security. Strategic planning, tactical execution, and uncompromising accountability.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="bg-brand-accent/10 p-3 rounded-sm border border-brand-accent/20 shrink-0 h-fit">
                    <CheckCircle2 className="text-brand-accent" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary mb-3 tracking-[0.2em] uppercase">LICENSED OPERATORS</h4>
                    <p className="text-text-secondary text-sm leading-relaxed uppercase tracking-wider">
                      EVERY AGENT IS BSIS-CERTIFIED AND CONTINUOUSLY TRAINED IN ADVANCED PROTECTION PROTOCOLS AND CONFLICT DE-ESCALATION.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="bg-brand-accent/10 p-3 rounded-sm border border-brand-accent/20 shrink-0 h-fit">
                    <Users className="text-brand-accent" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary mb-3 tracking-[0.2em] uppercase">DIRECT COMMS</h4>
                    <p className="text-text-secondary text-sm leading-relaxed uppercase tracking-wider">
                      24/7 COMMAND CENTER ACCESS. REAL PEOPLE. REAL-TIME SOLUTIONS. NO BUREAUCRACY.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative p-2 border border-white/5 bg-base/50 backdrop-blur-sm">
              <img 
                src="https://images.unsplash.com/photo-1555848962-6e79363ec58f?q=80&w=1000&auto=format&fit=crop" 
                alt="Security Team Briefing" 
                className="relative z-10 w-full object-cover aspect-[4/5] opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-0 right-0 p-4 z-20">
                <div className="bg-brand-accent text-white text-[8px] font-black px-2 py-1 tracking-[0.3em] uppercase">
                  LIVE OPS / CALIFORNIA
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Credentials */}
      <section className="py-24 bg-base border-y border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <p className="text-4xl font-black text-brand-accent mb-3 tracking-tighter">24/7</p>
              <p className="text-text-secondary font-bold tracking-[0.2em] uppercase text-[10px]">UPTIME SUPPORT</p>
            </div>
            <div>
              <p className="text-4xl font-black text-brand-accent mb-3 tracking-tighter">100%</p>
              <p className="text-text-secondary font-bold tracking-[0.2em] uppercase text-[10px]">BSIS CERTIFIED</p>
            </div>
            <div>
              <p className="text-4xl font-black text-brand-accent mb-3 tracking-tighter">CA</p>
              <p className="text-text-secondary font-bold tracking-[0.2em] uppercase text-[10px]">STATEWIDE OPS</p>
            </div>
            <div>
              <p className="text-4xl font-black text-brand-accent mb-3 tracking-tighter">&lt;1H</p>
              <p className="text-text-secondary font-bold tracking-[0.2em] uppercase text-[10px]">RESPONSE DELAY</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-base text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Shield className="text-brand-accent mx-auto mb-10" size={32} />
          <h2 className="text-4xl md:text-6xl font-black text-text-primary tracking-tighter mb-8 uppercase">
            SECURE YOUR ASSETS
          </h2>
          <p className="text-text-secondary text-lg mb-12 uppercase tracking-wide leading-relaxed">
            DEPLOY VETERAN-LED PROTECTION INFRASTRUCTURE TODAY.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-3 bg-brand-accent hover:bg-brand-accent-hover text-white px-10 py-5 rounded-sm font-black text-xs tracking-[0.2em] transition-all uppercase shadow-[0_0_20px_rgba(255,98,0,0.2)]"
          >
            REQUEST QUOTE
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

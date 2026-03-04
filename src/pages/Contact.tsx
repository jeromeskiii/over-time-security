import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Send, ShieldAlert } from 'lucide-react';

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-6">Engagement Protocol</h1>
            <h2 className="text-6xl md:text-8xl font-black text-text-primary leading-[0.95] tracking-tighter mb-8 uppercase">
              DEPLOYMENT
            </h2>
            <p className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed max-w-2xl mx-auto border-t border-white/10 pt-8 uppercase tracking-widest">
              INITIALIZE STRATEGIC PARTNERSHIP. RESPONSE GUARANTEED &lt; 60 MIN.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-32 bg-base">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="bg-brand-accent p-10 rounded-sm shadow-[0_0_40px_rgba(255,98,0,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <div className="bg-white/10 text-white text-[8px] font-black px-2 py-1 tracking-[0.3em] uppercase">
                    PRIORITY LINE
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <ShieldAlert size={32} className="text-white" />
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase">COMMAND CENTER</h3>
                </div>
                <p className="text-white/80 text-sm mb-10 font-bold uppercase tracking-widest leading-relaxed relative z-10">
                  CRITICAL INCIDENT RESPONSE & IMMEDIATE DEPLOYMENT AVAILABLE 24/7/365.
                </p>
                <a
                  href="tel:5622431678"
                  className="inline-flex items-center justify-center gap-4 bg-white text-base px-8 py-5 rounded-sm font-black text-xl tracking-[0.1em] w-full transition-all hover:bg-white/90 uppercase"
                >
                  <Phone size={24} />
                  (562) 243-1678
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex gap-4 items-start bg-surface p-6 border border-white/5 rounded-sm">
                  <div className="bg-brand-accent/10 p-2 rounded-sm border border-brand-accent/20 shrink-0 h-fit">
                    <Mail className="text-brand-accent" size={18} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-text-primary mb-2 tracking-[0.2em] uppercase">EMAIL OPS</h4>
                    <a href="mailto:dispatch@overtimesecurity.com" className="text-brand-accent font-bold text-xs hover:text-brand-accent-hover transition-colors uppercase tracking-widest">
                      DISPATCH@OVERTIMESECURITY.COM
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start bg-surface p-6 border border-white/5 rounded-sm">
                  <div className="bg-brand-accent/10 p-2 rounded-sm border border-brand-accent/20 shrink-0 h-fit">
                    <MapPin className="text-brand-accent" size={18} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-text-primary mb-2 tracking-[0.2em] uppercase">LOCATIONS</h4>
                    <p className="text-text-secondary text-xs font-bold uppercase tracking-widest leading-relaxed">LOS ANGELES HQ / CALIFORNIA STATEWIDE</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-surface/50 backdrop-blur-sm p-10 md:p-14 rounded-sm border border-white/5 shadow-2xl relative">
              <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-brand-accent/30 -ml-1 -mt-1"></div>
              <h3 className="text-2xl font-black text-text-primary tracking-tighter mb-4 uppercase">INITIALIZE QUOTE</h3>
              <p className="text-text-secondary text-xs mb-12 uppercase tracking-[0.2em] font-bold">TRANSMIT PROJECT PARAMETERS FOR ANALYSIS.</p>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-brand-accent/10 border border-brand-accent/20 p-12 rounded-sm text-center"
                >
                  <div className="bg-brand-accent text-white p-3 rounded-sm w-fit mx-auto mb-6">
                    <Send size={24} />
                  </div>
                  <h4 className="text-xl font-black text-text-primary mb-4 uppercase tracking-tighter">TRANSMISSION SUCCESSFUL</h4>
                  <p className="text-text-secondary text-xs uppercase tracking-widest leading-relaxed">
                    YOUR REQUEST HAS BEEN RECEIVED BY COMMAND. AN OPERATOR WILL CONTACT YOU WITHIN THE HOUR.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label htmlFor="name" className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">OPERATOR NAME</label>
                      <input
                        type="text"
                        id="name"
                        required
                        className="w-full bg-base border border-white/10 rounded-sm px-4 py-4 text-text-primary placeholder-white/10 focus:outline-none focus:border-brand-accent focus:ring-0 transition-colors text-xs font-bold uppercase tracking-widest"
                        placeholder="FULL NAME"
                      />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="phone" className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">COMMS CHANNEL</label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        className="w-full bg-base border border-white/10 rounded-sm px-4 py-4 text-text-primary placeholder-white/10 focus:outline-none focus:border-brand-accent focus:ring-0 transition-colors text-xs font-bold uppercase tracking-widest"
                        placeholder="PHONE NUMBER"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="email" className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">DATA PORT</label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full bg-base border border-white/10 rounded-sm px-4 py-4 text-text-primary placeholder-white/10 focus:outline-none focus:border-brand-accent focus:ring-0 transition-colors text-xs font-bold uppercase tracking-widest"
                      placeholder="EMAIL ADDRESS"
                    />
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="service" className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">MISSION TYPE</label>
                    <div className="relative">
                      <select
                        id="service"
                        required
                        className="w-full bg-base border border-white/10 rounded-sm px-4 py-4 text-text-primary focus:outline-none focus:border-brand-accent focus:ring-0 transition-colors appearance-none text-xs font-bold uppercase tracking-widest"
                      >
                        <option value="" disabled selected>SELECT MODULE...</option>
                        <option value="armed">ARMED & UNARMED GUARDS</option>
                        <option value="patrol">MOBILE PATROLS</option>
                        <option value="firewatch">FIRE WATCH</option>
                        <option value="event">EVENT SECURITY</option>
                        <option value="executive">EXECUTIVE PROTECTION</option>
                        <option value="custom">SITE-SPECIFIC PLAN</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-white/30"></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="message" className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">MISSION PARAMETERS</label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      className="w-full bg-base border border-white/10 rounded-sm px-4 py-4 text-text-primary placeholder-white/10 focus:outline-none focus:border-brand-accent focus:ring-0 transition-colors resize-none text-xs font-bold uppercase tracking-widest"
                      placeholder="DETAILED PROJECT REQUIREMENTS..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white px-8 py-5 rounded-sm font-black text-xs tracking-[0.3em] transition-all shadow-[0_0_20px_rgba(255,98,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">TRANSMITTING...</span>
                    ) : (
                      <>
                        INITIATE REQUEST <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

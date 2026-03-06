import { motion } from 'motion/react';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { submitLead } from '@/lib/leadsApi';

const RATE_LIMIT_KEY = 'ots_quote_last_submit';
const RATE_LIMIT_MS = 60_000; // 1 submission per 60 seconds

function isRateLimited(): boolean {
  const last = sessionStorage.getItem(RATE_LIMIT_KEY);
  if (!last) return false;
  return Date.now() - parseInt(last, 10) < RATE_LIMIT_MS;
}

function recordSubmission(): void {
  sessionStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
}

export function QuoteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rate-limited'>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isRateLimited()) {
      setSubmitStatus('rate-limited');
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Honeypot: if the hidden website field is filled, silently drop the submission
    if (formData.get('website')) {
      form.reset();
      setSubmitStatus('success'); // bots see "success" so they don't retry
      return;
    }

    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      serviceType: String(formData.get('service') ?? '').trim(),
      location: String(formData.get('location') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
    };

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const result = await submitLead(payload);
      if (!result.ok) {
        throw new Error('Submission rejected by server');
      }

      recordSubmission();
      setSubmitStatus('success');
      form.reset();
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-32 bg-base relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,98,0,0.12),transparent_38%),radial-gradient(circle_at_80%_72%,rgba(255,255,255,0.08),transparent_44%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.08]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(5,7,10,0.88)_100%)]" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
        >
          <div>
            <div className="inline-block px-3 py-1 bg-white/5 border border-white/15 text-brand-accent font-black text-[10px] tracking-[0.3em] uppercase mb-8">
              Transmission: Urgent Action
            </div>
            <h2 className="text-5xl md:text-[72px] font-black text-text-primary tracking-tighter mb-8 leading-[0.9] uppercase">
              Need guards <br />tonight?
            </h2>
            <p className="text-text-secondary text-[16px] font-bold mb-12 max-w-xl uppercase tracking-widest leading-relaxed">
              GET A QUOTE IN UNDER 60 SECONDS. <br />
              OUR COMMAND CENTER IS STANDING BY FOR IMMEDIATE DEPLOYMENT.
            </p>

            <div className="flex items-center gap-6 text-white/40">
              <div className="flex flex-col">
                <span className="text-[8px] font-black tracking-[0.3em] uppercase mb-1">Response</span>
                <span className="text-sm font-bold text-text-primary uppercase tracking-widest">Instant</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black tracking-[0.3em] uppercase mb-1">Uptime</span>
                <span className="text-sm font-bold text-text-primary uppercase tracking-widest">24/7/365</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white/[0.03] backdrop-blur-xl p-8 md:p-12 border border-white/10 rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.55)] relative"
          >
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-accent/40 -ml-1 -mt-1" />

            {submitStatus === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center gap-6 py-12 text-center"
              >
                <CheckCircle size={48} className="text-green-400" strokeWidth={1.5} />
                <div>
                  <p className="text-text-primary font-black text-sm tracking-[0.2em] uppercase mb-2">
                    Transmission Received
                  </p>
                  <p className="text-text-secondary text-[11px] uppercase tracking-widest">
                    Our team will respond within the hour.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em] hover:underline"
                >
                  Submit another request
                </button>
              </motion.div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                {/* Honeypot — hidden from real users, filled only by bots */}
                <input
                  type="text"
                  name="website"
                  id="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="sr-only"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="quote-name" className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
                      Full Name
                    </label>
                    <input
                      id="quote-name"
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      className="w-full bg-base/70 border border-white/10 rounded-sm px-4 py-3 text-text-primary placeholder-white/5 focus:outline-none focus:border-brand-accent focus:ring-0 transition-colors text-xs font-bold uppercase tracking-widest"
                      placeholder="NAME"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="quote-phone" className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
                      Phone
                    </label>
                    <input
                      id="quote-phone"
                      type="tel"
                      name="phone"
                      required
                      autoComplete="tel"
                      className="w-full bg-base/70 border border-white/10 rounded-sm px-4 py-3 text-text-primary placeholder-white/5 focus:outline-none focus:border-brand-accent focus:ring-0 transition-colors text-xs font-bold uppercase tracking-widest"
                      placeholder="CONTACT"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="quote-email" className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
                    Email
                  </label>
                  <input
                    id="quote-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    className="w-full bg-base/70 border border-white/10 rounded-sm px-4 py-3 text-text-primary placeholder-white/5 focus:outline-none focus:border-brand-accent focus:ring-0 transition-colors text-xs font-bold uppercase tracking-widest"
                    placeholder="EMAIL"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="quote-service" className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
                      Service
                    </label>
                    <select
                      id="quote-service"
                      name="service"
                      required
                      className="w-full bg-base/70 border border-white/10 rounded-sm px-4 py-3 text-text-primary focus:outline-none focus:border-brand-accent focus:ring-0 transition-colors text-xs font-bold uppercase tracking-widest appearance-none"
                      defaultValue=""
                    >
                      <option value="" disabled>SELECT...</option>
                      <option value="armed">ARMED SECURITY</option>
                      <option value="patrol">MOBILE PATROL</option>
                      <option value="firewatch">FIRE WATCH</option>
                      <option value="event">EVENT SECURITY</option>
                      <option value="construction">CONSTRUCTION</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="quote-location" className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
                      Location
                    </label>
                    <input
                      id="quote-location"
                      type="text"
                      name="location"
                      required
                      autoComplete="postal-code"
                      className="w-full bg-base/70 border border-white/10 rounded-sm px-4 py-3 text-text-primary placeholder-white/5 focus:outline-none focus:border-brand-accent focus:ring-0 transition-colors text-xs font-bold uppercase tracking-widest"
                      placeholder="CITY / ZIP"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="quote-message" className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
                    Message
                  </label>
                  <textarea
                    id="quote-message"
                    name="message"
                    required
                    rows={3}
                    className="w-full bg-base/70 border border-white/10 rounded-sm px-4 py-3 text-text-primary placeholder-white/5 focus:outline-none focus:border-brand-accent focus:ring-0 transition-colors text-xs font-bold uppercase tracking-widest resize-none"
                    placeholder="MISSION DETAILS..."
                  />
                </div>

                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle size={14} strokeWidth={2} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                      Transmission failed. Please try again.
                    </p>
                  </div>
                )}

                {submitStatus === 'rate-limited' && (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <AlertTriangle size={14} strokeWidth={2} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                      Please wait 60 seconds before resubmitting.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-accent hover:bg-brand-accent-hover disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-4 rounded-sm font-black text-xs tracking-[0.3em] transition-all shadow-[0_0_20px_rgba(255,98,0,0.2)] uppercase flex items-center justify-center gap-3"
                >
                  {isSubmitting ? 'TRANSMITTING...' : 'INITIALIZE QUOTE'} <Send size={16} />
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

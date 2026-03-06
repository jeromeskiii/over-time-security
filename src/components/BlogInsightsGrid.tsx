import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Newspaper } from 'lucide-react';

const insights = [
  {
    id: 'fire-watch-california',
    title: 'How Fire Watch Works in California',
    category: 'Compliance',
    image: '/images/hero-night.webp',
  },
  {
    id: 'secure-construction-site',
    title: 'How to Secure a Construction Site',
    category: 'Construction Security',
    image: '/images/construction-guard.webp',
  },
  {
    id: 'event-security-planning-guide',
    title: 'Event Security Planning Guide',
    category: 'Event Security',
    image: '/images/event-concert.webp',
  },
  {
    id: 'retail-theft-prevention',
    title: 'Retail Theft Prevention Strategies',
    category: 'Retail Security',
    image: '/images/event-2.webp',
  },
  {
    id: 'healthcare-security-checklist',
    title: 'Healthcare Facility Security Checklist',
    category: 'Healthcare Security',
    image: '/images/healthcare-offices.webp',
  },
  {
    id: 'corporate-access-control',
    title: 'Corporate Access Control Best Practices',
    category: 'Corporate Security',
    image: '/images/corporate-offices.webp',
  },
];

export function BlogInsightsGrid() {
  return (
    <section id="blog" className="py-32 bg-base">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <Newspaper size={14} className="text-brand-accent" strokeWidth={2} />
            <span className="text-brand-accent font-bold tracking-[0.3em] uppercase text-[10px]">
              Insights
            </span>
          </div>
          <h2 className="text-[36px] md:text-[48px] font-black text-text-primary leading-[0.95] tracking-tighter uppercase">
            Security Insights<br />
            <span className="text-brand-accent">For Smarter Coverage</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {insights.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-surface border border-white/5 hover:border-brand-accent/40 transition-all duration-500 rounded-sm overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </div>

              <div className="p-6">
                <p className="text-brand-accent font-bold tracking-[0.2em] uppercase text-[10px] mb-4">
                  {post.category}
                </p>
                <h3 className="text-text-primary font-black text-[20px] leading-tight tracking-tight uppercase">
                  {post.title}
                </h3>
                <Link
                  to={`/contact?briefing=${post.id}`}
                  className="mt-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent transition-transform group-hover:translate-x-1"
                >
                  Request this briefing
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

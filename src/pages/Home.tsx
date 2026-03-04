import { Hero } from '@/components/Hero';
import { TrustBar } from '@/components/TrustBar';
import { ServicesGrid } from '@/components/ServicesGrid';
import { FeatureSection } from '@/components/FeatureSection';
import { IndustryGrid } from '@/components/IndustryGrid';
import { BlogInsightsGrid } from '@/components/BlogInsightsGrid';
import { OperationalIntelligence } from '@/components/OperationalIntelligence';
import { Testimonials } from '@/components/Testimonials';
import { QuoteForm } from '@/components/QuoteForm';
import { FinalCTA } from '@/components/FinalCTA';

export function Home() {
  return (
    <div className="relative flex flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_12%_18%,rgba(255,98,0,0.08),transparent_35%),radial-gradient(circle_at_88%_78%,rgba(255,255,255,0.04),transparent_42%)]"
      />
      <Hero />
      <TrustBar />
      <ServicesGrid />
      <FeatureSection />
      <IndustryGrid />
      <BlogInsightsGrid />
      <OperationalIntelligence />
      <Testimonials />
      <QuoteForm />
      <FinalCTA />
    </div>
  );
}

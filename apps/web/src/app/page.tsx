import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { ServicesGrid } from "@/components/ServicesGrid";
import { FeatureSection } from "@/components/FeatureSection";
import { Testimonials } from "@/components/Testimonials";
import { FinalCTA } from "@/components/FinalCTA";

export default function HomePage() {
  return (
    <main className="relative">
      <Hero />
      <TrustBar />
      <ServicesGrid />
      <FeatureSection />
      <Testimonials />
      <FinalCTA />
    </main>
  );
}

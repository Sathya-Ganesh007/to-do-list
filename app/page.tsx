import { NavbarSection } from "@/components/Home/navbar-section";
import { HeroSection } from "@/components/Home/hero-section";
import { FeaturesSection } from "@/components/Home/features-section";
import { TestimonialsSection } from "@/components/Home/testimonials-section";
import { Pricing } from "@/components/Home/pricing";
import { CTA } from "@/components/Home/cta";
import { Footer } from "@/components/Home/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarSection />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

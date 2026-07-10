import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import StatsSection from "./components/StatsSection";
import FeaturesSection from "./components/FeaturesSection";
import PortfolioSection from "./components/PortfolioSection";
import TestimonialsSection from "./components/TestimonialsSection";
import TeamSection from "./components/TeamSection";
import FAQSection from "./components/FAQSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import FloatingCTA from "./components/FloatingCTA";
import FloatingBookCTA from "./components/FloatingBookCTA";
import LogoMarquee from "./components/LogoMarquee";
import SocialProofTicker from "./components/SocialProofTicker";
import TechBadgesMarquee from "./components/TechBadgesMarquee";
import Section3DReveal from "@/components/feature/Section3DReveal";

export default function Home() {
  const location = useLocation();

  // Handle scroll-to-section when navigated from another page
  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const scrollToId = state.scrollTo;
      const attempt = () => {
        const el = document.getElementById(scrollToId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      };
      const timer = setTimeout(attempt, 200);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div className="bg-dc-bg min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <SocialProofTicker />
        <LogoMarquee />

        <Section3DReveal>
          <ServicesSection />
        </Section3DReveal>

        <Section3DReveal>
          <StatsSection />
        </Section3DReveal>

        <Section3DReveal>
          <FeaturesSection />
        </Section3DReveal>

        <Section3DReveal>
          <PortfolioSection />
        </Section3DReveal>

        <TechBadgesMarquee />

        <Section3DReveal>
          <TestimonialsSection />
        </Section3DReveal>

        <Section3DReveal>
          <TeamSection />
        </Section3DReveal>

        <Section3DReveal>
          <FAQSection />
        </Section3DReveal>

        <Section3DReveal>
          <ContactSection />
        </Section3DReveal>
      </main>
      <Footer />
      <FloatingCTA />
      <FloatingBookCTA />
    </div>
  );
}
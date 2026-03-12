import { useEffect } from "react";
import HeroSection from "../components/home/HeroSection";
import TrustSection from "../components/home/TrustSection";
import ValueProposition from "../components/home/ValueProposition";
import FeaturesOverview from "../components/home/FeaturesOverview";
import UserJourneySection from "../components/home/UserJourneySection";
import TestimonialsCarousel from "../components/home/TestimonialsCarousel";
import PricingPreview from "../components/home/PricingPreview";
import HomeCTA from "../components/home/HomeCTA";

export default function HomePage() {
  useEffect(() => {
    document.title = "EaseUp HRMS — Modern HR Platform for Attendance, Payroll & Invoicing";
  }, []);

  return (
    <>
      <HeroSection />
      <TrustSection />
      <ValueProposition />
      <FeaturesOverview />

      <UserJourneySection />

      <TestimonialsCarousel />
      <PricingPreview />
      <HomeCTA />
    </>
  );
}

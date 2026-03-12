import { useEffect } from "react";
import HeroSection from "../components/home/HeroSection";
import TrustSection from "../components/home/TrustSection";
import ValueProposition from "../components/home/ValueProposition";
import FeaturesOverview from "../components/home/FeaturesOverview";
import TestimonialsCarousel from "../components/home/TestimonialsCarousel";
import PricingPreview from "../components/home/PricingPreview";
import HomeCTA from "../components/home/HomeCTA";
import SectionHeader from "../components/shared/SectionHeader";
import DashboardPreview from "../components/mockups/DashboardPreview";
import AnimatedSection from "../components/shared/AnimatedSection";

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

      {/* Mid-page Payroll Preview */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <DashboardPreview variant="payroll" height={400} />
            </AnimatedSection>
            <AnimatedSection direction="right" delay={0.1}>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100 mb-4">
                Payroll Automation
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-5">
                Payroll in Minutes,{" "}
                <span className="text-gradient-brand">Not Days</span>
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                EaseUp automates your entire payroll cycle — from attendance data to salary disbursement.
                Auto-compute PF, ESI, and TDS. Generate payslips instantly. Stay compliant without the complexity.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Auto-sync attendance to payroll",
                  "Statutory deductions: PF, ESI, TDS",
                  "Instant payslip generation & distribution",
                  "Direct bank transfer integration",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                      <span className="text-indigo-600 text-[10px] font-bold">✓</span>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <TestimonialsCarousel />
      <PricingPreview />
      <HomeCTA />
    </>
  );
}

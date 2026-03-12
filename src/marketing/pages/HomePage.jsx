import { useEffect } from "react";
import HeroSection from "../components/home/HeroSection";
import TrustSection from "../components/home/TrustSection";
import ValueProposition from "../components/home/ValueProposition";
import FeaturesOverview from "../components/home/FeaturesOverview";
import TestimonialsCarousel from "../components/home/TestimonialsCarousel";
import PricingPreview from "../components/home/PricingPreview";
import HomeCTA from "../components/home/HomeCTA";
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

      {/* Payroll deep-dive */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <DashboardPreview variant="payroll" height={400} />
            </AnimatedSection>
            <AnimatedSection direction="right" delay={0.1}>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-4">
                Payroll
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight mb-5">
                The whole cycle — done<br className="hidden sm:block" /> before lunch on the 1st.
              </h2>
              <p className="text-slate-500 text-base leading-relaxed mb-8">
                Attendance data flows straight into payroll. PF, ESI, and TDS are computed without
                anyone touching a spreadsheet. Payslips go out the same afternoon.
              </p>
              <div className="space-y-5">
                {[
                  { label: "Statutory compliance", detail: "PF, ESI, TDS — auto-calculated every run" },
                  { label: "Direct bank transfers", detail: "Salaries credited same day as payroll approval" },
                  { label: "Payslip distribution", detail: "Emailed to employees instantly, no manual work" },
                ].map(({ label, detail }) => (
                  <div key={label} className="flex gap-4">
                    <div className="w-0.5 bg-indigo-200 rounded-full shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{label}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
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

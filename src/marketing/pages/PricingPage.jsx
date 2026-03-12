import { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";
import SectionHeader from "../components/shared/SectionHeader";
import PricingToggle from "../components/pricing/PricingToggle";
import PricingCard from "../components/pricing/PricingCard";
import ComparisonTable from "../components/pricing/ComparisonTable";
import HomeCTA from "../components/home/HomeCTA";
import { StaggerContainer, StaggerItem } from "../components/shared/AnimatedSection";

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    desc: "For small teams exploring HRMS",
    features: [
      { label: "Up to 10 employees", included: true },
      { label: "Basic attendance tracking", included: true },
      { label: "Payslip generation", included: true },
      { label: "Leave management", included: true },
      { label: "HR reports (basic)", included: true },
      { label: "Email support", included: true },
      { label: "Payroll automation", included: false },
      { label: "Invoicing", included: false },
      { label: "API access", included: false },
    ],
    cta: "Get Started Free",
    ctaHref: "/app/login",
  },
  {
    name: "Starter",
    monthlyPrice: 1499,
    annualPrice: 1199,
    desc: "Everything growing businesses need",
    features: [
      { label: "Up to 50 employees", included: true },
      { label: "Full attendance + GPS", included: true },
      { label: "Full payroll automation", included: true },
      { label: "Statutory compliance (PF/ESI/TDS)", included: true },
      { label: "Invoicing & GST compliance", included: true },
      { label: "HR analytics dashboard", included: true },
      { label: "Employee self-service portal", included: true },
      { label: "Priority email & chat support", included: true },
      { label: "API access", included: false },
    ],
    cta: "Start 14-Day Free Trial",
    ctaHref: "/app/login",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    annualPrice: null,
    desc: "Custom solution for large organizations",
    features: [
      { label: "Unlimited employees", included: true },
      { label: "All Starter features", included: true },
      { label: "Advanced AI analytics", included: true },
      { label: "Custom integrations & API", included: true },
      { label: "Dedicated account manager", included: true },
      { label: "On-premise deployment option", included: true },
      { label: "Custom SLA (99.9% uptime)", included: true },
      { label: "Security audit & compliance", included: true },
      { label: "24/7 phone support", included: true },
    ],
    cta: "Contact Sales",
    ctaHref: "/contact",
  },
];

const faqs = [
  { q: "Can I upgrade or downgrade anytime?", a: "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades apply at your next billing cycle." },
  { q: "Is there a setup fee?", a: "No setup fees ever. You only pay the monthly or annual subscription cost." },
  { q: "What payment methods do you accept?", a: "We accept UPI, credit/debit cards, NEFT/RTGS, and invoiced payments for Enterprise plans." },
  { q: "How is the employee count calculated?", a: "We count active employees on your account. Inactive or archived employees don't count toward your limit." },
  { q: "Do you offer a nonprofit or startup discount?", a: "Yes! We offer special pricing for nonprofits and early-stage startups. Contact our sales team to learn more." },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    document.title = "Pricing — EaseUp HRMS";
  }, []);

  return (
    <>
      <section className="pt-32 pb-16 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            eyebrow="Transparent Pricing"
            heading={
              <>
                Simple Plans,{" "}
                <span className="text-gradient-brand">No Surprises</span>
              </>
            }
            subtext="Start free, scale with your team. Every plan includes a 14-day free trial."
            className="mb-4"
          />
          <PricingToggle isAnnual={isAnnual} onChange={setIsAnnual} />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => (
              <StaggerItem key={plan.name}>
                <PricingCard plan={plan} isAnnual={isAnnual} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ComparisonTable />

          {/* FAQ */}
          <div className="mt-20">
            <h3 className="text-xl font-bold text-slate-900 text-center mb-8 flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              Pricing FAQs
            </h3>
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {faqs.map((faq) => (
                <div key={faq.q} className="p-5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-sm font-semibold text-slate-900 mb-2">{faq.q}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HomeCTA />
    </>
  );
}

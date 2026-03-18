import { useEffect, useState } from "react";
import { Check, HelpCircle, Users, Sparkles, TrendingUp, Receipt, Code2, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionHeader from "../components/shared/SectionHeader";
import PricingToggle from "../components/pricing/PricingToggle";
import PricingCard from "../components/pricing/PricingCard";
import ComparisonTable from "../components/pricing/ComparisonTable";
import HomeCTA from "../components/home/HomeCTA";
import AnimatedSection, { StaggerContainer, StaggerItem } from "../components/shared/AnimatedSection";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 2499,
    annualPrice: 1999,
    annualTotal: 23990,
    employees: "Up to 50 employees",
    desc: "Core HR tools for growing teams",
    features: [
      { label: "Core HR platform", included: true },
      { label: "Employee management", included: true },
      { label: "Employee onboarding", included: true },
      { label: "Document management", included: true },
      { label: "Leave management", included: true },
      { label: "Employee self-service portal", included: true },
      { label: "HR reports", included: true },
      { label: "Company settings", included: true },
      { label: "Email support", included: true },
    ],
    cta: "Start Free Trial",
    ctaHref: "https://one.inkapps.io/signup",
  },
  {
    name: "Growth",
    monthlyPrice: 3999,
    annualPrice: 3199,
    annualTotal: 38390,
    employees: "Up to 50 employees",
    desc: "Full HR suite with payroll & attendance",
    features: [
      { label: "Everything in Starter", included: true },
      { label: "Payroll management", included: true },
      { label: "Salary processing & payslips", included: true },
      { label: "Attendance tracking", included: true },
      { label: "Shift management", included: true },
      { label: "Compliance support (PF/ESI/TDS)", included: true },
      { label: "Advanced HR analytics", included: true },
      { label: "Role-based access control", included: true },
      { label: "HR lifecycle management", included: true },
    ],
    cta: "Start Free Trial",
    ctaHref: "https://one.inkapps.io/signup",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    monthlyPrice: 6499,
    annualPrice: 5199,
    annualTotal: 62390,
    employees: "50+ employees",
    desc: "Advanced HR for large organizations",
    features: [
      { label: "Everything in Growth", included: true },
      { label: "Multi-location management", included: true },
      { label: "Advanced workflow automation", included: true },
      { label: "Custom HR reports", included: true },
      { label: "API integrations", included: true },
      { label: "Priority support", included: true },
      { label: "Advanced security controls", included: true },
      { label: "Enterprise-level scalability", included: true },
    ],
    cta: "Contact Sales",
    ctaHref: "/contact",
  },
];

const addons = [
  {
    name: "AI Hiring / ATS",
    price: "₹1,500 – ₹3,000",
    period: "/month",
    icon: Sparkles,
    bgClass: "bg-purple-50",
    borderClass: "border-purple-100",
    textClass: "text-purple-600",
    iconBg: "bg-white",
    features: ["AI resume screening", "Candidate scoring", "Recruitment pipeline", "Job posting management"],
  },
  {
    name: "Performance Management",
    price: "₹20",
    period: "/employee/month",
    icon: TrendingUp,
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-100",
    textClass: "text-emerald-600",
    iconBg: "bg-white",
    features: ["Goal setting & OKRs", "360° feedback", "Performance reviews", "Skills tracking"],
  },
  {
    name: "Expense Management",
    price: "₹15",
    period: "/employee/month",
    icon: Receipt,
    bgClass: "bg-orange-50",
    borderClass: "border-orange-100",
    textClass: "text-orange-600",
    iconBg: "bg-white",
    features: ["Expense submission", "Approval workflows", "Policy compliance", "Reports & analytics"],
  },
  {
    name: "API Access & Integrations",
    price: "₹25",
    period: "/employee/month",
    icon: Code2,
    bgClass: "bg-blue-50",
    borderClass: "border-blue-100",
    textClass: "text-blue-600",
    iconBg: "bg-white",
    features: ["REST API access", "Webhook support", "Third-party integrations", "Custom connectors"],
  },
];

const faqs = [
  { q: "Can I upgrade or downgrade anytime?", a: "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades apply at your next billing cycle." },
  { q: "Is there a setup fee?", a: "No setup fees ever. You only pay the monthly or annual subscription cost." },
  { q: "What payment methods do you accept?", a: "We accept UPI, credit/debit cards, NEFT/RTGS, and invoiced payments for Enterprise plans." },
  { q: "How is the employee count calculated?", a: "We count active employees on your account. Additional employees beyond 50 are charged at ₹30/employee/month. Inactive or archived employees don't count." },
  { q: "Do you offer a nonprofit or startup discount?", a: "Yes! We offer special pricing for nonprofits and early-stage startups. Contact our sales team to learn more." },
  { q: "Can I add modules to any plan?", a: "Yes! Add-on modules like AI Hiring, Performance Management, and Expense Management can be added to any plan at any time." },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    document.title = "Pricing — EaseUpCEOs";
  }, []);

  return (
    <>
      {/* Hero */}
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
            subtext="Start with what you need. Scale as your team grows. All plans include a 14-day free trial."
            className="mb-4"
          />
          <PricingToggle isAnnual={isAnnual} onChange={setIsAnnual} />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Pricing Cards */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => (
              <StaggerItem key={plan.name}>
                <PricingCard plan={plan} isAnnual={isAnnual} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Additional employees banner */}
          <AnimatedSection className="mt-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-lg mx-auto justify-center text-center sm:text-left">
              <Users className="w-4 h-4 text-slate-500 shrink-0" />
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">Need more than 50 employees?</span>{" "}
                Add ₹30 per employee / month to any plan.
              </p>
            </div>
          </AnimatedSection>

          {/* Example Calculation */}
          <AnimatedSection className="mt-10">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 border border-blue-100 p-6 sm:p-8 max-w-2xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Calculator className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">Pricing Example</h4>
                  <p className="text-xs text-slate-500 mb-3">Company with 40 employees on Growth Plan</p>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-2xl font-bold text-blue-600">₹3,999</span>
                    <span className="text-sm text-slate-500">/month — all 40 employees included</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    No additional charges (40 &lt; 50 included seats)
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-blue-100">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
                      Competitively priced
                    </span>
                    <p className="text-xs text-slate-500">
                      vs greytHR ~₹3,495/month — with modular add-ons & AI hiring
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Add-Ons Section */}
          <AnimatedSection className="mt-20">
            <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest rounded-full border border-indigo-100 mb-3">
                Optional Add-Ons
              </span>
              <h3 className="text-2xl font-bold text-slate-900">Extend Your Platform</h3>
              <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
                Powerful modules you can add to any plan. Pay only for what your team actually needs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {addons.map((addon) => {
                const Icon = addon.icon;
                return (
                  <div
                    key={addon.name}
                    className={cn(
                      "rounded-2xl p-5 border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
                      addon.bgClass,
                      addon.borderClass
                    )}
                  >
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-4 shadow-sm", addon.iconBg)}>
                      <Icon className={cn("w-4 h-4", addon.textClass)} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{addon.name}</h4>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className={cn("text-lg font-bold", addon.textClass)}>{addon.price}</span>
                      <span className="text-xs text-slate-500">{addon.period}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {addon.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                          <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                            <Check className="w-2 h-2 text-slate-500" />
                          </div>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </AnimatedSection>

          {/* Feature Comparison Table */}
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

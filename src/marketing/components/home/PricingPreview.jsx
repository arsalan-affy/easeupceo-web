import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeader from "../shared/SectionHeader";
import CTAButton from "../shared/CTAButton";
import { StaggerContainer, StaggerItem } from "../shared/AnimatedSection";

const plans = [
  {
    name: "Starter",
    price: "₹2,499",
    period: "per month",
    desc: "Core HR for teams up to 50",
    features: ["Employee management", "Leave management", "Document management", "Self-service portal", "Email support"],
    cta: "Start Free Trial",
    href: "https://one.inkapps.io/signup",
    variant: "secondary",
  },
  {
    name: "Growth",
    price: "₹3,999",
    period: "per month",
    desc: "Full HR suite with payroll & attendance",
    features: ["Everything in Starter", "Payroll & payslips", "Attendance tracking", "Compliance (PF/ESI/TDS)", "Advanced analytics"],
    cta: "Start Free Trial",
    href: "https://one.inkapps.io/signup",
    variant: "primary",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "₹6,499",
    period: "per month",
    desc: "Advanced HR for large organizations",
    features: ["Everything in Growth", "Multi-location support", "API integrations", "Custom reports", "Priority support"],
    cta: "Contact Sales",
    href: "/contact",
    variant: "dark",
  },
];

export default function PricingPreview() {
  return (
    <section className="py-24 gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Simple Pricing"
          heading={
            <>
              Plans That Grow{" "}
              <span className="text-gradient-brand">With Your Team</span>
            </>
          }
          subtext="Start with what you need. Scale as your team grows. Save 20% with annual billing."
        />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <div className={`relative h-full rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted
                  ? "gradient-brand text-white shadow-2xl shadow-blue-500/25 scale-105"
                  : "bg-white border border-slate-200 hover:shadow-lg"
              }`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full shadow-sm">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="mb-5">
                  <h3 className={`text-sm font-semibold uppercase tracking-wide mb-2 ${plan.highlighted ? "text-blue-100" : "text-slate-500"}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-end gap-1 mb-2">
                    <span className={`text-3xl font-bold ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm mb-1 ${plan.highlighted ? "text-blue-100" : "text-slate-500"}`}>
                      /{plan.period}
                    </span>
                  </div>
                  <p className={`text-sm ${plan.highlighted ? "text-blue-100" : "text-slate-500"}`}>{plan.desc}</p>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        plan.highlighted ? "bg-white/20" : "bg-blue-50"
                      }`}>
                        <Check className={`w-2.5 h-2.5 ${plan.highlighted ? "text-white" : "text-blue-600"}`} />
                      </div>
                      <span className={plan.highlighted ? "text-blue-50" : "text-slate-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <CTAButton href={plan.href} external={plan.href?.startsWith("http")} variant={plan.highlighted ? "outline" : plan.variant} size="md" className="w-full justify-center">
                  {plan.cta}
                </CTAButton>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="text-center mt-10">
          <Link to="/pricing" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
            Compare all plans <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

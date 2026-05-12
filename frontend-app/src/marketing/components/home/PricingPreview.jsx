import { Check, ArrowRight, CreditCard, Clock, CalendarDays, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeader from "../shared/SectionHeader";
import CTAButton from "../shared/CTAButton";
import { StaggerContainer, StaggerItem } from "../shared/AnimatedSection";

const BASE_FEATURES = ["Employees & Contacts", "Items & Inventory", "Sales & Purchases", "Accounting & Finance", "Reports & Settings"];

const addons = [
  { icon: CreditCard, label: "Payroll", price: "₹35", unit: "/emp/mo", color: "text-indigo-600", bg: "bg-indigo-50" },
  { icon: Clock, label: "Attendance", price: "₹18", unit: "/emp/mo", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: CalendarDays, label: "Leave", price: "₹12", unit: "/emp/mo", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: ShoppingCart, label: "Restaurant", price: "₹399", unit: "/mo", color: "text-orange-600", bg: "bg-orange-50" },
];

export default function PricingPreview() {
  return (
    <section className="py-24 gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Simple Pricing"
          heading={
            <>
              One Plan,{" "}
              <span className="text-gradient-brand">Add What You Need</span>
            </>
          }
          subtext="Start at ₹999/month with core business tools. Add modules as your team grows. 30-day free trial."
        />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Base Plan */}
          <StaggerItem>
            <div className="relative h-full rounded-2xl p-6 flex flex-col gradient-brand text-white shadow-2xl shadow-blue-500/25">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full shadow-sm">
                  Always Included
                </span>
              </div>
              <div className="mb-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide mb-2 text-blue-100">
                  Base Plan
                </h3>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl font-bold text-white">₹999</span>
                  <span className="text-sm mb-1 text-blue-100">/month</span>
                </div>
                <p className="text-sm text-blue-100">Core business management tools</p>
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {BASE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 bg-white/20">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-blue-50">{f}</span>
                  </li>
                ))}
              </ul>
              <CTAButton href="https://app.worklynx.io/signup" external variant="outline" size="md" className="w-full justify-center">
                Start 30-Day Free Trial
              </CTAButton>
            </div>
          </StaggerItem>

          {/* Add-ons */}
          <StaggerItem>
            <div className="h-full rounded-2xl p-6 flex flex-col bg-white border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="mb-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide mb-2 text-slate-500">
                  Optional Add-Ons
                </h3>
                <p className="text-lg font-bold text-slate-900 mb-1">Pay only for what you use</p>
                <p className="text-sm text-slate-500">Enable or disable modules anytime</p>
              </div>
              <div className="space-y-3 flex-1 mb-6">
                {addons.map((addon) => (
                  <div key={addon.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${addon.bg} flex items-center justify-center`}>
                        <addon.icon className={`w-4 h-4 ${addon.color}`} />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{addon.label}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${addon.color}`}>{addon.price}</span>
                      <span className="text-xs text-slate-400">{addon.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
              <CTAButton href="/pricing" variant="secondary" size="md" className="w-full justify-center">
                See Pricing Calculator
              </CTAButton>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <div className="text-center mt-10">
          <Link to="/pricing" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
            View full pricing details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

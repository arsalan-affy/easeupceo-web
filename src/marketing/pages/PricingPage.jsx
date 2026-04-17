import { useEffect, useState } from "react";
import { Check, HelpCircle, Users, CreditCard, Clock, CalendarDays, ShoppingCart, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionHeader from "../components/shared/SectionHeader";
import ComparisonTable from "../components/pricing/ComparisonTable";
import HomeCTA from "../components/home/HomeCTA";
import AnimatedSection, { StaggerContainer, StaggerItem } from "../components/shared/AnimatedSection";

const PRICING = {
  base: 999,
  payroll_per_emp: 35,
  attendance_per_emp: 18,
  leave_per_emp: 12,
  restaurant: 399,
};

const BASE_FEATURES = [
  "Employees & Contacts",
  "Items & Inventory",
  "Sales & Purchases",
  "Accounting & Finance",
  "Reports & Settings",
];

const addons = [
  {
    key: "payroll",
    name: "Payroll",
    price: `₹${PRICING.payroll_per_emp}`,
    period: "/employee/month",
    icon: CreditCard,
    bgClass: "bg-indigo-50",
    borderClass: "border-indigo-100",
    textClass: "text-indigo-600",
    iconBg: "bg-white",
    features: ["Salary processing", "Payslip generation", "Statutory compliance", "Multiple salary components"],
  },
  {
    key: "attendance",
    name: "Attendance",
    price: `₹${PRICING.attendance_per_emp}`,
    period: "/employee/month",
    icon: Clock,
    bgClass: "bg-blue-50",
    borderClass: "border-blue-100",
    textClass: "text-blue-600",
    iconBg: "bg-white",
    features: ["Punch records", "Shift management", "Daily & monthly tracking", "Overtime calculation"],
  },
  {
    key: "leave",
    name: "Leave Management",
    price: `₹${PRICING.leave_per_emp}`,
    period: "/employee/month",
    icon: CalendarDays,
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-100",
    textClass: "text-emerald-600",
    iconBg: "bg-white",
    features: ["Leave categories", "Request & approval workflows", "Balance tracking", "Leave policies"],
  },
  {
    key: "restaurant",
    name: "Restaurant Management",
    price: `₹${PRICING.restaurant}`,
    period: "/month (flat)",
    icon: ShoppingCart,
    bgClass: "bg-orange-50",
    borderClass: "border-orange-100",
    textClass: "text-orange-600",
    iconBg: "bg-white",
    features: ["Point of Sale (POS)", "Table & area management", "Reservations", "Kitchen display (KOT)"],
  },
];

const faqs = [
  { q: "What's included in the Base Plan?", a: "The Base Plan at ₹999/month includes Employees & Contacts, Items & Inventory, Sales & Purchases, Accounting & Finance, and Reports & Settings — everything you need to run your business." },
  { q: "How does per-employee pricing work?", a: "Add-on modules like Payroll, Attendance, and Leave Management are priced per active employee per month. You only pay for the modules and employees you actually use." },
  { q: "Can I add or remove modules anytime?", a: "Yes! You can enable or disable any add-on module at any time from your subscription settings. Changes take effect immediately." },
  { q: "Is there a setup fee?", a: "No setup fees ever. You only pay the base plan and any add-on modules you choose." },
  { q: "What payment methods do you accept?", a: "We accept UPI, credit/debit cards, NEFT/RTGS, and invoiced payments." },
  { q: "How long is the free trial?", a: "You get a full 30-day free trial with access to all features. No credit card required to start." },
];

export default function PricingPage() {
  const [employeeCount, setEmployeeCount] = useState(10);
  const [selectedModules, setSelectedModules] = useState({
    payroll: true,
    attendance: true,
    leave: false,
    restaurant: false,
  });

  useEffect(() => {
    document.title = "Pricing — Worklynx";
  }, []);

  const monthlyTotal = (() => {
    let total = PRICING.base;
    if (selectedModules.payroll) total += employeeCount * PRICING.payroll_per_emp;
    if (selectedModules.attendance) total += employeeCount * PRICING.attendance_per_emp;
    if (selectedModules.leave) total += employeeCount * PRICING.leave_per_emp;
    if (selectedModules.restaurant) total += PRICING.restaurant;
    return total;
  })();

  const toggleModule = (key) => {
    setSelectedModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            eyebrow="Transparent Pricing"
            heading={
              <>
                One Base Plan,{" "}
                <span className="text-gradient-brand">Pay for What You Need</span>
              </>
            }
            subtext="Start at just ₹999/month with everything you need to manage your business. Add modules as you grow. 30-day free trial included."
            className="mb-4"
          />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Base Plan Card */}
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-2xl gradient-brand text-white shadow-2xl shadow-blue-500/30 p-8 sm:p-10 max-w-3xl mx-auto mb-16">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="flex items-center gap-1 px-4 py-1.5 bg-amber-400 text-amber-900 text-xs font-bold rounded-full shadow">
                  Always Included
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-100 mb-3">Base Plan</h3>
                <div className="flex items-end justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold text-white">₹999</span>
                  <span className="text-lg mb-2 text-blue-100">/month</span>
                </div>
                <p className="text-blue-100 text-sm">Everything you need to run your business</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {BASE_FEATURES.map((f) => (
                  <div key={f} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 border border-white/20">
                    <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-sm text-blue-50 font-medium">{f}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <a
                  href="https://app.worklynx.io/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Start 30-Day Free Trial
                </a>
              </div>
            </div>
          </AnimatedSection>

          {/* Add-Ons Section */}
          <AnimatedSection>
            <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest rounded-full border border-indigo-100 mb-3">
                Optional Add-Ons
              </span>
              <h3 className="text-2xl font-bold text-slate-900">Extend Your Platform</h3>
              <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
                Powerful modules you can add anytime. Pay only for what your team actually needs.
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

          {/* Interactive Pricing Calculator */}
          <AnimatedSection className="mt-16">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 border border-blue-100 p-6 sm:p-8 max-w-2xl mx-auto">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Calculator className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800">Pricing Calculator</h4>
                  <p className="text-xs text-slate-500">See exactly what you'll pay — no surprises</p>
                </div>
              </div>

              {/* Employee Count */}
              <div className="mb-5">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  Number of Employees
                </label>
                <input
                  type="range"
                  min="1"
                  max="200"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1</span>
                  <span className="text-sm font-bold text-blue-600">{employeeCount} employees</span>
                  <span>200</span>
                </div>
              </div>

              {/* Module toggles */}
              <div className="space-y-2 mb-6">
                {addons.map((addon) => (
                  <label
                    key={addon.key}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
                      selectedModules[addon.key]
                        ? "bg-white border-blue-200 shadow-sm"
                        : "bg-white/50 border-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedModules[addon.key]}
                        onChange={() => toggleModule(addon.key)}
                        className="w-4 h-4 rounded accent-blue-600"
                      />
                      <span className="text-sm font-medium text-slate-700">{addon.name}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {addon.key === "restaurant"
                        ? `₹${PRICING.restaurant}/mo`
                        : `₹${PRICING[`${addon.key}_per_emp`]} × ${employeeCount} = ₹${(PRICING[`${addon.key}_per_emp`] * employeeCount).toLocaleString("en-IN")}`}
                    </span>
                  </label>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-blue-200 shadow-sm">
                <div>
                  <p className="text-xs text-slate-500">Estimated Monthly Total</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-blue-600">₹{monthlyTotal.toLocaleString("en-IN")}</span>
                    <span className="text-sm text-slate-500">/month</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Base: ₹{PRICING.base.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-slate-400">Add-ons: ₹{(monthlyTotal - PRICING.base).toLocaleString("en-IN")}</p>
                </div>
              </div>
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

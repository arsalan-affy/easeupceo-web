import { useEffect } from "react";
import { UserPlus, Package, FileText, BarChart3, Settings } from "lucide-react";
import SectionHeader from "../components/shared/SectionHeader";
import WorkflowStep from "../components/how-it-works/WorkflowStep";
import DashboardPreview from "../components/mockups/DashboardPreview";
import AnimatedSection from "../components/shared/AnimatedSection";
import HomeCTA from "../components/home/HomeCTA";
import { StaggerContainer, StaggerItem } from "../components/shared/AnimatedSection";

const steps = [
  {
    step: 1,
    icon: Settings,
    title: "Set Up Your Business",
    description:
      "Sign up in minutes. Your organization is created with a pre-configured chart of accounts, tax setup, and sample data so you can explore right away.",
  },
  {
    step: 2,
    icon: Package,
    title: "Add Your Items & Contacts",
    description:
      "Set up your product catalog with categories, pricing, and stock tracking. Add your customers and suppliers with payment terms and contact details.",
  },
  {
    step: 3,
    icon: FileText,
    title: "Start Selling & Purchasing",
    description:
      "Create quotations, convert to sales orders, generate invoices, and track payments. Manage purchase orders and bills in the same place. Inventory updates automatically.",
  },
  {
    step: 4,
    icon: BarChart3,
    title: "Track Your Finances",
    description:
      "Your accounting updates automatically with every transaction. Review financial reports, reconcile bank statements, and stay on top of your tax obligations.",
  },
  {
    step: 5,
    icon: UserPlus,
    title: "Add Modules as You Grow",
    description:
      "Need payroll? Attendance tracking? Restaurant POS? Add optional modules anytime from your settings — pay only for what you use.",
  },
];

const benefits = [
  { number: "5 min", label: "Average setup time" },
  { number: "30 days", label: "Free trial included" },
  { number: "₹999", label: "Starting monthly price" },
  { number: "99.9%", label: "Uptime SLA" },
];

export default function HowItWorksPage() {
  useEffect(() => {
    document.title = "How It Works — Worklynx";
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            eyebrow="Get Started in Minutes"
            heading={
              <>
                How Worklynx{" "}
                <span className="text-gradient-brand">Works for You</span>
              </>
            }
            subtext="From signup to first invoice — follow these 5 simple steps to streamline your business operations."
            className="mb-0"
          />
        </div>
      </section>

      {/* Benefits bar */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <AnimatedSection key={b.label} className="text-center">
                <p className="text-2xl font-bold text-gradient-brand">{b.number}</p>
                <p className="text-sm text-slate-500 mt-1">{b.label}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Steps + Dashboard */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Steps */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-8">The 5-Step Journey</h3>
              {steps.map((step, i) => (
                <WorkflowStep
                  key={step.step}
                  {...step}
                  isLast={i === steps.length - 1}
                  delay={i * 0.12}
                />
              ))}
            </div>

            {/* Sticky dashboard preview */}
            <div className="lg:sticky lg:top-24">
              <DashboardPreview variant="analytics" height={420} />
              <AnimatedSection delay={0.3} className="mt-5">
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Pro Tip</p>
                  <p className="text-sm text-blue-700">
                    Your account comes pre-loaded with sample data — items, contacts, and transactions — so you can explore every feature before adding your own data.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Integration section */}
      <section className="py-16 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Integrations"
            heading="Connects with Your Existing Tools"
            subtext="Worklynx integrates seamlessly with accounting software, biometric devices, and banking systems."
          />

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { name: "Razorpay", cat: "Payments", color: "bg-blue-50 text-blue-700" },
              { name: "AWS S3", cat: "Storage", color: "bg-indigo-50 text-indigo-700" },
              { name: "WhatsApp", cat: "Notifications", color: "bg-sky-50 text-sky-700" },
              { name: "Elasticsearch", cat: "Search", color: "bg-violet-50 text-violet-700" },
              { name: "ZKTeco", cat: "Biometric", color: "bg-blue-50 text-blue-700" },
              { name: "eSSL Devices", cat: "Biometric", color: "bg-indigo-50 text-indigo-700" },
              { name: "Slack", cat: "Communication", color: "bg-sky-50 text-sky-700" },
              { name: "Google Workspace", cat: "Productivity", color: "bg-violet-50 text-violet-700" },
            ].map((item) => (
              <StaggerItem key={item.name}>
                <div className={`p-4 rounded-xl ${item.color} border border-current/10 text-center`}>
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="text-xs opacity-70 mt-0.5">{item.cat}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <HomeCTA />
    </>
  );
}

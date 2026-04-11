import { useEffect } from "react";
import { UserPlus, Clock, DollarSign, BarChart3, FileText } from "lucide-react";
import SectionHeader from "../components/shared/SectionHeader";
import WorkflowStep from "../components/how-it-works/WorkflowStep";
import DashboardPreview from "../components/mockups/DashboardPreview";
import AnimatedSection from "../components/shared/AnimatedSection";
import HomeCTA from "../components/home/HomeCTA";
import { StaggerContainer, StaggerItem } from "../components/shared/AnimatedSection";

const steps = [
  {
    step: 1,
    icon: UserPlus,
    title: "Add Your Employees",
    description:
      "Import employee data via CSV or add manually. Set up departments, designations, and salary structures. Employees receive a welcome email with self-service portal access.",
  },
  {
    step: 2,
    icon: Clock,
    title: "Track Attendance Automatically",
    description:
      "Connect biometric devices or enable mobile GPS check-in. Attendance syncs in real-time. Set up shifts, holidays, and leave policies once — the system handles the rest.",
  },
  {
    step: 3,
    icon: DollarSign,
    title: "Run Payroll in One Click",
    description:
      "At month-end, review attendance-linked payroll data and click 'Process Payroll'. Worklynx auto-calculates PF, ESI, TDS, and generates payslips. Disburse via direct bank transfer.",
  },
  {
    step: 4,
    icon: BarChart3,
    title: "Generate Reports & Insights",
    description:
      "Access 50+ pre-built reports or create custom ones. Track headcount trends, payroll costs, attrition risk, and compliance status. Export or schedule automated report delivery.",
  },
  {
    step: 5,
    icon: FileText,
    title: "Manage Invoices & Billing",
    description:
      "Create GST-compliant invoices for clients, track payment status, and send automated reminders. Reconcile accounts and generate GSTR reports for seamless tax compliance.",
  },
];

const benefits = [
  { number: "5 min", label: "Average setup time" },
  { number: "99.8%", label: "Payroll accuracy" },
  { number: "10×", label: "Faster than manual HR" },
  { number: "Zero", label: "Compliance penalties" },
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
            subtext="From setup to first payroll — follow these 5 simple steps to transform your HR operations."
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
                  <p className="text-sm font-semibold text-blue-900 mb-1">💡 Pro Tip</p>
                  <p className="text-sm text-blue-700">
                    Most customers complete their first payroll run within 48 hours of signing up. Our onboarding team is available to assist at every step.
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
            subtext="Worklynx integrates seamlessly with accounting software, biometric devices, and popular Indian banking systems."
          />

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { name: "Tally ERP", cat: "Accounting", color: "bg-blue-50 text-blue-700" },
              { name: "Zoho Books", cat: "Accounting", color: "bg-indigo-50 text-indigo-700" },
              { name: "HDFC NEFT", cat: "Banking", color: "bg-sky-50 text-sky-700" },
              { name: "ICICI Bulk Pay", cat: "Banking", color: "bg-violet-50 text-violet-700" },
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

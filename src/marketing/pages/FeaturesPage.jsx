import { useEffect } from "react";
import { Clock, DollarSign, Users, BarChart3, FileText, PieChart } from "lucide-react";
import SectionHeader from "../components/shared/SectionHeader";
import FeatureBlock from "../components/features/FeatureBlock";
import HomeCTA from "../components/home/HomeCTA";

const features = [
  {
    id: "attendance",
    icon: Clock,
    title: "Attendance Management",
    description:
      "Track employee attendance in real-time with multiple check-in methods. Our smart system handles shifts, overtime, holidays, and leave — giving you complete workforce visibility.",
    benefits: [
      "Biometric device integration (fingerprint, face ID)",
      "Mobile GPS-based check-in & geo-fencing",
      "Automated shift scheduling and rotations",
      "Leave management with approval workflows",
      "Real-time attendance dashboard with alerts",
      "Late arrival and early departure notifications",
    ],
    mockupVariant: "attendance",
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    id: "payroll",
    icon: DollarSign,
    title: "Payroll Automation",
    description:
      "Process error-free payroll in minutes with full statutory compliance. EaseUp auto-calculates PF, ESI, TDS and professional tax — and deposits directly to employee bank accounts.",
    benefits: [
      "One-click payroll processing for all employees",
      "Auto-computation: PF, ESI, TDS, PT, gratuity",
      "Salary structure customization with components",
      "Instant payslip generation and email delivery",
      "Form 16, Form 24Q, and statutory returns",
      "Direct bank transfer with bulk payout support",
    ],
    mockupVariant: "payroll",
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
  {
    id: "employees",
    icon: Users,
    title: "Employee Management",
    description:
      "Manage the complete employee lifecycle from onboarding to offboarding. Centralized profiles, document management, and self-service portal for every team member.",
    benefits: [
      "Digital onboarding with document collection",
      "Centralized employee database & org chart",
      "Document management: offer letters, contracts",
      "Employee self-service portal & mobile app",
      "Performance review and goal tracking",
      "Separation management and full & final settlement",
    ],
    mockupVariant: "analytics",
    color: "bg-violet-500",
    lightColor: "bg-violet-50",
    textColor: "text-violet-600",
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "HR Analytics & Insights",
    description:
      "Make smarter workforce decisions with AI-powered analytics. From attrition prediction to productivity tracking, EaseUp gives you the insights to lead proactively.",
    benefits: [
      "Real-time HR dashboard with 50+ metrics",
      "Attrition prediction with AI risk scoring",
      "Workforce productivity and engagement analytics",
      "Department-wise headcount and cost analysis",
      "Custom report builder with drill-down capability",
      "Automated alerts for anomalies and thresholds",
    ],
    mockupVariant: "analytics",
    color: "bg-sky-500",
    lightColor: "bg-sky-50",
    textColor: "text-sky-600",
  },
  {
    id: "invoicing",
    icon: FileText,
    title: "Invoicing & Billing",
    description:
      "Create professional GST-compliant invoices in seconds. Track outstanding payments, automate follow-ups, and maintain complete financial records for audits.",
    benefits: [
      "GST-compliant invoice generation with templates",
      "Client & vendor management with payment terms",
      "Automated payment reminders and follow-ups",
      "Multi-currency support for international clients",
      "GSTR-1 and reconciliation reports",
      "Credit notes, debit notes, and proforma invoices",
    ],
    mockupVariant: "invoice",
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    id: "reports",
    icon: PieChart,
    title: "Reports & Insights",
    description:
      "Access 50+ ready-to-use reports or build custom ones with our drag-and-drop report builder. Export to PDF, Excel, or CSV and schedule automatic delivery.",
    benefits: [
      "50+ pre-built HR and payroll reports",
      "Drag-and-drop custom report builder",
      "Scheduled report delivery via email",
      "Export to PDF, Excel, CSV formats",
      "Audit trails and compliance reports",
      "Role-based report access control",
    ],
    mockupVariant: "analytics",
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
];

export default function FeaturesPage() {
  useEffect(() => {
    document.title = "Features — EaseUpCEOs";
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            eyebrow="Platform Features"
            heading={
              <>
                Every HR Tool You Need,{" "}
                <span className="text-gradient-brand">Built for India</span>
              </>
            }
            subtext="EaseUpCEOs delivers enterprise-grade HR features tailored for Indian compliance requirements and business practices."
            className="mb-0"
          />
        </div>
      </section>

      {/* Feature Blocks */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {features.map((feature, index) => (
            <div key={feature.id} id={feature.id} className="border-b border-slate-100 last:border-0">
              <FeatureBlock feature={feature} reverse={index % 2 !== 0} />
            </div>
          ))}
        </div>
      </section>

      <HomeCTA />
    </>
  );
}

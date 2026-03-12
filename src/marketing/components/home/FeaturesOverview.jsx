import { Link } from "react-router-dom";
import { Clock, IndianRupee, Users, BarChart2, FileText, Download, ArrowRight } from "lucide-react";
import { StaggerContainer, StaggerItem } from "../shared/AnimatedSection";
import AnimatedSection from "../shared/AnimatedSection";

const features = [
  {
    icon: Clock,
    title: "Attendance tracking",
    desc: "Biometric, GPS, and web check-in. Shifts, overtime, geo-fencing. Real-time view, zero manual entry.",
    textColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    icon: IndianRupee,
    title: "Payroll processing",
    desc: "One-click processing. PF, ESI, TDS auto-computed. Payslips sent. Bank transfers done.",
    textColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
  },
  {
    icon: Users,
    title: "Employee database",
    desc: "Onboarding to offboarding. Documents, org charts, role history, and self-service portal.",
    textColor: "text-violet-600",
    iconBg: "bg-violet-50",
  },
  {
    icon: BarChart2,
    title: "HR analytics",
    desc: "Attrition risk, headcount trends, payroll cost breakdown. Built-in and custom reports.",
    textColor: "text-sky-600",
    iconBg: "bg-sky-50",
  },
  {
    icon: FileText,
    title: "GST invoicing",
    desc: "Create, send, track invoices. Auto-reminders before due dates. GSTR reports in one click.",
    textColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    icon: Download,
    title: "Exports & reports",
    desc: "50+ pre-built reports. Export to PDF, Excel, CSV. Schedule delivery to your inbox.",
    textColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
  },
];

export default function FeaturesOverview() {
  return (
    <section className="py-24 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <AnimatedSection className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">
            Everything included
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
            The full HR stack,
            <br />
            not a patchwork of tools.
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <div className="group bg-white border border-slate-200/70 rounded-xl p-6 hover:border-blue-200 hover:shadow-md transition-all duration-200 h-full flex flex-col">
                <div className={`w-9 h-9 rounded-lg ${f.iconBg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-4.5 h-4.5 ${f.textColor}`} strokeWidth={1.75} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{f.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection delay={0.2} className="text-center mt-10">
          <Link
            to="/features"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            See all features in detail
            <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}

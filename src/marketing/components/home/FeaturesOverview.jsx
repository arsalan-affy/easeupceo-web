import { Link } from "react-router-dom";
import { Clock, DollarSign, Users, BarChart3, FileText, PieChart, ArrowRight } from "lucide-react";
import SectionHeader from "../shared/SectionHeader";
import { StaggerContainer, StaggerItem } from "../shared/AnimatedSection";

const features = [
  {
    icon: Clock,
    title: "Attendance Tracking",
    desc: "Real-time attendance monitoring with biometric, mobile, and web check-in support.",
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    icon: DollarSign,
    title: "Payroll Processing",
    desc: "End-to-end payroll automation with statutory compliance and instant payslip generation.",
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
  {
    icon: Users,
    title: "Employee Lifecycle",
    desc: "From onboarding to offboarding — manage the entire employee journey in one place.",
    color: "bg-violet-500",
    lightColor: "bg-violet-50",
    textColor: "text-violet-600",
  },
  {
    icon: BarChart3,
    title: "HR Analytics",
    desc: "Real-time dashboards and AI-driven insights to make data-informed workforce decisions.",
    color: "bg-sky-500",
    lightColor: "bg-sky-50",
    textColor: "text-sky-600",
  },
  {
    icon: FileText,
    title: "Invoicing & Billing",
    desc: "Generate GST-compliant invoices, track outstanding payments, and automate follow-ups.",
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    icon: PieChart,
    title: "Reports & Exports",
    desc: "Over 50 ready-to-use reports. Export to Excel, PDF, or CSV with a single click.",
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
];

export default function FeaturesOverview() {
  return (
    <section className="py-24 gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Full-Featured HRMS"
          heading={
            <>
              One Platform,{" "}
              <span className="text-gradient-brand">Infinite Possibilities</span>
            </>
          }
          subtext="Worklynx covers every aspect of HR management, from daily attendance to yearly audits."
        />

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <div className="group h-full p-6 rounded-2xl bg-white border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className={`w-10 h-10 rounded-xl ${f.lightColor} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.textColor}`} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{f.desc}</p>
                <Link
                  to="/features"
                  className={`inline-flex items-center gap-1 text-xs font-semibold ${f.textColor} opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                  Learn more <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="text-center mt-10">
          <Link
            to="/features"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all features <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

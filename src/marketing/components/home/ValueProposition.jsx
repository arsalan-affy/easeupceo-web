import { Clock, DollarSign, FileText } from "lucide-react";
import SectionHeader from "../shared/SectionHeader";
import { StaggerContainer, StaggerItem } from "../shared/AnimatedSection";

const pillars = [
  {
    icon: Clock,
    title: "Smart Attendance",
    description:
      "Automated time tracking with biometric and mobile check-ins. Geo-fencing, shift scheduling, and leave management — all in one place.",
    color: "bg-blue-50",
    iconColor: "text-blue-600",
    border: "border-blue-100",
    benefits: ["Biometric integration", "GPS check-in", "Auto overtime calculation"],
  },
  {
    icon: DollarSign,
    title: "Automated Payroll",
    description:
      "Process salaries with one click. Auto-compute PF, ESI, TDS and generate payslips. 100% compliant with Indian labour laws.",
    color: "bg-indigo-50",
    iconColor: "text-indigo-600",
    border: "border-indigo-100",
    benefits: ["PF/ESI compliance", "One-click processing", "Instant payslips"],
  },
  {
    icon: FileText,
    title: "Professional Invoicing",
    description:
      "Create branded invoices, track payments, and send automated reminders. Full GST compliance with real-time financial reports.",
    color: "bg-violet-50",
    iconColor: "text-violet-600",
    border: "border-violet-100",
    benefits: ["GST-compliant invoices", "Auto payment reminders", "Financial reports"],
  },
];

export default function ValueProposition() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Why EaseUpCEOs"
          heading={
            <>
              Everything Your HR Team{" "}
              <span className="text-gradient-brand">Needs to Thrive</span>
            </>
          }
          subtext="Manage your entire workforce from a single, intuitive platform built for Indian businesses."
        />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <StaggerItem key={p.title}>
              <div className={`group h-full p-6 rounded-2xl bg-white border ${p.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                <div className={`w-12 h-12 rounded-xl ${p.color} flex items-center justify-center mb-5`}>
                  <p.icon className={`w-6 h-6 ${p.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">{p.description}</p>
                <ul className="space-y-2">
                  {p.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-slate-600">
                      <div className={`w-4 h-4 rounded-full ${p.color} ${p.iconColor} flex items-center justify-center text-[10px] font-bold shrink-0`}>
                        ✓
                      </div>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

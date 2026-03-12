import { Clock, DollarSign, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection, { StaggerContainer, StaggerItem } from "../shared/AnimatedSection";

const pillars = [
  {
    number: "01",
    icon: Clock,
    title: "Attendance that runs itself",
    description:
      "Employees check in via mobile or biometric. Shifts, overtime, and leaves are tracked in real time. By month-end, the numbers are already waiting in payroll.",
    link: "/features#attendance",
    linkLabel: "Attendance features",
    accent: "text-blue-600",
    accentBg: "bg-blue-600",
  },
  {
    number: "02",
    icon: DollarSign,
    title: "Payroll closed in minutes, not days",
    description:
      "PF, ESI, and TDS auto-calculated. Payslips generated and sent. Direct bank transfers initiated. The whole cycle — done before lunch on the 1st.",
    link: "/features#payroll",
    linkLabel: "Payroll features",
    accent: "text-indigo-600",
    accentBg: "bg-indigo-600",
  },
  {
    number: "03",
    icon: FileText,
    title: "Invoices that are compliant by default",
    description:
      "GST invoicing, credit notes, GSTR reports. Auto-reminders go out before clients go overdue. Your finance team stays clean without chasing anyone.",
    link: "/features#invoicing",
    linkLabel: "Invoicing features",
    accent: "text-violet-600",
    accentBg: "bg-violet-600",
  },
];

export default function ValueProposition() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading — left-aligned for variety */}
        <AnimatedSection className="max-w-lg mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">
            Core modules
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Three things HR teams spend most of their time on.
            <span className="text-slate-400 font-normal"> We automated all of them.</span>
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-slate-100 rounded-2xl overflow-hidden shadow-sm">
          {pillars.map((p) => (
            <StaggerItem key={p.title}>
              <div className="bg-white p-8 h-full flex flex-col group hover:bg-slate-50/60 transition-colors duration-200">
                {/* Number + icon row */}
                <div className="flex items-center justify-between mb-7">
                  <span className="text-4xl font-black text-slate-100 select-none tracking-tighter">{p.number}</span>
                  <div className={`w-10 h-10 rounded-xl ${p.accentBg} flex items-center justify-center`}>
                    <p.icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-6">{p.description}</p>

                <Link
                  to={p.link}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold ${p.accent} group-hover:gap-2.5 transition-all duration-200`}
                >
                  {p.linkLabel}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

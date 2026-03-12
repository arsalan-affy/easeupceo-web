import { Link } from "react-router-dom";
import { Clock, DollarSign, Users, BarChart3, FileText, PieChart } from "lucide-react";

const features = [
  {
    icon: Clock,
    name: "Attendance Management",
    desc: "Real-time tracking & biometric integration",
    hash: "#attendance",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: DollarSign,
    name: "Payroll Automation",
    desc: "Compliant payroll with auto tax computation",
    hash: "#payroll",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Users,
    name: "Employee Management",
    desc: "Centralized employee profiles & lifecycle",
    hash: "#employees",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: BarChart3,
    name: "HR Analytics",
    desc: "AI-powered workforce insights & reports",
    hash: "#analytics",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: FileText,
    name: "Invoicing & Billing",
    desc: "Professional invoices & payment tracking",
    hash: "#invoicing",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: PieChart,
    name: "Reports & Insights",
    desc: "Custom reports with export capabilities",
    hash: "#reports",
    color: "bg-violet-50 text-violet-600",
  },
];

export default function FeaturesMegaMenu() {
  return (
    <div className="grid grid-cols-2 gap-1 p-3 w-[480px]">
      {features.map((f) => (
        <Link
          key={f.name}
          to={`/features${f.hash}`}
          className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
        >
          <div className={`w-8 h-8 rounded-lg ${f.color} flex items-center justify-center shrink-0 mt-0.5`}>
            <f.icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
              {f.name}
            </p>
            <p className="text-xs text-slate-500 leading-tight mt-0.5">{f.desc}</p>
          </div>
        </Link>
      ))}
      <div className="col-span-2 mt-1 pt-3 border-t border-slate-100 flex items-center justify-between px-3">
        <p className="text-xs text-slate-500">Explore all features →</p>
        <Link
          to="/features"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All Features
        </Link>
      </div>
    </div>
  );
}

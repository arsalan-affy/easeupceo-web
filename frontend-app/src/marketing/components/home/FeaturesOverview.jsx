import { Link } from "react-router-dom";
import { Package, FileText, ShoppingCart, BookOpen, Users, BarChart3, ArrowRight } from "lucide-react";
import SectionHeader from "../shared/SectionHeader";
import { StaggerContainer, StaggerItem } from "../shared/AnimatedSection";

const features = [
  {
    icon: BookOpen,
    title: "Accounting & Finance",
    desc: "Complete double-entry accounting with journals, ledgers, bank reconciliation, and financial reports.",
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
  {
    icon: Package,
    title: "Inventory Management",
    desc: "Track stock with batch numbers, serial numbers, FIFO costing, warehouses, and item adjustments.",
    color: "bg-violet-500",
    lightColor: "bg-violet-50",
    textColor: "text-violet-600",
  },
  {
    icon: FileText,
    title: "Sales & Invoicing",
    desc: "Quotations, sales orders, delivery orders, invoices, and sales returns — all connected seamlessly.",
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    icon: ShoppingCart,
    title: "Purchases & Bills",
    desc: "Manage purchase orders, bills, purchase returns, and vendor payments with full audit trails.",
    color: "bg-sky-500",
    lightColor: "bg-sky-50",
    textColor: "text-sky-600",
  },
  {
    icon: Users,
    title: "Employees & Contacts",
    desc: "Centralized employee and contact management with roles, departments, and organizational structure.",
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    desc: "Ready-to-use reports for sales, purchases, inventory, taxes, and accounting. Export to Excel, PDF, or CSV.",
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-600",
  },
];

export default function FeaturesOverview() {
  return (
    <section className="py-24 gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="All-in-One Platform"
          heading={
            <>
              One Platform,{" "}
              <span className="text-gradient-brand">Infinite Possibilities</span>
            </>
          }
          subtext="Worklynx covers accounting, inventory, sales, purchases, and employee management — everything your business needs."
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

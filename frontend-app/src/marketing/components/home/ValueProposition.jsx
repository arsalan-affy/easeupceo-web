import { BookOpen, Package, FileText } from "lucide-react";
import SectionHeader from "../shared/SectionHeader";
import { StaggerContainer, StaggerItem } from "../shared/AnimatedSection";

const pillars = [
  {
    icon: BookOpen,
    title: "Complete Accounting",
    description:
      "Double-entry accounting with journals, ledgers, bank reconciliation, and tax management. Generate financial statements and reports with a single click.",
    color: "bg-indigo-50",
    iconColor: "text-indigo-600",
    border: "border-indigo-100",
    benefits: ["Multi-currency support", "Tax & GST compliance", "Financial reports"],
  },
  {
    icon: Package,
    title: "Smart Inventory",
    description:
      "Track stock across warehouses with batch numbers, serial numbers, and FIFO costing. Automated stock adjustments and real-time availability.",
    color: "bg-violet-50",
    iconColor: "text-violet-600",
    border: "border-violet-100",
    benefits: ["Batch & serial tracking", "Multi-warehouse", "FIFO costing"],
  },
  {
    icon: FileText,
    title: "Sales & Purchases",
    description:
      "End-to-end sales and purchase cycle — from quotations to invoices, purchase orders to bills. Track everything with full audit trails.",
    color: "bg-blue-50",
    iconColor: "text-blue-600",
    border: "border-blue-100",
    benefits: ["Quotation to invoice", "Purchase returns", "Payment tracking"],
  },
];

export default function ValueProposition() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Why Worklynx"
          heading={
            <>
              Everything Your Business{" "}
              <span className="text-gradient-brand">Needs to Grow</span>
            </>
          }
          subtext="Manage your entire business from a single, intuitive platform — accounting, inventory, sales, and more."
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

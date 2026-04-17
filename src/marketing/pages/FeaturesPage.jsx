import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BookOpen, Package, FileText, ShoppingCart, Users, BarChart3 } from "lucide-react";
import SectionHeader from "../components/shared/SectionHeader";
import FeatureBlock from "../components/features/FeatureBlock";
import HomeCTA from "../components/home/HomeCTA";

const features = [
  {
    id: "accounting",
    icon: BookOpen,
    title: "Accounting & Finance",
    description:
      "Complete double-entry accounting system with journals, ledgers, and bank reconciliation. Manage taxes, generate financial statements, and keep your books accurate — all from one place.",
    benefits: [
      "Double-entry journals and ledger management",
      "Bank transactions and reconciliation",
      "Tax management and compliance",
      "Money transfers and expense tracking",
      "Multi-currency support",
      "Financial reports and audit trails",
    ],
    mockupVariant: "analytics",
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
  {
    id: "inventory",
    icon: Package,
    title: "Inventory Management",
    description:
      "Track your stock across multiple warehouses with batch numbers, serial numbers, and FIFO costing. Real-time stock levels, automated adjustments, and complete traceability.",
    benefits: [
      "Batch number and serial number tracking",
      "FIFO product costing (in & out)",
      "Multi-warehouse stock management",
      "Item categories, groups, and attributes",
      "Stock adjustments and wastage tracking",
      "Barcode printing and item tracing",
    ],
    mockupVariant: "analytics",
    color: "bg-violet-500",
    lightColor: "bg-violet-50",
    textColor: "text-violet-600",
  },
  {
    id: "sales",
    icon: FileText,
    title: "Sales & Invoicing",
    description:
      "Manage the complete sales cycle from quotation to invoice. Create professional invoices, track deliveries, handle returns, and manage customer payments seamlessly.",
    benefits: [
      "Quotations and sales orders",
      "Delivery orders and invoicing",
      "Sales returns and credit notes",
      "Customer payment tracking",
      "Price lists and coupon codes",
      "Sales reports and analytics",
    ],
    mockupVariant: "invoice",
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    id: "purchases",
    icon: ShoppingCart,
    title: "Purchases & Bills",
    description:
      "Streamline your procurement with purchase orders, bill management, and vendor payments. Track purchase returns and maintain complete purchase history.",
    benefits: [
      "Purchase order management",
      "Bill processing and tracking",
      "Purchase returns handling",
      "Vendor management and payments",
      "Purchase reports and analytics",
      "Multi-vendor price comparison",
    ],
    mockupVariant: "analytics",
    color: "bg-sky-500",
    lightColor: "bg-sky-50",
    textColor: "text-sky-600",
  },
  {
    id: "employees",
    icon: Users,
    title: "Employees & Contacts",
    description:
      "Centralized management for employees and business contacts. Organize by departments, designations, roles, and teams. Optional payroll, attendance, and leave modules available as add-ons.",
    benefits: [
      "Employee profiles and directory",
      "Department and designation management",
      "Role-based access control",
      "Contact and vendor management",
      "Optional: Payroll processing (add-on)",
      "Optional: Attendance & leave tracking (add-on)",
    ],
    mockupVariant: "analytics",
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    id: "reports",
    icon: BarChart3,
    title: "Reports & Analytics",
    description:
      "Comprehensive reporting across sales, purchases, inventory, taxes, and accounting. Export to Excel, PDF, or CSV. Get the insights you need to make informed business decisions.",
    benefits: [
      "Sales and purchase reports",
      "Inventory and stock reports",
      "Tax and compliance reports",
      "Accounting and financial reports",
      "Export to Excel, PDF, and CSV",
      "Custom report generation",
    ],
    mockupVariant: "analytics",
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-600",
  },
];

export default function FeaturesPage() {
  const location = useLocation();

  useEffect(() => {
    document.title = "Features — Worklynx";
  }, []);

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    }
  }, [location]);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            eyebrow="Platform Features"
            heading={
              <>
                Every Business Tool You Need,{" "}
                <span className="text-gradient-brand">In One Place</span>
              </>
            }
            subtext="Worklynx delivers complete accounting, inventory, and sales management with optional HR modules — built for growing businesses."
            className="mb-0"
          />
        </div>
      </section>

      {/* Feature Blocks */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {features.map((feature, index) => (
            <div key={feature.id} id={feature.id} className="border-b border-slate-100 last:border-0 scroll-mt-20">
              <FeatureBlock feature={feature} reverse={index % 2 !== 0} />
            </div>
          ))}
        </div>
      </section>

      <HomeCTA />
    </>
  );
}

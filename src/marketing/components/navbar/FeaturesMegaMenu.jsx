import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Package, FileText, ShoppingCart, Users, BarChart3 } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    name: "Accounting & Finance",
    desc: "Journals, ledgers, bank reconciliation & tax management",
    hash: "#accounting",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Package,
    name: "Inventory Management",
    desc: "Stock tracking with batch, serial & FIFO costing",
    hash: "#inventory",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: FileText,
    name: "Sales & Invoicing",
    desc: "Quotations, orders, invoices & payment tracking",
    hash: "#sales",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: ShoppingCart,
    name: "Purchases & Bills",
    desc: "Purchase orders, bills & vendor management",
    hash: "#purchases",
    color: "bg-sky-50 text-sky-600",
  },
  {
    icon: Users,
    name: "Employees & Contacts",
    desc: "Employee profiles, departments & contact management",
    hash: "#employees",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: BarChart3,
    name: "Reports & Analytics",
    desc: "Sales, purchase, inventory & accounting reports",
    hash: "#reports",
    color: "bg-orange-50 text-orange-600",
  },
];

export default function FeaturesMegaMenu() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e, hash) => {
    const targetId = hash.slice(1);

    if (location.pathname === "/features") {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
      window.history.replaceState(null, "", `/features${hash}`);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-1 p-3 w-[480px]">
      {features.map((f) => (
        <Link
          key={f.name}
          to={`/features${f.hash}`}
          onClick={(e) => handleClick(e, f.hash)}
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

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  FileText,
  BookOpen,
  BarChart3,
  ShoppingCart,
} from "lucide-react";

const STEP_DURATION = 5500;

const steps = [
  {
    id: 1,
    time: "Monday · 9:00 AM",
    label: "Inventory",
    icon: Package,
    before: {
      heading: "Stock counts don't match. Again.",
      body: "3 spreadsheets tracking the same items. One says 47 units, another says 52. A customer just ordered 50 and you're not sure you have enough.",
      tag: "2 hours reconciling",
      items: [
        "Multiple spreadsheets, no single source of truth",
        "Manual stock counts prone to human error",
        "No real-time visibility into stock levels",
      ],
    },
    after: {
      heading: "Real-time stock across all warehouses.",
      body: "Every sale, purchase, and adjustment updates stock instantly. Batch and serial number tracking with FIFO costing. You always know exactly what you have.",
      tag: "Always accurate",
      items: [
        "Automatic stock updates on every transaction",
        "Batch & serial number traceability",
        "Multi-warehouse with transfer tracking",
      ],
    },
  },
  {
    id: 2,
    time: "Monday · 11:00 AM",
    label: "Sales",
    icon: FileText,
    before: {
      heading: "Quotation sent last week. No follow-up.",
      body: "Customer asked for a quote 5 days ago. You typed it in Word, emailed it, and forgot. Now they're asking and you can't find the file.",
      tag: "Lost deal potential",
      items: [
        "Quotes in Word docs with no tracking",
        "No conversion pipeline from quote to invoice",
        "Payment status tracked in yet another spreadsheet",
      ],
    },
    after: {
      heading: "Quote → Order → Invoice in 3 clicks.",
      body: "Create a quotation, convert to sales order, then to invoice — all linked. Track payment status, send reminders, and record deliveries in one flow.",
      tag: "Complete audit trail",
      items: [
        "Quotation → Sales Order → Invoice pipeline",
        "Automatic payment tracking and reminders",
        "Delivery orders linked to every sale",
      ],
    },
  },
  {
    id: 3,
    time: "Tuesday · 2:00 PM",
    label: "Purchases",
    icon: ShoppingCart,
    before: {
      heading: "Vendor bill doesn't match the PO.",
      body: "You ordered 100 units at ₹50 each. The bill says ₹55. No easy way to compare — the PO is in one folder, the bill in another.",
      tag: "Disputes & delays",
      items: [
        "PO and bill tracked separately",
        "Manual price matching prone to errors",
        "No purchase return workflow",
      ],
    },
    after: {
      heading: "PO linked to bill. Mismatch flagged instantly.",
      body: "Purchase orders auto-link to bills. Price discrepancies are highlighted. Returns are tracked with debit notes. Full vendor payment history in one view.",
      tag: "Zero surprises",
      items: [
        "PO → Bill linking with variance detection",
        "Purchase returns with debit notes",
        "Vendor ledger with complete payment history",
      ],
    },
  },
  {
    id: 4,
    time: "Wednesday · 10:00 AM",
    label: "Accounting",
    icon: BookOpen,
    before: {
      heading: "Month-end close takes a full week.",
      body: "Manually entering journal entries, reconciling bank statements, and chasing missing receipts. The accountant is overwhelmed and tax filing is approaching.",
      tag: "5 days of manual work",
      items: [
        "Manual journal entries for every transaction",
        "Bank reconciliation in spreadsheets",
        "Tax reports compiled by hand",
      ],
    },
    after: {
      heading: "Journals auto-posted. Reports ready instantly.",
      body: "Every sale, purchase, and payment automatically creates journal entries. Bank reconciliation in minutes. Tax reports generated with one click.",
      tag: "Done in hours, not days",
      items: [
        "Auto-generated journal entries",
        "Bank reconciliation with matching",
        "Tax-ready reports at the click of a button",
      ],
    },
  },
  {
    id: 5,
    time: "Friday · 4:00 PM",
    label: "Reports",
    icon: BarChart3,
    before: {
      heading: "Boss wants a P&L report. By EOD.",
      body: "You need data from 4 different tools. Sales from one, expenses from another, payroll from a third. It'll take hours to compile and format.",
      tag: "Hours of compilation",
      items: [
        "Data scattered across multiple tools",
        "Manual report creation in Excel",
        "Numbers don't always match",
      ],
    },
    after: {
      heading: "P&L, Balance Sheet, Cash Flow — one click.",
      body: "All your data lives in one system. Financial reports are always up-to-date. Export to PDF, Excel, or CSV. Schedule automated delivery.",
      tag: "Ready in seconds",
      items: [
        "Real-time financial statements",
        "Sales, purchase, and inventory reports",
        "Export to PDF, Excel, or CSV instantly",
      ],
    },
  },
];

export default function UserJourneySection() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    setProgress(0);
    startRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - startRef.current;
      const pct = Math.min((elapsed / STEP_DURATION) * 100, 100);
      setProgress(pct);
      if (elapsed < STEP_DURATION) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setActive((prev) => (prev + 1) % steps.length);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  const handleStepClick = (idx) => {
    cancelAnimationFrame(rafRef.current);
    setActive(idx);
  };

  const step = steps[active];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">
            User Journey
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
            A week in your business. Walk through it.
          </h2>
          <p className="text-slate-500 max-w-lg text-base">
            5 common scenarios. Every one of them painful without the right system. See exactly what changes.
          </p>
        </div>

        {/* Step tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 -mx-1 px-1">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = idx === active;
            const isDone = idx < active;
            return (
              <button
                key={s.id}
                onClick={() => handleStepClick(idx)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap border shrink-0 ${
                  isActive
                    ? "bg-white border-blue-200 text-blue-700 shadow-sm"
                    : isDone
                    ? "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isDone
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isDone ? "✓" : s.id}
                </div>
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{s.label}</span>
                {isActive && (
                  <div className="w-10 h-1 rounded-full bg-blue-100 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-none"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Timestamp */}
            <div className="flex items-center gap-1.5 mb-5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">{step.time}</span>
            </div>

            {/* Before / After cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Before */}
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-orange-600">
                    Without Worklynx
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {step.before.heading}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{step.before.body}</p>
                <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-lg mb-5">
                  <Clock className="w-3 h-3" />
                  {step.before.tag}
                </div>
                <ul className="space-y-2.5">
                  {step.before.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-300 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* After */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                    With Worklynx
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {step.after.heading}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{step.after.body}</p>
                <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg mb-5">
                  <CheckCircle className="w-3 h-3" />
                  {step.after.tag}
                </div>
                <ul className="space-y-2.5">
                  {step.after.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Summary bar */}
        <div className="mt-6 bg-white border border-slate-200 rounded-2xl px-6 py-5 flex flex-wrap gap-6 items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
              Manual effort per week
            </p>
            <p className="text-2xl font-extrabold text-orange-500 tracking-tight">~12 hours</p>
          </div>
          <div className="text-slate-300 text-xl font-light">→</div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
              With Worklynx
            </p>
            <p className="text-2xl font-extrabold text-blue-600 tracking-tight">Under 1 hour</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-200" />
          <p className="flex-1 min-w-[180px] text-sm text-slate-500 leading-relaxed">
            That's 10+ hours back every week. Time you can spend growing your business instead of managing spreadsheets.
          </p>
          <a
            href="/contact"
            className="shrink-0 px-5 py-2.5 bg-slate-950 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors"
          >
            See a live demo
          </a>
        </div>
      </div>
    </section>
  );
}

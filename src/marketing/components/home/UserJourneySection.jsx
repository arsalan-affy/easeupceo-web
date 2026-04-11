import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  CheckSquare,
  CreditCard,
  Mail,
} from "lucide-react";

const STEP_DURATION = 5500;

const steps = [
  {
    id: 1,
    time: "Day 28 · 9:00 AM",
    label: "Attendance",
    icon: Users,
    before: {
      heading: "Chasing 47 employees for attendance",
      body: "Messages sent to 3 team leads. 12 employees haven't submitted their register. You're on your 4th WhatsApp follow-up.",
      tag: "3 hours lost",
      items: [
        "WhatsApp groups, not systems",
        "Manual cross-checking with shift rosters",
        "5 disputes with no audit trail",
      ],
    },
    after: {
      heading: "All 47 marked. Auto-synced overnight.",
      body: "Biometric data pulled at midnight. Geo-fenced mobile check-ins captured. Attendance locked by 9:01 AM. Zero chasing.",
      tag: "Done in 1 minute",
      items: [
        "Biometric + mobile geo-fencing sync",
        "Anomalies auto-flagged for review",
        "Disputes logged with evidence in-app",
      ],
    },
  },
  {
    id: 2,
    time: "Day 29 · 2:00 PM",
    label: "Computation",
    icon: FileText,
    before: {
      heading: "3 spreadsheets. 2 formula errors found.",
      body: "PF calculation wrong for 4 employees. ESI slab changed last quarter — formula wasn't updated. Restarting the whole sheet.",
      tag: "4 hours of re-work",
      items: [
        "Manual PF / ESI / TDS formulas",
        "Human error on every payroll run",
        "No version history or audit log",
      ],
    },
    after: {
      heading: "₹24.85L computed in 18 seconds.",
      body: "PF, ESI, TDS applied automatically using current slabs. Statutory updates are built-in. Full audit log generated instantly.",
      tag: "Zero errors",
      items: [
        "Real-time statutory slab updates",
        "Full computation audit trail",
        "Exceptions surfaced for HR review",
      ],
    },
  },
  {
    id: 3,
    time: "Day 30 · 9:00 AM",
    label: "Approval",
    icon: CheckSquare,
    before: {
      heading: "Email thread. 6 replies. Still waiting.",
      body: "Payroll sheet sent to 3 managers. One is traveling. Another replied with a correction on v3 — you're on v5.",
      tag: "Half a day wasted",
      items: [
        "No structured approval workflow",
        "Version confusion on attachments",
        "No deadline or escalation tracking",
      ],
    },
    after: {
      heading: "3 approvals in 4 minutes.",
      body: "Approval request pushed in-app with one click. Managers tap approve from mobile. Locked after final sign-off. Fully timestamped.",
      tag: "Closed by 9:04 AM",
      items: [
        "Mobile-friendly in-app approval",
        "Payroll locked after final sign-off",
        "Timestamped trail per approver",
      ],
    },
  },
  {
    id: 4,
    time: "Day 30 · 11:00 AM",
    label: "Disbursement",
    icon: CreditCard,
    before: {
      heading: "NEFT file upload timed out. 2 rejections.",
      body: "Bank portal timed out on the first attempt. Two transactions rejected — wrong IFSC codes. Now regenerating and re-uploading.",
      tag: "2 failed + 2 hours re-work",
      items: [
        "Manual NEFT file generation",
        "Bank portal errors with no clear reason",
        "No real-time transfer status",
      ],
    },
    after: {
      heading: "₹24.85L transferred. 0 failures.",
      body: "Direct bank API integration. IFSC validated at input, before payroll runs. All 47 employees credited the same day.",
      tag: "Done by 11:04 AM",
      items: [
        "Direct bank integration — no portal",
        "IFSC validated before disbursement",
        "Real-time per-employee transfer status",
      ],
    },
  },
  {
    id: 5,
    time: "Day 30 · 11:30 AM",
    label: "Payslips",
    icon: Mail,
    before: {
      heading: "47 PDFs. 47 emails. Manually.",
      body: "Generating payslip PDFs one by one. Attaching to individual emails. This took 90 minutes last month. You're already tired.",
      tag: "90 minutes of repetition",
      items: [
        "Manual PDF generation per employee",
        "Individual email attachments",
        "No delivery confirmation",
      ],
    },
    after: {
      heading: "47 payslips sent in 8 seconds.",
      body: "One click. Every employee gets a branded PDF payslip by email, instantly. Read receipts tracked per employee.",
      tag: "Done instantly",
      items: [
        "Auto-generated branded PDF payslips",
        "Bulk email with a single click",
        "Delivery confirmation per employee",
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
            It's salary day. Walk through it.
          </h2>
          <p className="text-slate-500 max-w-lg text-base">
            5 steps. Every one of them painful without the right system. See exactly what changes.
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
              Total manual effort
            </p>
            <p className="text-2xl font-extrabold text-orange-500 tracking-tight">~7 hours</p>
          </div>
          <div className="text-slate-300 text-xl font-light">→</div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
              With Worklynx
            </p>
            <p className="text-2xl font-extrabold text-blue-600 tracking-tight">47 minutes</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-200" />
          <p className="flex-1 min-w-[180px] text-sm text-slate-500 leading-relaxed">
            That's 6+ hours back every payroll cycle. For a team of 150, that compounds across every month.
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

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
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

const steps = [
  {
    id: 1,
    time: "Day 28 · 9:00 AM",
    label: "Attendance",
    icon: Users,
    manualTime: "~3 hours",
    easeupTime: "1 minute",
    rows: [
      {
        aspect: "Data collection",
        before: "Manual registers + WhatsApp follow-ups to team leads",
        after: "Auto-synced from biometric + geo-fenced mobile check-ins",
      },
      {
        aspect: "Accuracy",
        before: "Manual cross-check — errors caught after the fact",
        after: "Anomalies auto-flagged before attendance locks",
      },
      {
        aspect: "Disputes",
        before: "No audit trail — resolved by call or email",
        after: "Logged in-app with evidence and timestamps",
      },
      {
        aspect: "HR effort",
        before: "4+ hours chasing 47 employees every cycle",
        after: "Zero — attendance locks automatically by 9:01 AM",
      },
    ],
  },
  {
    id: 2,
    time: "Day 29 · 2:00 PM",
    label: "Computation",
    icon: FileText,
    manualTime: "~4 hours",
    easeupTime: "18 seconds",
    rows: [
      {
        aspect: "PF / ESI / TDS",
        before: "Manual Excel formulas — slab updates missed last quarter",
        after: "Auto-applied using current statutory slabs, always in sync",
      },
      {
        aspect: "Error rate",
        before: "Wrong deductions for 4 employees found mid-process",
        after: "Zero — validated against compliance rules on every run",
      },
      {
        aspect: "Audit trail",
        before: "No version history, no record of who changed what",
        after: "Full computation log with timestamps per run",
      },
      {
        aspect: "Time taken",
        before: "Half a day including finding and fixing errors",
        after: "₹24.85L for 156 employees done in 18 seconds",
      },
    ],
  },
  {
    id: 3,
    time: "Day 30 · 9:00 AM",
    label: "Approval",
    icon: CheckSquare,
    manualTime: "~4 hours",
    easeupTime: "4 minutes",
    rows: [
      {
        aspect: "Method",
        before: "Payroll sheet emailed to 3 managers as an attachment",
        after: "In-app approval request — one tap from mobile",
      },
      {
        aspect: "Version control",
        before: "Multiple sheet versions — manager replies on v3, you're on v5",
        after: "Single source of truth, locked after final sign-off",
      },
      {
        aspect: "Follow-ups",
        before: "Manual reminders sent — no escalation if ignored",
        after: "Auto-nudge at 30 min; escalates to next approver",
      },
      {
        aspect: "Record",
        before: "No timestamp or record of who approved which version",
        after: "Immutable audit trail with timestamps per approver",
      },
    ],
  },
  {
    id: 4,
    time: "Day 30 · 11:00 AM",
    label: "Disbursement",
    icon: CreditCard,
    manualTime: "~2 hours",
    easeupTime: "4 minutes",
    rows: [
      {
        aspect: "Transfer method",
        before: "Manual NEFT file generated and uploaded to bank portal",
        after: "Direct bank API — no portal login, no file upload needed",
      },
      {
        aspect: "Failure handling",
        before: "2 transactions rejected — wrong IFSC, cryptic error messages",
        after: "IFSC validated at data entry — zero failures at transfer time",
      },
      {
        aspect: "Status tracking",
        before: "Check the bank statement the following day",
        after: "Real-time per-employee transfer status in the dashboard",
      },
      {
        aspect: "Outcome",
        before: "Re-uploaded 3 times due to portal errors and timeouts",
        after: "₹24.85L transferred — all 47 employees credited same day",
      },
    ],
  },
  {
    id: 5,
    time: "Day 30 · 11:30 AM",
    label: "Payslips",
    icon: Mail,
    manualTime: "~90 min",
    easeupTime: "8 seconds",
    rows: [
      {
        aspect: "PDF generation",
        before: "Created manually per employee — one at a time",
        after: "Auto-generated branded PDF for all employees at once",
      },
      {
        aspect: "Distribution",
        before: "Individual email with attachment sent to each person",
        after: "Bulk send with one click — all 47 simultaneously",
      },
      {
        aspect: "Confirmation",
        before: "No way to know who received or opened the payslip",
        after: "Read receipt tracked per employee in the dashboard",
      },
      {
        aspect: "Repeat cost",
        before: "90 minutes of identical manual work every single month",
        after: "8 seconds — same effort, every month, forever",
      },
    ],
  },
];

export default function UserJourneySection() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const idx = Math.min(Math.floor(v * steps.length), steps.length - 1);
      setActive(idx);
    });
  }, [scrollYProgress]);

  const step = steps[active];

  return (
    /* Outer section is tall to give scroll room — each step gets ~80vh of scroll */
    <section
      ref={sectionRef}
      style={{ height: `${steps.length * 100}vh` }}
      className="relative"
    >
      {/* Sticky panel — sticks at top-0, pt-16 accounts for the fixed navbar */}
      <div className="sticky top-0 h-screen flex flex-col bg-slate-50 overflow-hidden pt-16">
        <div className="flex-1 min-h-0 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 gap-4">

          {/* Section header */}
          <div className="shrink-0 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">
                User Journey
              </p>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-950 tracking-tight">
                It's salary day. Walk through it.
              </h2>
            </div>
            <p className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 pb-0.5 shrink-0">
              <span className="inline-block w-4 h-px bg-slate-300" />
              Scroll to advance
            </p>
          </div>

          {/* Body: sidebar (desktop) + content */}
          <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">

            {/* Desktop step sidebar */}
            <aside className="hidden lg:flex flex-col w-40 shrink-0 pt-1 gap-px">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const isActive = idx === active;
                const isDone = idx < active;
                return (
                  <div
                    key={s.id}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors select-none ${
                      isActive
                        ? "bg-white border border-blue-200 text-blue-700 shadow-sm"
                        : isDone
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : isDone
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {isDone ? "✓" : s.id}
                    </div>
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{s.label}</span>
                  </div>
                );
              })}

              {/* Step progress bar */}
              <div className="mt-3 px-3 flex gap-1 items-center">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      idx < active
                        ? "bg-emerald-400 w-3"
                        : idx === active
                        ? "bg-blue-500 flex-1"
                        : "bg-slate-200 w-3"
                    }`}
                  />
                ))}
              </div>
            </aside>

            {/* Mobile step tabs */}
            <div className="lg:hidden shrink-0 flex gap-1.5 overflow-x-auto pb-0.5 -mx-1 px-1">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const isActive = idx === active;
                const isDone = idx < active;
                return (
                  <div
                    key={s.id}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap border shrink-0 select-none ${
                      isActive
                        ? "bg-white border-blue-200 text-blue-700 shadow-sm"
                        : isDone
                        ? "bg-white border-slate-200 text-emerald-600"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : isDone
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {isDone ? "✓" : s.id}
                    </div>
                    <Icon className="w-3 h-3 shrink-0" />
                    {s.label}
                  </div>
                );
              })}
            </div>

            {/* Content area */}
            <div className="flex-1 min-h-0 flex flex-col gap-2.5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="flex-1 min-h-0 flex flex-col gap-2.5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  {/* Timestamp */}
                  <div className="shrink-0 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-500 font-medium">{step.time}</span>
                    <span className="text-slate-300 text-xs">·</span>
                    <span className="text-xs font-semibold text-slate-700">{step.label}</span>
                  </div>

                  {/* Comparison table */}
                  <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">

                    {/* Table header */}
                    <div className="grid grid-cols-[90px_1fr_1fr] sm:grid-cols-[120px_1fr_1fr] shrink-0 border-b border-slate-200">
                      <div className="px-3 sm:px-4 py-3 bg-slate-50/80 border-r border-slate-200 flex items-center">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                          Aspect
                        </span>
                      </div>
                      <div className="px-3 sm:px-4 py-3 bg-orange-50 border-r border-orange-100/80">
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span className="text-[11px] sm:text-xs font-semibold text-orange-700">
                            Without EaseUp
                          </span>
                        </div>
                      </div>
                      <div className="px-3 sm:px-4 py-3 bg-blue-50">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="text-[11px] sm:text-xs font-semibold text-blue-700">
                            With EaseUp
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Table rows */}
                    <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100">
                      {step.rows.map((row) => (
                        <div
                          key={row.aspect}
                          className="grid grid-cols-[90px_1fr_1fr] sm:grid-cols-[120px_1fr_1fr]"
                        >
                          <div className="px-3 sm:px-4 py-3.5 border-r border-slate-100 bg-slate-50/40 flex items-start">
                            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 leading-snug">
                              {row.aspect}
                            </span>
                          </div>
                          <div className="px-3 sm:px-4 py-3.5 border-r border-orange-50 bg-orange-50/25">
                            <span className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                              {row.before}
                            </span>
                          </div>
                          <div className="px-3 sm:px-4 py-3.5 bg-blue-50/20">
                            <span className="text-[11px] sm:text-xs text-slate-700 leading-relaxed">
                              {row.after}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Per-step summary bar */}
                  <div className="shrink-0 bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3 sm:gap-5">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">
                        Manual effort
                      </p>
                      <p className="text-base sm:text-lg font-extrabold text-orange-500 tracking-tight leading-tight">
                        {step.manualTime}
                      </p>
                    </div>
                    <span className="text-slate-300 text-lg">→</span>
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">
                        With EaseUp
                      </p>
                      <p className="text-base sm:text-lg font-extrabold text-blue-600 tracking-tight leading-tight">
                        {step.easeupTime}
                      </p>
                    </div>

                    {active === steps.length - 1 && (
                      <>
                        <div className="hidden sm:block w-px h-6 bg-slate-200" />
                        <p className="text-xs text-slate-500 flex-1 min-w-[140px]">
                          All 5 steps:{" "}
                          <span className="font-semibold text-orange-500">~7 hrs manual</span>
                          {" → "}
                          <span className="font-semibold text-blue-600">47 min with EaseUp</span>
                        </p>
                        <a
                          href="/contact"
                          className="shrink-0 px-4 py-2 bg-slate-950 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
                        >
                          See a live demo
                        </a>
                      </>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

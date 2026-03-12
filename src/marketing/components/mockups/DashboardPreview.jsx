import { lazy, Suspense } from "react";
import { motion } from "framer-motion";

const AttendanceMockup = lazy(() => import("./AttendanceMockup"));
const PayrollMockup = lazy(() => import("./PayrollMockup"));
const InvoiceMockup = lazy(() => import("./InvoiceMockup"));
const HRAnalyticsMockup = lazy(() => import("./HRAnalyticsMockup"));

const mockupMap = {
  attendance: AttendanceMockup,
  payroll: PayrollMockup,
  invoice: InvoiceMockup,
  analytics: HRAnalyticsMockup,
};

function MockupShell({ children, height }) {
  return (
    <div
      className="rounded-xl overflow-hidden shadow-[0_16px_48px_-8px_rgba(15,23,42,0.12),0_0_0_1px_rgba(0,0,0,0.06)] bg-white"
      style={{ height }}
    >
      {/* Mac chrome */}
      <div className="h-8 bg-[#F0F0F0] flex items-center px-3 gap-2 border-b border-black/[0.07] shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1 bg-white rounded border border-black/[0.09] px-2.5 h-[18px] w-44">
            <svg viewBox="0 0 10 10" className="w-2 h-2 shrink-0 text-slate-400" fill="none">
              <circle cx="4.5" cy="4.5" r="3" stroke="currentColor" strokeWidth="1.2"/>
              <path d="m7 7 1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="text-[9px] text-slate-400 truncate">app.easeupceo.com</span>
          </div>
        </div>
      </div>
      {/* Content */}
      <div style={{ height: `calc(100% - 2rem)` }}>
        {children}
      </div>
    </div>
  );
}

export default function DashboardPreview({
  variant = "attendance",
  className = "",
  animate = true,
  height = 400,
}) {
  const MockupComponent = mockupMap[variant] || AttendanceMockup;

  const content = (
    <MockupShell height={height}>
      <Suspense fallback={<div className="h-full bg-slate-50 animate-pulse" />}>
        <MockupComponent />
      </Suspense>
    </MockupShell>
  );

  if (!animate) return <div className={className}>{content}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {content}
    </motion.div>
  );
}

import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

export default function DashboardPreview({
  variant = "attendance",
  className = "",
  animate = true,
  height = 400,
}) {
  const MockupComponent = mockupMap[variant] || AttendanceMockup;

  const wrapper = (
    <div
      className={cn("w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200/60", className)}
      style={{ height }}
    >
      {/* Browser chrome */}
      <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center px-3 gap-1.5 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        <div className="mx-auto w-40 h-4 bg-white rounded-md border border-slate-200 flex items-center px-2">
          <span className="text-[9px] text-slate-400 truncate">app.easeupceo.com/dashboard</span>
        </div>
      </div>
      {/* Mockup content */}
      <div className="h-[calc(100%-2rem)]">
        <Suspense fallback={<div className="h-full bg-slate-50 animate-pulse" />}>
          <MockupComponent />
        </Suspense>
      </div>
    </div>
  );

  if (!animate) return wrapper;

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, rotateY: -6 }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
      className={className}
    >
      <div
        className="w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200/60"
        style={{ height }}
      >
        <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center px-3 gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <div className="mx-auto w-40 h-4 bg-white rounded-md border border-slate-200 flex items-center px-2">
            <span className="text-[9px] text-slate-400 truncate">app.easeupceo.com/dashboard</span>
          </div>
        </div>
        <div className="h-[calc(100%-2rem)]">
          <Suspense fallback={<div className="h-full bg-slate-50 animate-pulse" />}>
            <MockupComponent />
          </Suspense>
        </div>
      </div>
    </motion.div>
  );
}

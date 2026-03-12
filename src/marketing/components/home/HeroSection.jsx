import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import CTAButton from "../shared/CTAButton";
import DashboardPreview from "../mockups/DashboardPreview";

export default function HeroSection() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Subtle top tint */}
      <div className="absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-slate-50/80 to-white pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-0">
        {/* Center text block */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 mb-7"
          >
            <span className="h-px w-5 bg-blue-400 shrink-0" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest whitespace-nowrap">
              Built for Indian businesses
            </span>
            <span className="h-px w-5 bg-blue-400 shrink-0" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.07 }}
            className="text-5xl sm:text-6xl lg:text-[4.25rem] font-extrabold text-slate-950 tracking-tight leading-[1.06] mb-6"
          >
            Run payroll for{" "}
            <br className="hidden sm:block" />
            150 employees{" "}
            <span className="text-gradient-brand">in&nbsp;12&nbsp;minutes.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="text-[1.1rem] text-slate-500 leading-relaxed max-w-[480px] mx-auto mb-9"
          >
            Attendance, salaries, PF, ESI, TDS, and GST invoicing — all handled
            automatically. The one HR platform your team will actually enjoy using.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6"
          >
            <CTAButton href="/app/login" variant="primary" size="lg">
              Get started free
              <ArrowRight className="w-4 h-4" />
            </CTAButton>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors px-2 py-3"
            >
              See how it works
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.34 }}
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
          >
            {[
              "No credit card needed",
              "Free 14-day trial",
              "Indian compliance built-in",
            ].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Dashboard — large, centered, prominent */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-5xl"
        >
          {/* Soft glow */}
          <div className="absolute -inset-x-4 top-6 bottom-0 bg-gradient-to-b from-blue-100/40 via-indigo-50/20 to-transparent rounded-3xl blur-2xl pointer-events-none" />

          <div className="relative rounded-xl overflow-hidden shadow-[0_28px_70px_-8px_rgba(59,130,246,0.2),0_0_0_1px_rgba(0,0,0,0.07)]">
            {/* Mac-style window chrome */}
            <div className="h-9 bg-[#F0F0F0] flex items-center px-4 gap-2 border-b border-black/[0.08]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-1.5 bg-white rounded-md border border-black/10 px-3 h-[22px] w-52">
                  <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 shrink-0 text-slate-400" fill="none">
                    <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="m8.5 8.5 2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <span className="text-[10px] text-slate-400 truncate">app.easeupceo.com/dashboard</span>
                </div>
              </div>
            </div>
            {/* Live dashboard content */}
            <div style={{ height: 460 }}>
              <DashboardPreview variant="attendance" animate={false} height={460} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

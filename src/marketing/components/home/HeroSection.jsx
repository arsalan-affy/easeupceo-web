import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle, Sparkles, TrendingUp } from "lucide-react";
import CTAButton from "../shared/CTAButton";
import DashboardPreview from "../mockups/DashboardPreview";

const highlights = [
  "No credit card required",
  "Free 14-day trial",
  "Setup in 5 minutes",
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero min-h-screen flex items-center pt-16">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-6"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold">
                <Sparkles className="w-3 h-3" />
                AI-Powered HR Platform
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold">
                New: Smart Payroll →
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6"
            >
              HR Operations,{" "}
              <span className="text-gradient-brand">Simplified</span>
              <br />
              for Modern Teams
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg"
            >
              Worklynx automates attendance tracking, payroll processing, and
              invoicing — so your HR team can focus on people, not paperwork.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <CTAButton href="https://app.worklynx.io/signup" external variant="primary" size="lg">
                Start Free Demo
                <ArrowRight className="w-4 h-4" />
              </CTAButton>
              <CTAButton href="/how-it-works" variant="secondary" size="lg">
                <Play className="w-4 h-4 fill-current" />
                Watch How It Works
              </CTAButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              {highlights.map((h) => (
                <div key={h} className="flex items-center gap-1.5 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  {h}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Dashboard Preview */}
          <div className="relative w-full min-w-0">
            {/* Dashboard clipped separately so badges aren't clipped */}
            <div className="overflow-hidden rounded-2xl">
              <DashboardPreview variant="attendance" height={420} />
            </div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute left-2 top-1/4 glass-card rounded-xl px-3 py-2 shadow-lg hidden lg:flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500">Efficiency</p>
                <p className="text-xs font-bold text-slate-800">+24% YoY</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute right-2 bottom-1/4 glass-card rounded-xl px-3 py-2 shadow-lg hidden lg:flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500">Payroll accuracy</p>
                <p className="text-xs font-bold text-slate-800">99.8%</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

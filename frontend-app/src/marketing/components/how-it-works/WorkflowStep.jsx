import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function WorkflowStep({ step, icon: Icon, title, description, isLast, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      className="relative flex gap-6"
    >
      {/* Left: Number + Line */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg shadow-blue-500/25 z-10">
          {step}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 mt-3 bg-gradient-to-b from-blue-300 to-transparent min-h-[48px]" />
        )}
      </div>

      {/* Right: Content */}
      <div className={cn("pb-12", isLast && "pb-0")}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Icon className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed max-w-md">{description}</p>
      </div>
    </motion.div>
  );
}

import { Check, Minus, Zap, Users } from "lucide-react";
import { motion } from "framer-motion";
import CTAButton from "../shared/CTAButton";
import { cn } from "@/lib/utils";

export default function PricingCard({ plan, isAnnual }) {
  const { name, monthlyPrice, annualPrice, annualTotal, employees, desc, features, cta, ctaHref, highlighted, badge } = plan;
  const price = isAnnual ? annualPrice : monthlyPrice;
  const isCustom = price === null;
  const savings = isAnnual && !isCustom && annualTotal ? monthlyPrice * 12 - annualTotal : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative flex flex-col rounded-2xl p-7 h-full",
        highlighted
          ? "gradient-brand text-white shadow-2xl shadow-blue-500/30"
          : "bg-white border border-slate-200 hover:shadow-xl transition-shadow"
      )}
    >
      {badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1 px-3 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full shadow">
            <Zap className="w-3 h-3" /> {badge}
          </span>
        </div>
      )}

      {/* Plan header */}
      <div className="mb-6">
        <h3 className={cn("text-xs font-bold uppercase tracking-widest mb-3", highlighted ? "text-blue-100" : "text-slate-500")}>
          {name}
        </h3>
        <div className="flex items-end gap-1 mb-1">
          {isCustom ? (
            <span className={cn("text-3xl font-bold", highlighted ? "text-white" : "text-slate-900")}>Custom</span>
          ) : (
            <>
              <span className={cn("text-3xl font-bold", highlighted ? "text-white" : "text-slate-900")}>
                ₹{price.toLocaleString("en-IN")}
              </span>
              <span className={cn("text-sm mb-1.5", highlighted ? "text-blue-100" : "text-slate-500")}>/mo</span>
            </>
          )}
        </div>
        {isAnnual && !isCustom && (
          <div className="flex items-center gap-2 mt-1">
            <p className={cn("text-xs", highlighted ? "text-blue-100" : "text-slate-500")}>
              Billed ₹{(annualTotal ?? price * 12).toLocaleString("en-IN")}/yr
            </p>
            {savings > 0 && (
              <span className={cn(
                "px-1.5 py-0.5 text-xs font-semibold rounded-full",
                highlighted ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
              )}>
                Save ₹{savings.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        )}
        <p className={cn("text-sm mt-2", highlighted ? "text-blue-100" : "text-slate-500")}>{desc}</p>
        {employees && (
          <div className={cn("flex items-center gap-1.5 mt-2 text-xs font-medium", highlighted ? "text-blue-100" : "text-slate-500")}>
            <Users className="w-3.5 h-3.5" />
            {employees}
          </div>
        )}
      </div>

      {/* Features list */}
      <ul className="space-y-3 flex-1 mb-7">
        {features.map((f) => (
          <li key={f.label} className="flex items-start gap-3 text-sm">
            {f.included ? (
              <div className={cn("w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5", highlighted ? "bg-white/20" : "bg-blue-50")}>
                <Check className={cn("w-2.5 h-2.5", highlighted ? "text-white" : "text-blue-600")} />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-slate-50">
                <Minus className="w-2.5 h-2.5 text-slate-400" />
              </div>
            )}
            <span className={cn(f.included ? "" : "opacity-40", highlighted ? "text-blue-50" : "text-slate-600")}>
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      <CTAButton href={ctaHref} external={ctaHref?.startsWith("http")} variant={highlighted ? "outline" : "primary"} size="md" className="w-full justify-center">
        {cta}
      </CTAButton>
    </motion.div>
  );
}

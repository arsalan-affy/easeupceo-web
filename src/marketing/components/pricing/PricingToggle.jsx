import { Switch } from "@/components/ui/switch";

export default function PricingToggle({ isAnnual, onChange }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-10">
      <span className={`text-sm font-medium ${!isAnnual ? "text-slate-900" : "text-slate-500"}`}>Monthly</span>
      <Switch checked={isAnnual} onCheckedChange={onChange} />
      <span className={`text-sm font-medium ${isAnnual ? "text-slate-900" : "text-slate-500"}`}>
        Annual
      </span>
      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
        Save 20%
      </span>
    </div>
  );
}

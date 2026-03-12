import AnimatedSection from "../shared/AnimatedSection";

const metrics = [
  { value: "500+", label: "companies" },
  { value: "50,000+", label: "employees managed" },
  { value: "₹200Cr+", label: "payroll monthly" },
  { value: "99.9%", label: "uptime" },
];

const companies = [
  "RetailNXT", "Meridian Mfg.", "Apex Consulting",
  "GrowFast Retail", "Bharat Logistics", "TechNova",
];

export default function TrustSection() {
  return (
    <section className="py-14 border-t border-b border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metrics row — horizontal, clean */}
        <AnimatedSection className="flex flex-wrap items-center justify-center gap-y-4 mb-9">
          {metrics.map((m, i) => (
            <div key={m.label} className="flex items-center">
              <div className="px-6 sm:px-10 text-center">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{m.value}</span>
                <span className="text-sm text-slate-400 ml-1.5 font-medium">{m.label}</span>
              </div>
              {i < metrics.length - 1 && (
                <div className="w-px h-5 bg-slate-200 shrink-0" />
              )}
            </div>
          ))}
        </AnimatedSection>

        {/* Company names — text only */}
        <AnimatedSection delay={0.1} className="text-center">
          <p className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-widest">
            Trusted by finance and HR teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
            {companies.map((name) => (
              <span
                key={name}
                className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-default"
              >
                {name}
              </span>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

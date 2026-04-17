import AnimatedSection from "../shared/AnimatedSection";

const stats = [
  { value: "500+", label: "Companies Trust Us" },
  { value: "50K+", label: "Users on Platform" },
  { value: "10M+", label: "Transactions Processed" },
  { value: "99.9%", label: "Uptime SLA" },
];

const logos = [
  { name: "Tata Group", initials: "TG", color: "bg-blue-100 text-blue-700" },
  { name: "Infosys", initials: "IN", color: "bg-indigo-100 text-indigo-700" },
  { name: "Wipro", initials: "WP", color: "bg-violet-100 text-violet-700" },
  { name: "HCL Tech", initials: "HC", color: "bg-sky-100 text-sky-700" },
  { name: "Mahindra", initials: "MM", color: "bg-blue-100 text-blue-700" },
  { name: "Bajaj Auto", initials: "BA", color: "bg-indigo-100 text-indigo-700" },
];

export default function TrustSection() {
  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <AnimatedSection className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-gradient-brand">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </AnimatedSection>

        {/* Logos */}
        <AnimatedSection delay={0.15} className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">
            Trusted by leading companies worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {logos.map((logo) => (
              <div
                key={logo.name}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className={`w-7 h-7 rounded-md ${logo.color} flex items-center justify-center text-xs font-bold`}>
                  {logo.initials}
                </div>
                <span className="text-sm font-medium text-slate-600">{logo.name}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

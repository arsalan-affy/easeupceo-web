import AnimatedSection from "../shared/AnimatedSection";

const stats = [
  { value: "500+", label: "Companies Trust Us" },
  { value: "50K+", label: "Users on Platform" },
  { value: "99.9%", label: "Uptime SLA" },
];

export default function TrustSection() {
  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-gradient-brand">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}

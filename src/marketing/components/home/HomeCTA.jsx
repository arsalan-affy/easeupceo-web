import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "../shared/AnimatedSection";
import CTAButton from "../shared/CTAButton";

export default function HomeCTA() {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-5">
            Get started today
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight mb-5">
            Most teams go live
            <br />
            <span className="text-gradient-brand">in one afternoon.</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-md mx-auto mb-10 leading-relaxed">
            Free plan available. No setup fee. Our onboarding team is on standby
            to get your first payroll run done right.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <CTAButton href="/app/login" variant="primary" size="lg">
              Start for free
              <ArrowRight className="w-4 h-4" />
            </CTAButton>
            <CTAButton href="/contact" variant="secondary" size="lg">
              Talk to us first
            </CTAButton>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              "No credit card required",
              "Free migration assistance",
              "Cancel anytime",
            ].map((item) => (
              <span key={item} className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                {item}
              </span>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

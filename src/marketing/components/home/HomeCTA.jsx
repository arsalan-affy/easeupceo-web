import { ArrowRight, Sparkles } from "lucide-react";
import CTAButton from "../shared/CTAButton";
import AnimatedSection from "../shared/AnimatedSection";

export default function HomeCTA() {
  return (
    <section className="py-24 gradient-brand relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold mb-6 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            14-day free trial · No credit card required
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Ready to simplify<br className="hidden sm:block" /> your HR operations?
          </h2>

          <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Join hundreds of businesses using Worklynx to manage payroll, attendance, and people — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButton href="https://one.inkapps.io/signup" external variant="outline" size="lg" className="w-full sm:w-auto">
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </CTAButton>
            <CTAButton href="/contact" variant="outline" size="lg" className="w-full sm:w-auto opacity-80 hover:opacity-100">
              Contact Sales
            </CTAButton>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

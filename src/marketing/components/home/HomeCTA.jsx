import { ArrowRight, Calendar } from "lucide-react";
import AnimatedSection from "../shared/AnimatedSection";
import CTAButton from "../shared/CTAButton";

export default function HomeCTA() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="relative overflow-hidden gradient-brand rounded-3xl px-5 py-12 sm:px-8 sm:py-16 text-center">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full" />
            </div>

            <div className="relative">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-5">
                🚀 Start your free trial today
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto leading-tight">
                Ready to Transform Your HR Operations?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-lg mx-auto">
                Join 500+ companies using EaseUp HRMS. Get started in minutes, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <CTAButton href="/app/login" variant="outline" size="lg">
                  Start Free Demo
                  <ArrowRight className="w-4 h-4" />
                </CTAButton>
                <CTAButton href="/contact" variant="ghost" size="lg" className="text-white hover:bg-white/10 border-2 border-white/30">
                  <Calendar className="w-4 h-4" />
                  Book a Demo
                </CTAButton>
              </div>
              <p className="text-blue-200 text-sm mt-6">
                Free 14-day trial · No setup fees · Cancel anytime
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

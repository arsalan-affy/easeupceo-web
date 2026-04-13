import { Check } from "lucide-react";
import AnimatedSection from "../shared/AnimatedSection";
import DashboardPreview from "../mockups/DashboardPreview";
import CTAButton from "../shared/CTAButton";

export default function FeatureBlock({ feature, reverse = false }) {
  const { icon: Icon, title, description, benefits, mockupVariant, color, lightColor, textColor } = feature;

  return (
    <div className={`grid lg:grid-cols-2 gap-12 items-center py-16 ${reverse ? "" : ""}`}>
      <AnimatedSection direction={reverse ? "right" : "left"} className={reverse ? "lg:order-2" : ""}>
        <div className={`w-12 h-12 rounded-xl ${lightColor} flex items-center justify-center mb-5`}>
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{title}</h3>
        <p className="text-slate-500 leading-relaxed mb-6 text-base">{description}</p>
        <ul className="space-y-3 mb-8">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm text-slate-700">
              <div className={`w-5 h-5 rounded-full ${lightColor} flex items-center justify-center shrink-0 mt-0.5`}>
                <Check className={`w-3 h-3 ${textColor}`} />
              </div>
              {b}
            </li>
          ))}
        </ul>
        <CTAButton href="https://app.worklynx.io/signup" external variant="primary" size="md">
          Try This Feature Free
        </CTAButton>
      </AnimatedSection>

      <AnimatedSection direction={reverse ? "left" : "right"} delay={0.1} className={`w-full min-w-0 overflow-hidden${reverse ? " lg:order-1" : ""}`}>
        <DashboardPreview variant={mockupVariant} height={380} />
      </AnimatedSection>
    </div>
  );
}

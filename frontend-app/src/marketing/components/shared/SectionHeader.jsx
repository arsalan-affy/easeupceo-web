import { cn } from "@/lib/utils";
import AnimatedSection from "./AnimatedSection";

export default function SectionHeader({
  eyebrow,
  heading,
  subtext,
  align = "center",
  className = "",
  light = false,
}) {
  const alignClass =
    align === "left" ? "text-left items-start" : align === "right" ? "text-right items-end" : "text-center items-center";

  return (
    <AnimatedSection className={cn("flex flex-col gap-3 mb-12", alignClass, className)}>
      {eyebrow && (
        <span className={cn(
          "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest",
          light
            ? "bg-white/20 text-white"
            : "bg-blue-50 text-blue-600 border border-blue-100"
        )}>
          {eyebrow}
        </span>
      )}
      <h2 className={cn(
        "text-3xl sm:text-4xl font-bold leading-tight",
        light ? "text-white" : "text-slate-900"
      )}>
        {heading}
      </h2>
      {subtext && (
        <p className={cn(
          "text-base sm:text-lg max-w-2xl leading-relaxed",
          light ? "text-blue-100" : "text-slate-500",
          align === "center" && "mx-auto"
        )}>
          {subtext}
        </p>
      )}
    </AnimatedSection>
  );
}

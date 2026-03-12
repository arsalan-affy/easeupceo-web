import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AnimatedSection from "../shared/AnimatedSection";

const testimonials = [
  {
    quote: "Our HR manager used to stay back every month-end to close payroll. Now she leaves at 5 PM. That's the real win.",
    name: "Suresh B.",
    role: "Finance Head",
    company: "RetailNXT",
    initials: "SB",
    detail: "300 employees, 4 cities",
    color: "bg-blue-600",
  },
  {
    quote: "We have three offices across Karnataka. Before EaseUp, reconciling attendance across locations was a weekly nightmare. It just happens now.",
    name: "Anita K.",
    role: "HR Manager",
    company: "Meridian Mfg.",
    initials: "AK",
    detail: "Biometric + GPS setup",
    color: "bg-indigo-600",
  },
  {
    quote: "I was skeptical about migrating from Tally. The data migration took one afternoon and we haven't looked back.",
    name: "Mohit R.",
    role: "Managing Director",
    company: "Apex Consulting",
    initials: "MR",
    detail: "Migrated in 4 hours",
    color: "bg-violet-600",
  },
  {
    quote: "PF and ESI used to mean two days of manual calculation. Now I click one button and the challans are ready.",
    name: "Deepa N.",
    role: "Accounts Manager",
    company: "GrowFast Retail",
    initials: "DN",
    detail: "80 employees",
    color: "bg-blue-600",
  },
  {
    quote: "Support team onboarded us over a single call. No tickets, no back-and-forth emails. Just done.",
    name: "Vikram S.",
    role: "Operations Head",
    company: "Bharat Logistics",
    initials: "VS",
    detail: "Onboarded in 1 day",
    color: "bg-indigo-600",
  },
];

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function TestimonialsCarousel() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <AnimatedSection className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">
              What customers say
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
              HR teams across India
              <br className="hidden sm:block" /> trust EaseUp daily.
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-xs">
            Real quotes from real HR managers and finance heads — not marketing speak.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-5">
              {testimonials.map((t) => (
                <CarouselItem key={t.name} className="pl-5 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full flex flex-col bg-white border border-slate-100 rounded-xl p-6 hover:border-slate-200 hover:shadow-md transition-all duration-200">
                    <Stars />
                    <blockquote className="mt-4 text-slate-700 text-[0.925rem] leading-relaxed flex-1">
                      "{t.quote}"
                    </blockquote>
                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg ${t.color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                        {t.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 leading-tight">{t.name}</p>
                        <p className="text-xs text-slate-500 leading-tight mt-0.5">
                          {t.role} · {t.company}
                        </p>
                      </div>
                      <span className="ml-auto text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-100 rounded-md px-2 py-1 whitespace-nowrap shrink-0">
                        {t.detail}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-3 hidden md:flex h-8 w-8" />
            <CarouselNext className="-right-3 hidden md:flex h-8 w-8" />
          </Carousel>
        </AnimatedSection>
      </div>
    </section>
  );
}

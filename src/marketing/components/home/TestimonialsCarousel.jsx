import { Star, Quote } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import SectionHeader from "../shared/SectionHeader";
import AnimatedSection from "../shared/AnimatedSection";

const testimonials = [
  {
    quote: "EaseUpCEOs transformed our HR operations overnight. Payroll that used to take 3 days now runs in 30 minutes. Absolutely game-changing.",
    name: "Rajesh Kumar",
    role: "HR Director",
    company: "TechNova Solutions",
    initials: "RK",
    color: "bg-blue-100 text-blue-700",
  },
  {
    quote: "The attendance module with GPS tracking solved our remote workforce challenges completely. Real-time visibility into 200+ employees across India.",
    name: "Priya Sharma",
    role: "Chief People Officer",
    company: "GrowFast Retail",
    initials: "PS",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    quote: "We reduced payroll errors by 99% and our employees actually love the self-service portal. EaseUp pays for itself every month.",
    name: "Arun Mehta",
    role: "Managing Director",
    company: "Meridian Manufacturing",
    initials: "AM",
    color: "bg-violet-100 text-violet-700",
  },
  {
    quote: "The invoicing features are top-notch. GST compliance, auto-reminders, and financial reporting — everything our finance team needed.",
    name: "Sunita Patel",
    role: "Finance Manager",
    company: "Apex Consulting Group",
    initials: "SP",
    color: "bg-sky-100 text-sky-700",
  },
  {
    quote: "Setup took less than an hour. The onboarding team was exceptional, and the platform is incredibly intuitive even for non-tech HR staff.",
    name: "Vikram Singh",
    role: "Operations Head",
    company: "Bharat Logistics",
    initials: "VS",
    color: "bg-blue-100 text-blue-700",
  },
];

export default function TestimonialsCarousel() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Customer Stories"
          heading={
            <>
              Loved by HR Teams{" "}
              <span className="text-gradient-brand">Across India</span>
            </>
          }
          subtext="Join 500+ companies that have transformed their HR operations with EaseUp."
        />

        <AnimatedSection delay={0.1}>
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {testimonials.map((t) => (
                <CarouselItem key={t.name} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col">
                    <Quote className="w-8 h-8 text-blue-100 mb-4" />
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-6">
                      "{t.quote}"
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                      <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-sm font-bold shrink-0`}>
                        {t.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                        <p className="text-xs text-slate-500">{t.role} · {t.company}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 hidden md:flex" />
            <CarouselNext className="-right-4 hidden md:flex" />
          </Carousel>
        </AnimatedSection>
      </div>
    </section>
  );
}

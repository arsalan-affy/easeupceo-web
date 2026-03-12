import { useEffect } from "react";
import { Target, Heart, Lightbulb, Shield, Globe, TrendingUp } from "lucide-react";
import SectionHeader from "../components/shared/SectionHeader";
import AnimatedSection, { StaggerContainer, StaggerItem } from "../components/shared/AnimatedSection";
import HomeCTA from "../components/home/HomeCTA";
import CTAButton from "../components/shared/CTAButton";

const team = [
  { name: "Arjun Kapoor", role: "CEO & Co-Founder", bio: "Former HR tech lead at Infosys with 12+ years building enterprise software.", initials: "AK", color: "bg-blue-100 text-blue-700" },
  { name: "Priya Menon", role: "CTO & Co-Founder", bio: "Ex-Google engineer passionate about making complex HR workflows simple.", initials: "PM", color: "bg-indigo-100 text-indigo-700" },
  { name: "Rahul Desai", role: "Head of Product", bio: "Product manager who has shipped HR software used by 100K+ employees.", initials: "RD", color: "bg-violet-100 text-violet-700" },
  { name: "Sneha Iyer", role: "Head of Customer Success", bio: "Dedicated to ensuring every customer gets maximum value from EaseUp.", initials: "SI", color: "bg-sky-100 text-sky-700" },
  { name: "Vikash Sharma", role: "Head of Engineering", bio: "Full-stack architect focused on building secure, scalable HR systems.", initials: "VS", color: "bg-blue-100 text-blue-700" },
  { name: "Ananya Bose", role: "Head of Compliance", bio: "CA and legal expert ensuring EaseUp stays ahead of Indian labour laws.", initials: "AB", color: "bg-indigo-100 text-indigo-700" },
];

const values = [
  { icon: Heart, title: "People First", desc: "We build every feature with the end-user in mind — both HR professionals and the employees they serve.", color: "bg-rose-50 text-rose-600" },
  { icon: Shield, title: "Trustworthy & Secure", desc: "Enterprise-grade security, SOC 2 compliant, and fully aligned with Indian data protection regulations.", color: "bg-blue-50 text-blue-600" },
  { icon: Lightbulb, title: "Always Innovating", desc: "We continuously improve our platform based on customer feedback and emerging HR technology trends.", color: "bg-amber-50 text-amber-600" },
  { icon: Globe, title: "Built for India", desc: "Every compliance rule, every tax regulation, every state-specific labour law — we have it covered.", color: "bg-emerald-50 text-emerald-600" },
];

export default function AboutPage() {
  useEffect(() => {
    document.title = "About Us — EaseUp HRMS";
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-6">
                Our Story
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                We're on a Mission to Make HR{" "}
                <span className="text-gradient-brand">Human Again</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                EaseUp was born from a simple frustration: HR professionals spending more time on spreadsheets than on their people.
                Founded in 2021 in Bengaluru, we set out to build the HR platform we always wished existed.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
              <p className="text-slate-600 leading-relaxed mb-5">
                In 2021, our founders — veterans of Infosys, Google, and KPMG — witnessed firsthand how India's mid-market companies struggled with fragmented HR tools. Attendance was tracked in Excel, payroll was a monthly nightmare, and compliance errors were costly.
              </p>
              <p className="text-slate-600 leading-relaxed mb-5">
                We spent 18 months talking to 200+ HR managers before writing a single line of code. What we learned shaped every feature of EaseUp: Indian businesses needed something that was powerful enough for enterprise needs but simple enough for a 10-person team.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                Today, EaseUp serves 500+ companies across India, managing 50,000+ employees and processing over ₹200 crores in payroll monthly. But our mission remains unchanged: make HR operations invisible so companies can focus on what matters — their people.
              </p>
              <CTAButton href="/contact" variant="primary" size="md">
                Get in Touch
              </CTAButton>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1}>
              {/* Timeline */}
              <div className="space-y-6">
                {[
                  { year: "2021", event: "Founded in Bengaluru. 18 months of customer research.", color: "bg-blue-500" },
                  { year: "2022", event: "Launched MVP. First 50 customers in 3 months.", color: "bg-indigo-500" },
                  { year: "2023", event: "Series A funding. Expanded to 200+ companies.", color: "bg-violet-500" },
                  { year: "2024", event: "Launched AI analytics and invoicing module.", color: "bg-blue-500" },
                  { year: "2025", event: "500+ companies, 50,000+ employees on platform.", color: "bg-indigo-500" },
                  { year: "2026", event: "Expanding to Southeast Asian markets.", color: "bg-violet-500" },
                ].map((item) => (
                  <div key={item.year} className="flex items-start gap-4">
                    <div className={`w-12 h-7 rounded-lg ${item.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {item.year}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed pt-1">{item.event}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="What Drives Us"
            heading="Mission & Vision"
            subtext="The principles that guide every decision we make at EaseUp."
          />

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <AnimatedSection direction="left">
              <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm h-full">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
                <p className="text-slate-600 leading-relaxed">
                  To eliminate HR administrative burden for every business in India — making HR operations so seamless that HR professionals can dedicate 100% of their time to their people and culture.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1}>
              <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm h-full">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-5">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h3>
                <p className="text-slate-600 leading-relaxed">
                  A future where every growing business — from a 10-person startup to a 10,000-person enterprise — has access to the same world-class HR technology, regardless of their size or budget.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Our Values"
            heading="The Principles We Live By"
          />
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:shadow-lg transition-shadow h-full">
                  <div className={`w-10 h-10 rounded-xl ${v.color} flex items-center justify-center mb-4`}>
                    <v.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">{v.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="The Team"
            heading={<>Meet the People Behind <span className="text-gradient-brand">EaseUp</span></>}
            subtext="A passionate team of HR tech veterans, engineers, and compliance experts."
          />
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:shadow-lg transition-shadow flex gap-4">
                  <div className={`w-12 h-12 rounded-xl ${member.color} flex items-center justify-center text-lg font-bold shrink-0`}>
                    {member.initials}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{member.name}</h4>
                    <p className="text-xs font-semibold text-blue-600 mb-2">{member.role}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <HomeCTA />
    </>
  );
}

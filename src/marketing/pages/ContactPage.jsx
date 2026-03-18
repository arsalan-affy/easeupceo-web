import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Clock, CheckCircle, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SectionHeader from "../components/shared/SectionHeader";
import CTAButton from "../components/shared/CTAButton";
import AnimatedSection from "../components/shared/AnimatedSection";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().min(1, "Company name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  module: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const faqs = [
  { q: "How do I get started with EaseUpCEOs?", a: "Simply sign up for our Free tier — no credit card required. You'll be guided through a quick setup wizard that gets you running in under 5 minutes." },
  { q: "Does EaseUp support biometric device integration?", a: "Yes! EaseUp integrates with all major biometric brands including ZKTeco, eSSL, Suprema, and Hikvision. Our support team assists with device configuration at no extra cost." },
  { q: "Is EaseUp compliant with Indian labour laws?", a: "Absolutely. EaseUp is built to handle PF, ESI, TDS, professional tax, gratuity, and state-specific compliance requirements. We update the platform immediately whenever regulations change." },
  { q: "Can I migrate data from my existing HR software?", a: "Yes. We provide free data migration assistance for all paid plans. Our team can import employee data, historical payroll, and attendance records from most popular HR systems." },
  { q: "What kind of support do you offer?", a: "Free plan includes email support. Starter plan includes priority email and live chat (9 AM–6 PM IST). Enterprise plans get a dedicated account manager and 24/7 phone support." },
  { q: "How secure is our data on EaseUp?", a: "EaseUp is hosted on AWS Mumbai region with 256-bit encryption, daily backups, and SOC 2 compliance. We never share your data with third parties." },
  { q: "Can we try the platform before purchasing?", a: "Every new account starts with a free 14-day trial of the Starter plan — no credit card needed. You can upgrade or downgrade at any time." },
  { q: "Do you offer training for our HR team?", a: "Yes! We offer free onboarding sessions for all plans, and recorded video tutorials are available 24/7 in our help center. Enterprise plans include custom training sessions." },
];

const contactInfo = [
  { icon: Mail, label: "Email us", value: "info@affyclouditsolutions.com", href: "mailto:info@affyclouditsolutions.com" },
  { icon: Phone, label: "Call us", value: "+91-8962760262", href: "tel:+918962760262" },
  { icon: MapPin, label: "Visit us", value: "Block A, E68, Housing Board Colony, Beside Kidz Castel School, Koh-e-fiza, Bhopal, Madhya Pradesh 462030", href: null },
  { icon: Clock, label: "Business hours", value: "Mon–Fri, 9 AM to 6 PM IST", href: null },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Contact — EaseUpCEOs";
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            eyebrow="Get in Touch"
            heading={<>We're Here to <span className="text-gradient-brand">Help You</span></>}
            subtext="Have questions? Our team is ready to assist you. We typically respond within 2 business hours."
            className="mb-0"
          />
        </div>
      </section>

      {/* Contact form + info */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <AnimatedSection direction="left">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Send Us a Message</h3>
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Message Sent!</h4>
                    <p className="text-slate-500 text-sm">
                      Thanks for reaching out. We'll get back to you within 2 business hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium text-slate-700 mb-1.5 block">
                          Full Name *
                        </Label>
                        <Input id="name" placeholder="Arjun Sharma" {...register("name")}
                          className={errors.name ? "border-red-300" : ""} />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="company" className="text-sm font-medium text-slate-700 mb-1.5 block">
                          Company Name *
                        </Label>
                        <Input id="company" placeholder="Acme Corp" {...register("company")}
                          className={errors.company ? "border-red-300" : ""} />
                        {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company.message}</p>}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-slate-700 mb-1.5 block">
                          Work Email *
                        </Label>
                        <Input id="email" type="email" placeholder="you@company.com" {...register("email")}
                          className={errors.email ? "border-red-300" : ""} />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium text-slate-700 mb-1.5 block">
                          Phone (optional)
                        </Label>
                        <Input id="phone" placeholder="+91 98765 43210" {...register("phone")} />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-1.5 block">
                        Interested In
                      </Label>
                      <Select onValueChange={(v) => setValue("module", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a module..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="attendance">Attendance Management</SelectItem>
                          <SelectItem value="payroll">Payroll Automation</SelectItem>
                          <SelectItem value="invoicing">Invoicing & Billing</SelectItem>
                          <SelectItem value="analytics">HR Analytics</SelectItem>
                          <SelectItem value="all">Full HRMS Platform</SelectItem>
                          <SelectItem value="enterprise">Enterprise Plan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-sm font-medium text-slate-700 mb-1.5 block">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        rows={4}
                        placeholder="Tell us about your HR needs and team size..."
                        {...register("message")}
                        className={errors.message ? "border-red-300 resize-none" : "resize-none"}
                      />
                      {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                    </div>
                    <CTAButton variant="primary" size="md" className="w-full justify-center">
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </CTAButton>
                  </form>
                )}
              </div>
            </AnimatedSection>

            {/* Info */}
            <AnimatedSection direction="right" delay={0.1} className="flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-5">Contact Information</h3>
                <div className="space-y-4">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-slate-800">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="flex-1 min-h-[200px] rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center">
                <div className="text-center px-4">
                  <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Koh-e-fiza, Bhopal</p>
                  <p className="text-xs text-slate-500 mt-1">Madhya Pradesh, India 462030</p>
                  <p className="text-xs text-slate-400 mt-1">Affy Cloud IT Solutions</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 gradient-hero">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="FAQ"
            heading="Frequently Asked Questions"
            subtext="Everything you need to know before getting started."
          />
          <AnimatedSection>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="bg-white rounded-xl border border-slate-100 px-6 shadow-sm"
                >
                  <AccordionTrigger className="text-sm font-semibold text-slate-900 hover:no-underline py-5 text-left">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-slate-600 leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

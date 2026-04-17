import { useEffect } from "react";
import { FileText } from "lucide-react";

const COMPANY = "Worklynx";
const PRODUCT = "Worklynx";
const EMAIL = "support@worklynx.io";
const ADDRESS = "Bhopal, Madhya Pradesh, India";
const EFFECTIVE = "18 March 2026";

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-bold text-slate-900 mb-3">{title}</h2>
      <div className="text-slate-600 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function TermsOfServicePage() {
  useEffect(() => {
    document.title = "Terms of Service — Worklynx";
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <section className="pt-32 pb-12 gradient-hero">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Terms of Service</h1>
          <p className="text-slate-500 text-sm">Effective date: {EFFECTIVE}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section title="1. Acceptance of Terms">
            <p>
              By accessing or using {PRODUCT} ("the Service") provided by {COMPANY} ("Company", "we", "us", "our"), you ("Customer", "you", "your") agree to be bound by these Terms of Service ("Terms"). If you do not agree, please do not use the Service.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you and {COMPANY}. If you are using the Service on behalf of a company or organisation, you represent that you have the authority to bind that entity to these Terms.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              {PRODUCT} is a cloud-based business management platform offering modules including but not limited to accounting, inventory management, sales & invoicing, purchases, employee management, and reporting — with optional add-on modules for payroll, attendance, and leave management. The Service is provided on a subscription basis.
            </p>
          </Section>

          <Section title="3. Account Registration">
            <p>
              You must register for an account to access the Service. You agree to provide accurate, current, and complete information during registration and to keep your account credentials confidential. You are responsible for all activity that occurs under your account.
            </p>
            <p>
              You must notify us immediately at {EMAIL} if you suspect any unauthorised use of your account.
            </p>
          </Section>

          <Section title="4. Subscription & Payment">
            <p>
              Access to paid features requires a valid subscription. Subscription fees are billed in advance on a monthly basis. All fees are exclusive of applicable taxes.
            </p>
            <p>
              Payments are due on the billing date. Failure to pay within 7 days of the due date may result in suspension of your account.
            </p>
            <p>
              We reserve the right to modify pricing with 30 days' advance notice. Continued use after the notice period constitutes acceptance of the revised pricing.
            </p>
          </Section>

          <Section title="5. Free Trial">
            <p>
              New customers may receive a 30-day free trial of the Service. No credit card is required to begin a trial. At the end of the trial, you must subscribe to a paid plan to continue using the Service. We reserve the right to modify or terminate the free trial at any time without notice.
            </p>
          </Section>

          <Section title="6. Customer Data & Ownership">
            <p>
              You retain full ownership of all data you upload or input into the Service ("Customer Data"). We process your Customer Data solely to provide the Service. We do not claim any intellectual property rights over your Customer Data.
            </p>
            <p>
              You are responsible for the accuracy, legality, and appropriateness of all Customer Data. You must have the right to upload all data and must comply with all applicable laws, including data protection and employment laws.
            </p>
          </Section>

          <Section title="7. Acceptable Use">
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Use the Service for any unlawful purpose or in violation of any regulation</li>
              <li>Upload malicious code, viruses, or any content that may harm the Service or other users</li>
              <li>Attempt to gain unauthorised access to any part of the Service or its infrastructure</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
              <li>Resell, sublicense, or otherwise commercially exploit the Service without our written consent</li>
              <li>Use the Service to process data of individuals without their consent</li>
            </ul>
          </Section>

          <Section title="8. Intellectual Property">
            <p>
              The Service, including its software, design, branding, and documentation, is owned by {COMPANY} and is protected by intellectual property laws. These Terms do not grant you any ownership rights in the Service. You are granted a limited, non-exclusive, non-transferable licence to use the Service during your subscription term.
            </p>
          </Section>

          <Section title="9. Availability & Uptime">
            <p>
              We strive to maintain 99.5% uptime for the Service. Scheduled maintenance windows will be communicated at least 24 hours in advance. We are not liable for downtime resulting from events beyond our reasonable control, including force majeure events, third-party infrastructure failures, or DDoS attacks.
            </p>
          </Section>

          <Section title="10. Termination">
            <p>
              Either party may terminate the subscription at any time. Upon termination, your access to the Service will cease at the end of the current billing cycle. We will retain your data for 90 days post-termination, after which it will be permanently deleted. You may request an export of your data at any time before deletion.
            </p>
            <p>
              We reserve the right to suspend or terminate your account immediately if you violate these Terms or engage in fraudulent or illegal activity.
            </p>
          </Section>

          <Section title="11. Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, {COMPANY} shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising out of or relating to your use of the Service.
            </p>
            <p>
              Our total cumulative liability for any claims arising under these Terms shall not exceed the total fees paid by you in the 3 months preceding the claim.
            </p>
          </Section>

          <Section title="12. Indemnification">
            <p>
              You agree to indemnify and hold harmless {COMPANY} and its officers, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from your use of the Service, your Customer Data, or your violation of these Terms.
            </p>
          </Section>

          <Section title="13. Governing Law & Dispute Resolution">
            <p>
              These Terms are governed by the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in Bhopal, Madhya Pradesh, India.
            </p>
          </Section>

          <Section title="14. Changes to Terms">
            <p>
              We may modify these Terms at any time. We will provide at least 30 days' notice of material changes by email or via the platform. Your continued use of the Service after the effective date constitutes your acceptance of the modified Terms.
            </p>
          </Section>

          <Section title="15. Contact">
            <p>For questions about these Terms, contact:</p>
            <div className="mt-2 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
              <p className="font-semibold text-slate-800">{COMPANY}</p>
              <p>{ADDRESS}</p>
              <p>Email: <a href={`mailto:${EMAIL}`} className="text-blue-600 hover:underline">{EMAIL}</a></p>
            </div>
          </Section>
        </div>
      </section>
    </>
  );
}

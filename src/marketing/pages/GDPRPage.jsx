import { useEffect } from "react";
import { Lock } from "lucide-react";

const COMPANY = "Affy Cloud IT Solutions";
const PRODUCT = "Worklynx";
const EMAIL = "info@affyclouditsolutions.com";
const ADDRESS = "Block A, E68, Housing Board Colony, Beside Kidz Castel School, Koh-e-fiza, Bhopal, Madhya Pradesh 462030, India";
const EFFECTIVE = "18 March 2026";

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-bold text-slate-900 mb-3">{title}</h2>
      <div className="text-slate-600 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function GDPRPage() {
  useEffect(() => {
    document.title = "GDPR — Worklynx";
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <section className="pt-32 pb-12 gradient-hero">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">GDPR Compliance</h1>
          <p className="text-slate-500 text-sm">Effective date: {EFFECTIVE}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Intro callout */}
          <div className="mb-10 p-5 rounded-2xl bg-blue-50 border border-blue-100">
            <p className="text-sm text-slate-700 leading-relaxed">
              {COMPANY} is committed to protecting the privacy and rights of all individuals whose data is processed through {PRODUCT}. While {PRODUCT} is primarily designed for the Indian market and operates under India's Personal Data Protection framework, we also respect and align with the principles of the EU General Data Protection Regulation (GDPR) for customers and data subjects in the European Economic Area (EEA).
            </p>
          </div>

          <Section title="1. Data Controller vs. Data Processor">
            <p>
              Under the GDPR framework:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-slate-800">You (the Customer) are the Data Controller</strong> — you determine the purposes and means of processing your employees' personal data.
              </li>
              <li>
                <strong className="text-slate-800">{COMPANY} is the Data Processor</strong> — we process personal data on your behalf, strictly to provide the {PRODUCT} service.
              </li>
            </ul>
            <p>
              We process your employees' data only on documented instructions from you, as set out in our Data Processing Agreement (DPA). To request a DPA, contact us at <a href={`mailto:${EMAIL}`} className="text-blue-600 hover:underline">{EMAIL}</a>.
            </p>
          </Section>

          <Section title="2. Legal Basis for Processing">
            <p>We process personal data on the following legal bases under GDPR Article 6:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-slate-800">Contractual necessity:</strong> Processing required to deliver the Service you have subscribed to.</li>
              <li><strong className="text-slate-800">Legal obligation:</strong> Processing required to comply with applicable laws (e.g., payroll tax filings, statutory compliance).</li>
              <li><strong className="text-slate-800">Legitimate interests:</strong> Processing for security, fraud prevention, and platform improvement.</li>
              <li><strong className="text-slate-800">Consent:</strong> Where you have given us specific, informed consent (e.g., marketing communications).</li>
            </ul>
          </Section>

          <Section title="3. Data Subject Rights">
            <p>Under the GDPR, individuals in the EEA have the following rights regarding their personal data:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-slate-800">Right of Access (Art. 15):</strong> Request a copy of personal data we hold.</li>
              <li><strong className="text-slate-800">Right to Rectification (Art. 16):</strong> Request correction of inaccurate data.</li>
              <li><strong className="text-slate-800">Right to Erasure (Art. 17):</strong> Request deletion of personal data ("right to be forgotten").</li>
              <li><strong className="text-slate-800">Right to Restriction (Art. 18):</strong> Request restriction of processing under certain circumstances.</li>
              <li><strong className="text-slate-800">Right to Data Portability (Art. 20):</strong> Request data in a structured, machine-readable format.</li>
              <li><strong className="text-slate-800">Right to Object (Art. 21):</strong> Object to processing based on legitimate interests.</li>
              <li><strong className="text-slate-800">Rights related to automated decision-making (Art. 22):</strong> Right not to be subject to solely automated decisions with significant effects.</li>
            </ul>
            <p>
              As the Data Processor, {COMPANY} will assist you (the Data Controller) in responding to data subject requests. Direct your employees' GDPR requests to your HR administrator, who can action them within {PRODUCT} or escalate to us.
            </p>
          </Section>

          <Section title="4. International Data Transfers">
            <p>
              Your data is primarily stored on AWS servers in the Mumbai, India region. We do not routinely transfer personal data outside India. Where any data transfer to third parties (e.g., analytics providers) may involve cross-border transfers, we ensure appropriate safeguards are in place, including Standard Contractual Clauses (SCCs) where applicable.
            </p>
          </Section>

          <Section title="5. Sub-processors">
            <p>We use the following categories of sub-processors to deliver the Service:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-slate-800">Cloud Infrastructure:</strong> Amazon Web Services (AWS Mumbai)</li>
              <li><strong className="text-slate-800">Payment Processing:</strong> Razorpay / Stripe</li>
              <li><strong className="text-slate-800">Email Delivery:</strong> SendGrid / AWS SES</li>
              <li><strong className="text-slate-800">Analytics:</strong> Google Analytics (anonymised)</li>
            </ul>
            <p>All sub-processors are contractually bound to appropriate data protection obligations.</p>
          </Section>

          <Section title="6. Data Breach Notification">
            <p>
              In the event of a personal data breach that is likely to result in a risk to the rights and freedoms of individuals, {COMPANY} will notify you without undue delay and in any event within 72 hours of becoming aware of the breach (in line with GDPR Article 33). We will provide details of the nature, scope, likely consequences, and remedial measures taken.
            </p>
          </Section>

          <Section title="7. Data Protection by Design">
            <p>
              We implement data protection by design and by default in our product development process. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Minimal data collection — we only collect data necessary for the Service</li>
              <li>Pseudonymisation and encryption of sensitive data</li>
              <li>Role-based access controls restricting data access on a need-to-know basis</li>
              <li>Regular privacy impact assessments for new features</li>
              <li>Regular staff training on data protection</li>
            </ul>
          </Section>

          <Section title="8. Data Processing Agreement (DPA)">
            <p>
              If you are subject to GDPR and require a formal Data Processing Agreement (DPA) as per Article 28, please contact us at <a href={`mailto:${EMAIL}`} className="text-blue-600 hover:underline">{EMAIL}</a>. We will provide a DPA that meets GDPR requirements.
            </p>
          </Section>

          <Section title="9. Contact & Complaints">
            <p>
              For GDPR-related queries or to exercise your rights, contact our Data Protection point of contact:
            </p>
            <div className="mt-2 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
              <p className="font-semibold text-slate-800">{COMPANY}</p>
              <p>{ADDRESS}</p>
              <p>Email: <a href={`mailto:${EMAIL}`} className="text-blue-600 hover:underline">{EMAIL}</a></p>
            </div>
            <p className="mt-3">
              If you are in the EEA and believe your data protection rights have been violated, you have the right to lodge a complaint with your local supervisory authority.
            </p>
          </Section>
        </div>
      </section>
    </>
  );
}

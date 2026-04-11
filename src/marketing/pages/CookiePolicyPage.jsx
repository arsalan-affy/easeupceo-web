import { useEffect } from "react";
import { Cookie } from "lucide-react";

const COMPANY = "Affy Cloud IT Solutions";
const PRODUCT = "Worklynx";
const EMAIL = "info@affyclouditsolutions.com";
const EFFECTIVE = "18 March 2026";

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-bold text-slate-900 mb-3">{title}</h2>
      <div className="text-slate-600 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

const cookieTable = [
  { name: "session_token", type: "Essential", duration: "Session", purpose: "Maintains your authenticated session across page loads." },
  { name: "csrf_token", type: "Essential", duration: "Session", purpose: "Protects against cross-site request forgery attacks." },
  { name: "remember_me", type: "Essential", duration: "30 days", purpose: "Keeps you logged in when you select 'Remember me'." },
  { name: "theme_pref", type: "Functional", duration: "1 year", purpose: "Stores your UI theme preference (light/dark)." },
  { name: "_ga", type: "Analytics", duration: "2 years", purpose: "Google Analytics — distinguishes unique users." },
  { name: "_gid", type: "Analytics", duration: "24 hours", purpose: "Google Analytics — stores and updates a unique value for each page visited." },
  { name: "intercom-*", type: "Support", duration: "Session", purpose: "Intercom live chat session management." },
];

export default function CookiePolicyPage() {
  useEffect(() => {
    document.title = "Cookie Policy — Worklynx";
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <section className="pt-32 pb-12 gradient-hero">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4">
            <Cookie className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Cookie Policy</h1>
          <p className="text-slate-500 text-sm">Effective date: {EFFECTIVE}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section title="1. What Are Cookies?">
            <p>
              Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work efficiently, improve user experience, and provide information to site owners. {PRODUCT} uses cookies and similar technologies (such as local storage and session storage) to operate and improve our platform.
            </p>
          </Section>

          <Section title="2. Types of Cookies We Use">
            <p><strong className="text-slate-800">Essential Cookies</strong> — Required for the platform to function. These cannot be disabled without breaking core functionality such as login sessions and security features.</p>
            <p><strong className="text-slate-800">Functional Cookies</strong> — Remember your preferences (e.g., language, theme) to personalise your experience.</p>
            <p><strong className="text-slate-800">Analytics Cookies</strong> — Help us understand how users interact with the platform so we can improve features and performance. Data collected is aggregated and anonymised.</p>
            <p><strong className="text-slate-800">Support Cookies</strong> — Used by our live chat and support tools to manage support sessions.</p>
          </Section>

          <Section title="3. Cookies We Use">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Cookie Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Duration</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cookieTable.map((c) => (
                    <tr key={c.name} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-mono text-slate-800">{c.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          c.type === "Essential" ? "bg-blue-50 text-blue-700" :
                          c.type === "Functional" ? "bg-purple-50 text-purple-700" :
                          c.type === "Analytics" ? "bg-amber-50 text-amber-700" :
                          "bg-emerald-50 text-emerald-700"
                        }`}>
                          {c.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{c.duration}</td>
                      <td className="px-4 py-3 text-slate-600">{c.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="4. Third-Party Cookies">
            <p>
              Some cookies are placed by third-party services that appear on our pages. These include Google Analytics and Intercom. These third parties have their own privacy policies governing their use of cookies. We do not control the setting of these cookies.
            </p>
          </Section>

          <Section title="5. Managing Cookies">
            <p>
              You can control and manage cookies in your browser settings. You can delete all cookies stored on your device and set your browser to prevent cookies from being placed. However, disabling essential cookies will affect the functionality of {PRODUCT}.
            </p>
            <p>
              Most browsers allow you to manage cookies through their settings. For more information, visit your browser's help page:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Google Chrome — chrome://settings/cookies</li>
              <li>Mozilla Firefox — about:preferences#privacy</li>
              <li>Safari — Preferences &gt; Privacy</li>
              <li>Microsoft Edge — edge://settings/privacy</li>
            </ul>
          </Section>

          <Section title="6. Changes to This Policy">
            <p>
              We may update this Cookie Policy periodically. Changes will be posted on this page with an updated effective date. We encourage you to review this policy regularly.
            </p>
          </Section>

          <Section title="7. Contact Us">
            <p>
              If you have any questions about our use of cookies, please contact us at{" "}
              <a href={`mailto:${EMAIL}`} className="text-blue-600 hover:underline">{EMAIL}</a>.
            </p>
          </Section>
        </div>
      </section>
    </>
  );
}

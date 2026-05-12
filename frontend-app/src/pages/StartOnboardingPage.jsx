import React from "react";
import OnboardingShell, { onboardingApi } from "../modules/onboarding";

class OnboardingErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("[start-onboarding] crashed:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: "32px", fontFamily: "monospace", color: "#b00020" }}>
          <h2 style={{ marginBottom: 12 }}>Onboarding failed to render</h2>
          <pre style={{ whiteSpace: "pre-wrap", background: "#fff5f5", padding: 16, borderRadius: 6 }}>
            {String(this.state.error?.stack || this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

async function commitOnboarding(sessionId, fallbackPayload) {
  if (!sessionId) {
    console.warn("[Worklynx] no session id at finalize — using fallback payload", fallbackPayload);
    return;
  }
  try {
    const result = await onboardingApi.finalize(sessionId);
    console.log("[Worklynx] onboarding committed:", result);
    if (result.redirect_url) {
      window.location.assign(result.redirect_url);
    }
    return result;
  } catch (err) {
    console.error("[Worklynx] finalize failed:", err);
    throw err;
  }
}

export default function StartOnboardingPage() {
  return (
    <OnboardingErrorBoundary>
      <OnboardingShell
        onComplete={async (sessionId, fallbackPayload) => {
          try {
            await commitOnboarding(sessionId, fallbackPayload);
          } catch (_) {
            // Lynx UI already shows the celebration view; host app can surface a toast.
          }
        }}
      />
    </OnboardingErrorBoundary>
  );
}

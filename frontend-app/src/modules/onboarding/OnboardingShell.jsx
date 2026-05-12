import LynxChat from './components/LynxChat';
import './onboarding.css';
import './lynxChat.css';

/**
 * Drop this anywhere inside the existing Worklynx app.
 *
 *   <OnboardingShell onComplete={(sessionId, fallbackPayload) => {
 *     // call POST /finsh/ai-onboarding with sessionId, then redirect
 *   }} />
 *
 * `onComplete` receives the chat session id and a fallback copy of the
 * final onboarding payload. The expected handler is to call POST
 * /finsh/ai-onboarding with the session id — see frontend/src/main.jsx.
 *
 * The shell is fully self-contained — it owns its own session via
 * useLynxChat and its own theming via the .lynx-shell scope.
 */
export default function OnboardingShell({ onComplete }) {
  return <LynxChat onComplete={onComplete} />;
}

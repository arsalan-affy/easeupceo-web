/**
 * Thin client for the chat-mode onboarding API.
 *
 * `API_BASE` defaults to '' (same-origin — works when the backend serves
 * this SPA from /). Override with VITE_ONBOARDING_API_BASE in .env.local
 * when running vite dev against a backend on a different port.
 */

const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ONBOARDING_API_BASE) || '';

const url = (path) => `${API_BASE}${path}`;

async function jsonFetch(path, options = {}) {
  const res = await fetch(url(path), {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || JSON.stringify(body);
    } catch (_) { /* fall through */ }
    throw new Error(`${res.status} ${detail}`);
  }
  return res.json();
}

export const onboardingApi = {
  /**
   * Bootstrap (or resume) a chat session.
   *
   * `handoff` carries the HRMS context the user was redirected with — the
   * SPA reads these from the URL query string on first load:
   *
   *   { bearer_token, organization_id, return_url,
   *     user:    { name, email, ... },     // optional
   *     company: { name } }                // optional pre-fill
   *
   * Backend stores them on the session and reuses them on every uploadFile
   * call and the final HRMS sync.
   *
   * Returns { session_id, current_step, state }.
   */
  startSession(resumeSessionId = null, handoff = null) {
    const body = { resume_session_id: resumeSessionId };
    if (handoff) {
      if (handoff.bearer_token || handoff.organization_id) {
        body.auth = {
          bearer_token:    handoff.bearer_token    || null,
          organization_id: handoff.organization_id || null,
        };
      }
      if (handoff.user)       body.user       = handoff.user;
      if (handoff.company)    body.company    = handoff.company;
      if (handoff.return_url) body.return_url = handoff.return_url;
    }
    return jsonFetch('/start/ai-onboarding', {
      method: 'POST',
      body:   JSON.stringify(body),
    });
  },

  /**
   * Enter Workspace handler — backend validates the session, builds the
   * canonical payload, syncs it to HRMS (when HRMS_SYNC_URL is configured)
   * and returns the redirect URL.
   *
   *   { session_id, success, synced, sync_response, final_payload, redirect_url }
   */
  finalize(sessionId) {
    return jsonFetch('/finsh/ai-onboarding', {
      method: 'POST',
      body:   JSON.stringify({ session_id: sessionId }),
    });
  },

  /** Direct URL for the employee Excel template — used as an <a download>. */
  templateUrl() {
    return url('/onboarding/employees/template');
  },

  /**
   * Single multipart endpoint that drives the conversational onboarding.
   *
   * Pass any combination of text / intent / theme JSON / file. The backend
   * applies side-effects against the existing services and returns the
   * conversational reply + the UI descriptor for the next composer.
   */
  async chat(sessionId, { text, intent, theme, file } = {}) {
    const fd = new FormData();
    fd.append('session_id', sessionId);
    if (text   != null) fd.append('text',   text);
    if (intent != null) fd.append('intent', intent);
    if (theme  != null) fd.append('theme',  typeof theme === 'string' ? theme : JSON.stringify(theme));
    if (file)           fd.append('file',   file);

    const res = await fetch(url('/onboarding/chat'), { method: 'POST', body: fd });
    if (!res.ok) {
      let msg = res.statusText;
      try {
        const j = await res.json();
        msg = j.detail || msg;
      } catch (_) { /* fall through */ }
      throw new Error(msg);
    }
    return res.json();
  },
};

export default onboardingApi;

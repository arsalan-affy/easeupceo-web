/**
 * Single source of truth for the Lynx chat-mode onboarding.
 *
 * Owns:
 *   - sessionId lifecycle (created on mount, persisted to localStorage)
 *   - the chronological message list (assistant + user bubbles)
 *   - the *active* UI descriptor (what the composer should render next)
 *   - whatever inline data Lynx attached to its last reply (theme palettes,
 *     parsed employees, etc.) so cards can render without extra fetches
 *
 * The hook talks ONLY to /onboarding/chat. Existing endpoints stay reachable
 * via onboardingApi for things the chat doesn't expose (template download,
 * logo file streaming, etc.).
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import onboardingApi from '../onboardingApi';

const STORAGE_KEY = 'worklynx.lynxchat.v1';
const TYPING_DELAY_MS = 380;

function makeId() {
  return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function readPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function persist(snapshot) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch (_) {
    /* fail silently */
  }
}

/**
 * Read the HRMS handoff context from `window.location.search`.
 *
 * The HRMS redirects logged-in users to:
 *   https://onboarding.example.com/?token=<JWT>&org=57&return_url=<encoded>
 *                                  [&user_name=...&user_email=...&company=...]
 *
 * Returns null if no token is present (so dev mode using vite alone still
 * works against the .env fallback bearer). Once consumed, the URL is rewritten
 * via history.replaceState so the JWT doesn't sit in the address bar.
 */
function readHandoffFromUrl() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const token  = params.get('token') || params.get('bearer') || params.get('bearer_token');
  const org    = params.get('org')   || params.get('organization') || params.get('organization_id');
  if (!token && !org) return null;

  const handoff = {
    bearer_token:    token || null,
    organization_id: org   || null,
    return_url:      params.get('return_url') || params.get('return') || null,
  };
  const user = {};
  if (params.get('user_name'))  user.name  = params.get('user_name');
  if (params.get('user_email')) user.email = params.get('user_email');
  if (params.get('user_phone')) user.phone = params.get('user_phone');
  if (params.get('user_id'))    user.id    = params.get('user_id');
  if (Object.keys(user).length) handoff.user = user;
  if (params.get('company'))    handoff.company = { name: params.get('company') };

  // Strip the handoff params from the URL so the bearer doesn't linger.
  const clean = new URLSearchParams(window.location.search);
  ['token','bearer','bearer_token','org','organization','organization_id',
   'return_url','return','user_name','user_email','user_phone','user_id',
   'company'].forEach((k) => clean.delete(k));
  const qs = clean.toString();
  const newUrl = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash;
  try { window.history.replaceState({}, '', newUrl); } catch (_) {}

  return handoff;
}

export function useLynxChat() {
  const [sessionId, setSessionId]   = useState(null);
  const [messages,  setMessages]    = useState([]);   // [{id, role, text, ui?, data?, off_topic?}]
  const [activeUI,  setActiveUI]    = useState(null); // { input_type, options, placeholder }
  const [activeData, setActiveData] = useState({});   // payload Lynx attached to its last reply
  const [state,     setState]       = useState({});   // backend state snapshot
  const [phase,     setPhase]       = useState('welcome');
  const [busy,      setBusy]        = useState(false);
  const [typing,    setTyping]      = useState(false);
  const [error,     setError]       = useState(null);

  const bootstrapped = useRef(false);

  // ── Persist on every change ───────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId) return;
    persist({ sessionId, messages, activeUI, activeData, state, phase });
  }, [sessionId, messages, activeUI, activeData, state, phase]);

  // ── Append helpers ────────────────────────────────────────────────────────
  const pushAssistant = useCallback((reply) => {
    setMessages((ms) => [
      ...ms,
      {
        id:        makeId(),
        role:      'assistant',
        text:      reply.message || '',
        data:      reply.data    || {},
        // Tag the bubble with the phase it represents — used by
        // editFromMessage to truncate cleanly at step boundaries on revert.
        phase:     reply.phase   || '',
        off_topic: !!reply.off_topic,
        ts:        Date.now(),
      },
    ]);
    setActiveUI(reply.ui || null);
    setActiveData(reply.data || {});
    setPhase(reply.phase || phase);
    setState(reply.state || state);
  }, [phase, state]);

  const pushUser = useCallback((text, attachment = null, editAction = null, media = null) => {
    setMessages((ms) => [
      ...ms,
      {
        id:    makeId(),
        role:  'user',
        text:  text || '',
        attachment,
        editAction,    // null = no edit affordance; otherwise the revert intent to fire
        media,         // optional rich preview attached to the bubble:
                       //   { kind: 'image', src: '<data-url>' }
                       //   { kind: 'theme', name, primary, secondary, accent, background }
        ts:    Date.now(),
      },
    ]);
  }, []);

  // ── Send (core) ───────────────────────────────────────────────────────────
  const send = useCallback(
    async ({ text, intent, theme, file, userBubble, attachment, editAction, media }) => {
      if (!sessionId) return;
      setError(null);

      // Optimistic user bubble
      if (userBubble) pushUser(userBubble, attachment, editAction, media);

      setBusy(true);
      setTyping(true);
      try {
        const reply = await onboardingApi.chat(sessionId, { text, intent, theme, file });
        // Tiny delay so the typing indicator is perceptible
        await new Promise((r) => setTimeout(r, TYPING_DELAY_MS));
        pushAssistant(reply);
        return reply;
      } catch (e) {
        setError(e.message || 'Something went wrong. Try again.');
        throw e;
      } finally {
        setBusy(false);
        setTyping(false);
      }
    },
    [sessionId, pushAssistant, pushUser]
  );

  // ── Bootstrap: rehydrate or start a new chat session ─────────────────────
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const persisted = readPersisted();
    const handoff   = readHandoffFromUrl();
    (async () => {
      try {
        setBusy(true);
        // If the user arrived via a fresh HRMS handoff (URL carries a token),
        // ignore the persisted session — that token belongs to a new tenant
        // and we don't want to resume someone else's chat.
        const resumeId = handoff ? null : (persisted?.sessionId || null);
        const startResp = await onboardingApi.startSession(resumeId, handoff);
        const sid = startResp.session_id;
        setSessionId(sid);

        if (persisted && persisted.sessionId === sid && Array.isArray(persisted.messages) && persisted.messages.length) {
          setMessages(persisted.messages);
          setActiveUI(persisted.activeUI || null);
          setActiveData(persisted.activeData || {});
          setState(persisted.state || {});
          setPhase(persisted.phase || 'welcome');
          setBusy(false);
          return;
        }

        // Fresh session — kick off the welcome turn.
        setBusy(false);
        const reply = await onboardingApi.chat(sid, { intent: 'start' });
        pushAssistant(reply);
      } catch (e) {
        setError(e.message || 'Failed to start onboarding. Refresh the page.');
        setBusy(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── High-level intents the UI fires ──────────────────────────────────────
  const submitText = useCallback((value, opts = {}) => {
    const trimmed = (value || '').trim();
    if (!trimmed) return;
    return send({ text: trimmed, userBubble: trimmed, editAction: opts.editAction });
  }, [send]);

  const fireIntent = useCallback((intent, opts = {}) => {
    return send({
      intent,
      userBubble: opts.userBubble,
      attachment: opts.attachment,
      file: opts.file,
      theme: opts.theme,
      editAction: opts.editAction,
      media: opts.media,
    });
  }, [send]);

  // ── Edit / revert ───────────────────────────────────────────────────────
  // Truncate the thread back to the start of the step being changed, then
  // fire the matching revert intent so the backend rolls its session state
  // back. Lynx's fresh reply for that step appends to the trimmed thread.
  //
  // Each revert maps to the phase whose first message marks the step's
  // beginning; we cut from there so the user doesn't see the original
  // "Do you have a logo?" prompt sitting beside the new one.
  //   revert_company   → wipe everything
  //   revert_logo      → cut from first 'branding_choice' message
  //   revert_theme     → cut from first 'theme_picker' message
  //   revert_employees → cut from first 'employee_choice' message
  const editFromMessage = useCallback(async (messageId, intent) => {
    if (!sessionId || !intent) return;
    setError(null);

    const PHASE_BY_INTENT = {
      revert_logo:      'branding_choice',
      revert_theme:     'theme_picker',
      revert_employees: 'employee_choice',
    };

    setMessages((ms) => {
      if (intent === 'revert_company') return [];

      const targetPhase = PHASE_BY_INTENT[intent];
      if (targetPhase) {
        const cutIdx = ms.findIndex(
          (m) => m.role === 'assistant' && m.phase === targetPhase
        );
        if (cutIdx !== -1) return ms.slice(0, cutIdx);
      }

      // Fallback: if we can't find a matching step start, truncate from
      // the user bubble that was clicked.
      const userIdx = ms.findIndex((m) => m.id === messageId);
      return userIdx === -1 ? ms : ms.slice(0, userIdx);
    });

    // Pre-emptively clear the active UI so the welcome hero takes over
    // immediately while the API call is in flight — the user shouldn't
    // glimpse a trimmed thread on its own before the response lands.
    if (intent === 'revert_company') {
      setActiveUI(null);
      setActiveData({});
      setPhase('welcome');
    }

    setBusy(true);
    setTyping(true);
    try {
      const reply = await onboardingApi.chat(sessionId, { intent });
      await new Promise((r) => setTimeout(r, TYPING_DELAY_MS));
      pushAssistant(reply);
      return reply;
    } catch (e) {
      setError(e.message || 'Could not roll back. Try again.');
    } finally {
      setBusy(false);
      setTyping(false);
    }
  }, [sessionId, pushAssistant]);

  const reset = useCallback(async () => {
    // Wipe local state + persisted snapshot.
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    setSessionId(null);
    setMessages([]);
    setActiveUI(null);
    setActiveData({});
    setState({});
    setPhase('welcome');
    setError(null);

    // Re-bootstrap a fresh session and pull the welcome turn so the user
    // lands back on the hero screen instead of staring at an empty chat.
    try {
      setBusy(true);
      const startResp = await onboardingApi.startSession(null);
      const sid = startResp.session_id;
      setSessionId(sid);
      setBusy(false);
      const reply = await onboardingApi.chat(sid, { intent: 'start' });
      pushAssistant(reply);
    } catch (e) {
      setError(e.message || 'Failed to restart onboarding. Refresh the page.');
      setBusy(false);
    }
  }, [pushAssistant]);

  return {
    sessionId,
    messages,
    activeUI,
    activeData,
    state,
    phase,
    busy,
    typing,
    error,
    submitText,
    fireIntent,
    editFromMessage,
    reset,
  };
}

export default useLynxChat;

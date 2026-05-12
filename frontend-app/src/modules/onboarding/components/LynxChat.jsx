import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RefreshCcw, Sparkles } from 'lucide-react';

import logo from '../assets/worklynx-logo.png';
import useLynxChat from '../hooks/useLynxChat';

import ChatActionButtons from './chat/ChatActionButtons';
import ChatComplete from './chat/ChatComplete';
import ChatEmployeePreview from './chat/ChatEmployeePreview';
import ChatExcelUpload from './chat/ChatExcelUpload';
import ChatLogoUpload from './chat/ChatLogoUpload';
import ChatMessage from './chat/ChatMessage';
import ChatTextComposer from './chat/ChatTextComposer';
import ChatThemePicker from './chat/ChatThemePicker';
import TypingIndicator from './chat/TypingIndicator';
import WelcomeHero from './chat/WelcomeHero';

/**
 * Lynx — premium conversational onboarding shell.
 *
 *   <LynxChat onComplete={(result) => navigate('/dashboard')} />
 *
 * Every onboarding surface (action buttons, logo dropzone, theme picker,
 * employee preview, completion summary) renders inline INSIDE the chat
 * thread — attached to the latest Lynx bubble. The bottom composer is just
 * a persistent text input for free-form replies and off-topic redirects.
 */
export default function LynxChat({ onComplete }) {
  const chat = useLynxChat();
  const scrollerRef = useRef(null);
  const finalSentRef = useRef(false);

  const [heroPhase, setHeroPhase] = useState('hidden');

  // Active UI descriptor for the latest assistant turn — read by the
  // welcome-hero gate and the inline-card builder below.
  const ui = chat.activeUI;

  // Live theme — adopt the user's selected palette as the chat's CSS vars.
  const themeVars = useMemo(() => {
    const t = chat.state?.branding?.selected_theme;
    if (!t) return {};
    return {
      '--lynx-primary':    t.primary,
      '--lynx-primary-2':  t.accent || t.primary,
      '--lynx-secondary':  t.secondary,
      '--lynx-bg-accent':  t.background,
    };
  }, [chat.state?.branding?.selected_theme]);

  const progressPct = useMemo(() => {
    const map = {
      welcome:           5,
      company:           10,
      branding_choice:   25,
      theme_picker:      40,
      employee_choice:   55,
      employee_upload:   65,
      employee_preview:  78,
      finalize:          90,
      complete:          100,
    };
    return map[chat.phase] ?? 5;
  }, [chat.phase]);

  // Show the hero whenever the user hasn't contributed yet — including the
  // brief moment after Reset when messages have been cleared but the new
  // welcome turn hasn't arrived. Keeps the screen from flashing empty.
  const hasUserMessage = chat.messages.some((m) => m.role === 'user');
  const showWelcomeHero =
    !hasUserMessage &&
    chat.phase !== 'complete' &&
    (chat.messages.length === 0 || ui?.input_type === 'text_input');

  useEffect(() => {
    if (showWelcomeHero && heroPhase === 'hidden') {
      setHeroPhase('active');
    } else if (!showWelcomeHero && heroPhase === 'active') {
      setHeroPhase('exiting');
      const timer = setTimeout(() => setHeroPhase('hidden'), 800);
      return () => clearTimeout(timer);
    }
  }, [showWelcomeHero, heroPhase]);

  // Auto-scroll the inner thread to the bottom whenever its content height
  // changes — covers new bubbles, the inline UI growing, AND the typewriter
  // streaming a long reply char-by-char (which doesn't fire React renders
  // here but does change layout). We use scrollIntoView on a dedicated
  // sentinel + a ResizeObserver on the thread itself.
  const threadRef = useRef(null);

  useEffect(() => {
    const scrollEl = scrollerRef.current;
    const threadEl = threadRef.current;
    if (!scrollEl || !threadEl) return;

    // New message / UI update arrived → always pull the user to the bottom.
    scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });

    // During the typewriter / inline-card growth we keep the user pinned
    // ONLY while they're already near the bottom — so reading history a
    // few screens up doesn't get interrupted by every typing tick.
    const stickIfNearBottom = () => {
      const distance = scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight;
      if (distance < 140) {
        scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });
      }
    };
    const ro = new ResizeObserver(stickIfNearBottom);
    ro.observe(threadEl);
    return () => ro.disconnect();
  }, [chat.messages.length, chat.typing, chat.activeUI?.input_type]);

  // onComplete is fired by the explicit "Enter Workspace" click only — see
  // handleEnter below and the `enter_workspace` branch of handleActionPick.
  // We deliberately do NOT auto-fire on phase=='complete', because that
  // would redirect (via main.jsx → POST /finsh/ai-onboarding → window
  // navigation) the moment the user finishes the chat, skipping the
  // celebration screen entirely.

  // ── Action / intent dispatchers ──────────────────────────────────────────
  const handleActionPick = (opt) => {
    if (opt.id === 'logo_upload') {
      chat.fireIntent('logo_upload_prompt', { userBubble: opt.label });
      return;
    }
    if (opt.id === 'employees_upload') {
      chat.fireIntent('employees_upload_prompt', { userBubble: opt.label });
      return;
    }
    if (opt.id === 'finalize') {
      chat.fireIntent('finalize', { userBubble: opt.label });
      return;
    }
    if (opt.id === 'enter_workspace') {
      const final = chat.activeData?.final;
      if (final && onComplete && !finalSentRef.current) {
        finalSentRef.current = true;
        onComplete(chat.sessionId, final);
      }
      return;
    }
    if (opt.id === 'download_template') {
      // Handled by the anchor inside ChatExcelUpload
      return;
    }

    // Map intents that represent a real user choice (vs. pure navigation)
    // to their revert action so the bubble gets a "Change" affordance.
    const editActionByIntent = {
      employees_demo: 'revert_employees',
      employees_skip: 'revert_employees',
    };
    chat.fireIntent(opt.id, {
      userBubble: opt.label,
      editAction: editActionByIntent[opt.id] || null,
    });
  };

  // Click handler for the "Change" pencil on user bubbles.
  const handleEditMessage = (messageId, editAction) => {
    if (chat.busy || !editAction) return;
    chat.editFromMessage(messageId, editAction);
  };

  // Free text in PHASE_COMPANY = the company name. Allow it to be edited.
  const handleTextSubmit  = (value)  => chat.submitText(value, {
    editAction: chat.phase === 'company' ? 'revert_company' : null,
  });
  const handleLogoSkip    = ()       => chat.fireIntent('logo_skip', {
    userBubble: "I don't have one",
    editAction: 'revert_logo',
  });
  const handleExcelBack   = ()       => chat.fireIntent('back_employee_choice', { userBubble: 'Show me other options' });
  const handleConfirmEmployees = ()  => chat.fireIntent('confirm_employees', {
    userBubble: 'Looks good — import them',
    editAction: 'revert_employees',
  });

  const handleLogoFile = async (file) => {
    // Read the file as a data URL so the user's bubble can show the actual
    // logo image inline (not just a "Uploaded X.png" label).
    const dataUrl = await readFileAsDataURL(file).catch(() => null);
    await chat.fireIntent('logo_upload', {
      file,
      userBubble: 'Here’s our logo',
      attachment: file?.name,
      editAction: 'revert_logo',
      media: dataUrl ? { kind: 'image', src: dataUrl } : null,
    });
  };

  const handleThemeSelect = (theme, name) => {
    chat.fireIntent('select_theme', {
      theme,
      userBubble: `Going with ${name}`,
      editAction: 'revert_theme',
      // Pinned theme card so the user can see exactly what they picked
      // when scrolling back through the conversation.
      media: {
        kind:       'theme',
        name,
        primary:    theme.primary,
        secondary:  theme.secondary,
        accent:     theme.accent,
        background: theme.background,
      },
    });
  };

  const handleExcelFile = async (file) => {
    await chat.fireIntent('employees_upload', {
      file,
      userBubble: file?.name ? `Uploaded ${file.name}` : 'Uploaded my team',
      attachment: file?.name,
      editAction: 'revert_employees',
    });
  };

  const handleEnter = () => {
    const final = chat.activeData?.final;
    if (final && onComplete && !finalSentRef.current) {
      finalSentRef.current = true;
      onComplete(chat.sessionId, final);
    }
  };

  // ── Inline UI for the latest assistant bubble ────────────────────────────
  // Everything except free-form text input is rendered IN the message thread,
  // attached directly under Lynx's last reply. That keeps the experience
  // fully conversational — no popups, no separate cards floating below.
  // (`ui` is declared at the top of the component so the welcome-hero gate
  //  can also read it.)
  const buildInlineForLatest = () => {
    if (!ui) return null;
    // Note: we DO NOT hide inline UI while busy. Each card respects the
    // `disabled` prop, so the user sees their just-clicked picker freeze
    // in place while Lynx replies — no jarring disappearance/flash.
    switch (ui.input_type) {
      case 'text_input':
      case 'none':
        return null;

      case 'action_buttons':
        return (
          <ChatActionButtons
            options={ui.options}
            onPick={handleActionPick}
            disabled={chat.busy}
          />
        );

      case 'logo_upload':
        return (
          <ChatLogoUpload
            onPickFile={handleLogoFile}
            onSkip={handleLogoSkip}
            disabled={chat.busy}
            options={ui.options}
          />
        );

      case 'theme_picker':
        return (
          <ChatThemePicker
            data={chat.activeData}
            onSelect={handleThemeSelect}
            disabled={chat.busy}
          />
        );

      case 'excel_upload':
        return (
          <ChatExcelUpload
            onPickFile={handleExcelFile}
            onBack={handleExcelBack}
            disabled={chat.busy}
          />
        );

      case 'employee_preview':
        return (
          <ChatEmployeePreview
            data={chat.activeData}
            options={ui.options}
            onConfirm={handleConfirmEmployees}
            onBack={handleExcelBack}
            disabled={chat.busy}
          />
        );

      // PHASE_COMPLETE renders fullscreen below — never inline.
      case 'complete':
        return null;

      default:
        return null;
    }
  };

  // Fullscreen completion takeover — phase=complete swaps the entire main
  // area for the celebration view, with bursting confetti and the Enter
  // Workspace CTA front and centre.
  const isComplete = chat.phase === 'complete' && ui?.input_type === 'complete';

  // Find the index of the latest assistant message, so we attach the
  // inline slot only to that bubble — older bubbles freeze as scroll-back.
  const lastAssistantIdx = useMemo(() => {
    for (let i = chat.messages.length - 1; i >= 0; i--) {
      if (chat.messages[i].role === 'assistant') return i;
    }
    return -1;
  }, [chat.messages]);

  // Bottom composer — only rendered when Lynx is genuinely waiting for
  // free-text input (e.g. the company-name moment). Every other surface
  // (action buttons, logo dropzone, theme picker, employee preview, …)
  // lives inline INSIDE the chat thread, so a free-text box would just
  // invite off-topic typing the AI would have to redirect.
  const showTextComposer = ui?.input_type === 'text_input';
  const showComposerArea  = showTextComposer || !!chat.error;
  const composerPlaceholder = ui?.placeholder || 'Type your answer…';
  const composerSubmitLabel = ui?.submit_label || 'Send';

  // Welcome hero — only on the very first turn, before the user has
  // contributed anything. Inspired by the Gemini home layout: centered
  // greeting, big invitation, single input, quick-reply chips.
  // Single input, quick-reply chips.
  const welcomeMessage = chat.messages.find((m) => m.role === 'assistant')?.text;

  // Inline helper — only used by handleLogoFile.
  // (Hoisted above the JSX for readability; React doesn't care.)
  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className="lynx-shell" style={themeVars}>
      <header className="lynx-shell__header">
        <div className="lynx-shell__brand">
          <img src={logo} alt="Worklynx" className="lynx-shell__logo" />
        </div>

        <div className="lynx-shell__header-right">
          <div className="lynx-shell__assistant">
            <span className="lynx-shell__assistant-icon" aria-hidden><Sparkles size={14} /></span>
            <div className="lynx-shell__assistant-meta">
              <div className="lynx-shell__assistant-name">Lynx</div>
              <div className="lynx-shell__assistant-status">
                <span className={`lynx-shell__status-dot ${chat.busy ? 'is-busy' : ''}`} />
                {chat.busy ? 'Thinking…' : 'Online'}
              </div>
            </div>
          </div>
          {chat.messages.length > 0 && (
            <button
              type="button"
              className="lynx-shell__restart"
              onClick={() => {
                if (confirm('Restart onboarding? Your current chat will be cleared.')) {
                  chat.reset();
                }
              }}
              title="Restart onboarding"
              aria-label="Restart onboarding"
            >
              <RefreshCcw size={14} />
            </button>
          )}
        </div>
      </header>

      <div className="lynx-shell__progress" aria-hidden>
        <div className="lynx-shell__progress-bar" style={{ width: `${progressPct}%` }} />
      </div>

      <main className="lynx-shell__main" style={{ position: 'relative' }}>
        {isComplete && (
          <ChatComplete
            fullscreen
            data={chat.activeData}
            state={chat.state}
            options={ui?.options || []}
            onEnter={handleEnter}
            // The user's uploaded logo (if any) — used as the personalised
            // celebration centrepiece. The backend now hosts logos on the
            // remote upload service, so logo_url is already absolute.
            logoUrl={chat.state?.branding?.logo_url || ''}
          />
        )}

        {!isComplete && heroPhase !== 'hidden' && (
          <WelcomeHero
            message={welcomeMessage}
            placeholder={composerPlaceholder}
            submitLabel={composerSubmitLabel}
            onSubmit={handleTextSubmit}
            disabled={chat.busy || heroPhase === 'exiting'}
            isExiting={heroPhase === 'exiting'}
          />
        )}

        {!isComplete && heroPhase !== 'active' && (
          <div className="lynx-shell__chat-view">
            <div className="lynx-shell__scroller" ref={scrollerRef}>
              <div className="lynx-shell__thread" ref={threadRef}>
                {chat.messages.map((m, i) => (
                  <ChatMessage
                    key={m.id}
                    id={m.id}
                    role={m.role}
                    text={m.text}
                    attachment={m.attachment}
                    media={m.media}
                    isLatest={m.role === 'assistant' && i === lastAssistantIdx}
                    // The first assistant message is the welcome — it was
                    // already shown in the hero, so render it instantly
                    // without the typewriter to avoid re-typing.
                    instant={i === 0 && m.role === 'assistant'}
                    inlineSlot={i === lastAssistantIdx ? buildInlineForLatest() : null}
                    // "Change" affordance — only on user messages that carry
                    // a revert intent, and only while Lynx isn't busy.
                    editAction={m.editAction}
                    onEdit={chat.busy ? null : handleEditMessage}
                  />
                ))}
                {chat.typing && <TypingIndicator />}
              </div>
            </div>

            {showComposerArea && (
              <div className="lynx-shell__composer">
                {chat.error && <div className="lynx-shell__error">{chat.error}</div>}
                {showTextComposer && (
                  <ChatTextComposer
                    placeholder={composerPlaceholder}
                    submitLabel={composerSubmitLabel}
                    onSubmit={handleTextSubmit}
                    disabled={chat.busy}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

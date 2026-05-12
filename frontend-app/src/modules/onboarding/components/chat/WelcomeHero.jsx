import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';

/**
 * Centered "first impression" surface — used only on the very first turn,
 * before the user has typed anything. A small badge, a big greeting, a
 * single centered input, and a quiet footnote.
 *
 * When the user submits, LynxChat falls back to the normal chat thread.
 */

export default function WelcomeHero({
  message,           // Lynx's welcome bubble text
  placeholder,       // composer placeholder (e.g. "Type your business name…")
  submitLabel = 'Continue',
  onSubmit,
  disabled,
  isExiting,
}) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const fire = (val) => {
    const v = (val ?? value).trim();
    if (!v || disabled) return;
    setValue('');
    onSubmit(v);
  };

  // Lynx's full greeting reads like "Hi, I'm Lynx — your Worklynx co-partner.
  // Let's get your workspace ready. What's your business called?"
  // We surface it as three layers: a soft greeting, a strong call-to-action,
  // and a softer prompt below.
  const { greeting, hero, prompt } = splitGreeting(message);

  return (
    <div className={`lynx-hero ${isExiting ? 'is-exiting' : ''}`}>
      <div className="lynx-hero__inner">
        <div className="lynx-hero__badge">
          <span className="lynx-hero__badge-icon"><Sparkles size={14} /></span>
          <span>Lynx · onboarding co-partner</span>
        </div>

        {greeting && <p className="lynx-hero__greeting">{greeting}</p>}
        <h1 className="lynx-hero__title">{hero}</h1>
        {prompt && <p className="lynx-hero__subtitle">{prompt}</p>}

        <form
          className="lynx-hero__composer"
          onSubmit={(e) => { e.preventDefault(); fire(); }}
        >
          <input
            ref={inputRef}
            type="text"
            className="lynx-hero__input"
            placeholder={placeholder || 'Type your business name…'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled}
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="submit"
            className="lynx-hero__send"
            disabled={!value.trim() || disabled}
            aria-label={submitLabel}
            title={submitLabel}
          >
            <ArrowUp size={18} />
          </button>
        </form>

        <p className="lynx-hero__footnote">Just a few steps</p>
      </div>
    </div>
  );
}


/**
 * Split Lynx's welcome string into three voice layers:
 *
 *   "Hi, I'm Lynx — your Worklynx co-partner. Let's get your workspace
 *    ready. What's your business called?"
 *
 *   ↓
 *
 *   greeting: "Hi, I'm Lynx 👋"
 *   hero:     "Let's get your workspace ready."
 *   prompt:   "What's your business called?"
 */
function splitGreeting(text) {
  const fallback = {
    greeting: "Hi, I'm Lynx 👋",
    hero:     "Let's set up your workspace.",
    prompt:   "What's your business called?",
  };
  if (!text) return fallback;

  const sentences = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  if (sentences.length === 0) return fallback;
  if (sentences.length === 1) return { greeting: '', hero: sentences[0], prompt: '' };

  // Peel off the leading self-introduction ("Hi, I'm Lynx — …") and present
  // it as a soft greeting line above the headline.
  let greeting = '';
  let body = sentences;
  if (/\b(i'?m|i am)\s+lynx\b/i.test(body[0])) {
    greeting = "Hi, I'm Lynx 👋";
    body = body.slice(1);
  }
  if (!body.length) return { greeting, hero: sentences[0], prompt: '' };

  const prompt = body[body.length - 1];
  const hero   = body.slice(0, -1).join(' ') || prompt;
  return { greeting, hero, prompt: hero === prompt ? '' : prompt };
}

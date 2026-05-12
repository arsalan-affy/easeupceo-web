import React, { useEffect, useState } from 'react';
import { Pencil, Sparkles, User } from 'lucide-react';

/**
 * Single chat bubble.
 *
 * The latest *new* assistant bubble types-on subtly. Older bubbles render
 * fully so scroll-back is instant, and `instant=true` forces an immediate
 * render too (e.g. the welcome message that was already shown in the
 * hero — re-typing it would feel jarring).
 *
 * `inlineSlot` lets the parent attach a card (theme picker, logo dropzone,
 * employee preview, completion summary, …) directly under the bubble — so
 * every onboarding surface lives inside the chat thread instead of popping
 * up in a sticky composer.
 */
export default function ChatMessage({
  id,
  role,
  text,
  isLatest = false,
  instant = false,
  attachment,
  media,
  inlineSlot,
  editAction,
  onEdit,
}) {
  const isUser = role === 'user';
  const shouldType = isLatest && !isUser && !instant;
  const [typed, setTyped] = useState(shouldType ? '' : text);

  useEffect(() => {
    if (!shouldType) {
      setTyped(text);
      return;
    }
    setTyped('');
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, 14);
    return () => clearInterval(timer);
  }, [text, shouldType]);

  return (
    <div className={`lynx-msg lynx-msg--${isUser ? 'user' : 'assistant'}`}>
      <div className="lynx-msg__avatar" aria-hidden>
        {isUser ? <User size={16} /> : <Sparkles size={16} />}
      </div>
      <div className="lynx-msg__column">
        {media && <MediaCard media={media} />}
        <div className="lynx-msg__bubble">
          {!isUser && <span className="lynx-msg__name">Lynx</span>}
          {attachment && !media && (
            <div className="lynx-msg__attachment">
              <span className="lynx-msg__attachment-icon">📎</span>
              <span>{attachment}</span>
            </div>
          )}
          <div className="lynx-msg__text">
            {typed}
            {shouldType && typed.length < text.length && <span className="lynx-msg__cursor" />}
          </div>
        </div>
        {inlineSlot && <div className="lynx-msg__inline">{inlineSlot}</div>}
        {isUser && editAction && onEdit && (
          <button
            type="button"
            className="lynx-msg__edit"
            onClick={() => onEdit(id, editAction)}
            title="Go back and change this answer"
          >
            <Pencil size={11} />
            <span>Change</span>
          </button>
        )}
      </div>
    </div>
  );
}


/**
 * Rich preview attached to a user bubble. Two kinds:
 *   { kind: 'image', src: '<data-url>' }  — uploaded logo thumbnail
 *   { kind: 'theme', name, primary, secondary, accent, background }
 *                                          — selected theme card
 */
function MediaCard({ media }) {
  if (!media) return null;

  if (media.kind === 'image' && media.src) {
    return (
      <div className="lynx-msg__media lynx-msg__media--image">
        <img src={media.src} alt="Uploaded logo" />
      </div>
    );
  }

  if (media.kind === 'theme') {
    return (
      <div
        className="lynx-msg__media lynx-msg__media--theme"
        style={{ background: `linear-gradient(135deg, ${media.primary}, ${media.secondary})` }}
      >
        <div className="lynx-msg__theme-head">
          <span className="lynx-msg__theme-name">{media.name}</span>
          <span className="lynx-msg__theme-tag">Theme</span>
        </div>
        <div className="lynx-msg__theme-bar">
          <i style={{ background: media.primary    }} title={media.primary} />
          <i style={{ background: media.secondary  }} title={media.secondary} />
          <i style={{ background: media.accent     }} title={media.accent} />
          <i style={{ background: media.background, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)' }} title={media.background} />
        </div>
        <div className="lynx-msg__theme-hexes">
          <code>{media.primary}</code>
          <code>{media.secondary}</code>
          <code>{media.accent}</code>
        </div>
      </div>
    );
  }

  return null;
}

import { Sparkles } from 'lucide-react';

/**
 * Quiet "Lynx is composing" affordance — three gradient dots waving next
 * to the avatar. No chatbot label, no bubble background; just a natural
 * pause beat that fits a smooth conversation.
 */
export default function TypingIndicator() {
  return (
    <div
      className="lynx-msg lynx-msg--assistant lynx-msg--typing"
      aria-live="polite"
      aria-label="Lynx is responding"
    >
      <div className="lynx-msg__avatar lynx-msg__avatar--pulsing" aria-hidden>
        <Sparkles size={16} />
      </div>
      <div className="lynx-msg__column">
        <div className="lynx-msg__bubble lynx-msg__bubble--typing" aria-hidden>
          <span className="lynx-typing-dot" />
          <span className="lynx-typing-dot" />
          <span className="lynx-typing-dot" />
        </div>
      </div>
    </div>
  );
}

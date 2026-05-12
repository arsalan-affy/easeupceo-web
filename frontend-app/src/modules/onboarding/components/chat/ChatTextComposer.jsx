import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ChatTextComposer({ placeholder, submitLabel = 'Send', onSubmit, disabled }) {
  const [value, setValue] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    // Re-focus when the composer mounts or unlocks
    if (!disabled && ref.current) ref.current.focus();
  }, [disabled]);

  const fire = () => {
    const v = value.trim();
    if (!v || disabled) return;
    setValue('');
    onSubmit(v);
  };

  return (
    <form
      className="lynx-composer lynx-composer--text"
      onSubmit={(e) => { e.preventDefault(); fire(); }}
    >
      <input
        ref={ref}
        type="text"
        className="lynx-composer__input"
        placeholder={placeholder || 'Type your answer…'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        autoComplete="off"
        spellCheck="false"
      />
      <button
        type="submit"
        className="lynx-composer__send"
        disabled={!value.trim() || disabled}
        aria-label={submitLabel}
      >
        <ArrowUp size={18} />
      </button>
    </form>
  );
}

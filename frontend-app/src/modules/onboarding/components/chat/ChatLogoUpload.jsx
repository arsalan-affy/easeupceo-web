import React, { useCallback, useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';

/**
 * Inline logo upload card. Drag-drop or file picker. Calls onPickFile(file)
 * which the parent forwards to the chat backend with intent=logo_upload.
 */
export default function ChatLogoUpload({ onPickFile, onSkip, disabled, options = [] }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleFiles = useCallback(async (files) => {
    if (!files?.length || disabled) return;
    setBusy(true);
    try {
      await onPickFile(files[0]);
    } finally {
      setBusy(false);
    }
  }, [onPickFile, disabled]);

  const skipOpt = options.find((o) => o.id === 'no_logo');

  return (
    <div className="lynx-card-stack">
      <div
        className={`lynx-dropzone ${drag ? 'is-drag' : ''} ${busy ? 'is-busy' : ''}`}
        onClick={() => !disabled && !busy && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (!disabled) handleFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled && !busy) inputRef.current?.click();
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled || busy}
        />
        <span className="lynx-dropzone__icon">
          {busy ? <Loader2 size={22} className="lynx-spin" /> : <ImagePlus size={22} />}
        </span>
        <div>
          <div className="lynx-dropzone__title">{busy ? 'Reading your logo…' : 'Drop your logo here'}</div>
          <div className="lynx-dropzone__hint">PNG, JPG or SVG · we'll extract a brand palette</div>
        </div>
      </div>

      {skipOpt && (
        <button
          type="button"
          className="lynx-action lynx-action--ghost lynx-action--inline"
          onClick={onSkip}
          disabled={disabled || busy}
        >
          <X size={15} />
          <span>{skipOpt.label}</span>
        </button>
      )}
    </div>
  );
}

import React from 'react';
import {
  ArrowRight, Check, Download, FastForward, Sparkles, Upload,
  X, ArrowLeft,
} from 'lucide-react';

const ICON_MAP = {
  upload:   Upload,
  download: Download,
  sparkles: Sparkles,
  skip:     FastForward,
  check:    Check,
  arrow:    ArrowRight,
  back:     ArrowLeft,
  x:        X,
};

export default function ChatActionButtons({ options = [], onPick, disabled }) {
  if (!options.length) return null;
  return (
    <div className="lynx-actions">
      {options.map((opt) => {
        const Icon = ICON_MAP[opt.icon || ''] || null;
        return (
          <button
            key={opt.id}
            type="button"
            className={`lynx-action lynx-action--${opt.variant || 'ghost'}`}
            onClick={() => onPick(opt)}
            disabled={disabled}
          >
            {Icon && <Icon size={16} />}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

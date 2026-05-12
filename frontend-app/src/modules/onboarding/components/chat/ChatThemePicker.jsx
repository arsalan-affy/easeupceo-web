import React, { useEffect, useMemo, useState } from 'react';
import { Check, Palette, Sparkles } from 'lucide-react';

import ThemePreview from '../ThemePreview';

function paletteId(p) {
  if (!p) return null;
  return `${p.source || 'logo'}:${p.name}`;
}

/**
 * In-chat theme picker:
 *   - Two groups: Matched-to-your-logo (only when logo was uploaded) + Standard.
 *   - Tap to preview live in the dashboard mock on the right.
 *   - Apply button posts intent=select_theme through the chat API.
 */
export default function ChatThemePicker({ data, onSelect, disabled }) {
  const palettes  = data?.palettes || [];
  // Cap the curated set so the picker stays scannable — matched palettes
  // are already up top, and showing every standard theme makes the column
  // feel exhaustive rather than curated.
  const standard  = (data?.standard_palettes || []).slice(0, 5);
  const logoUrl   = data?.logo_url || '';

  const initial = palettes[0] || standard[0] || null;
  const [selectedId, setSelectedId] = useState(initial ? paletteId(initial) : null);

  const all = useMemo(() => [...palettes, ...standard], [palettes, standard]);
  const active = useMemo(
    () => all.find((p) => paletteId(p) === selectedId) || initial,
    [all, selectedId, initial]
  );

  // Reset preview when the data changes (e.g. user re-uploads logo)
  useEffect(() => {
    setSelectedId(initial ? paletteId(initial) : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palettes.length, standard.length, logoUrl]);

  const submit = () => {
    if (!active || disabled) return;
    const { name, source, ...colors } = active;
    onSelect({
      ...colors,
      name,
      source: source === 'standard' ? 'manual' : palettes.length ? 'logo_generated' : 'manual',
    }, name);
  };

  return (
    <div className="lynx-theme-picker">
      <div className="lynx-theme-picker__cols">
        <div className="lynx-theme-picker__list">
          {palettes.length > 0 && (
            <Group icon={<Sparkles size={13} />} title="Matched to your logo" subtitle="Built from your dominant colours">
              {palettes.map((p) => (
                <PaletteRow
                  key={paletteId(p)}
                  palette={p}
                  selected={paletteId(p) === selectedId}
                  onClick={() => setSelectedId(paletteId(p))}
                />
              ))}
            </Group>
          )}

          {standard.length > 0 && (
            <Group icon={<Palette size={13} />} title="Professional themes" subtitle="Pick a curated preset">
              {standard.map((p) => (
                <PaletteRow
                  key={paletteId(p)}
                  palette={p}
                  selected={paletteId(p) === selectedId}
                  onClick={() => setSelectedId(paletteId(p))}
                />
              ))}
            </Group>
          )}
        </div>

        <div className="lynx-theme-picker__preview">
          <div className="lynx-theme-picker__preview-label">Live preview</div>
          <ThemePreview theme={active} logoUrl={logoUrl} />
        </div>
      </div>

      <button
        type="button"
        className="lynx-action lynx-action--primary lynx-action--full"
        onClick={submit}
        disabled={!active || disabled}
      >
        <Check size={16} /> Use the “{active?.name}” theme
      </button>
    </div>
  );
}

function Group({ icon, title, subtitle, children }) {
  return (
    <div className="lynx-pal-group">
      <div className="lynx-pal-group__head">
        <span className="lynx-pal-group__title">{icon} {title}</span>
        <span className="lynx-pal-group__sub">{subtitle}</span>
      </div>
      <div className="lynx-pal-list">{children}</div>
    </div>
  );
}

function PaletteRow({ palette, selected, onClick }) {
  return (
    <div
      className={`lynx-pal-row ${selected ? 'is-selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      <div className="lynx-pal-row__main" style={{ background: palette.primary }}>
        <span className="lynx-pal-row__name">{palette.name}</span>
        <span className="lynx-pal-row__chips">
          <i style={{ background: palette.secondary }} />
          <i style={{ background: palette.accent }} />
          <i style={{ background: palette.background, border: '1px solid rgba(255,255,255,0.3)' }} />
        </span>
      </div>
      <div className="lynx-pal-row__hex">
        <span className="lynx-pal-row__swatch" style={{ background: palette.primary }} />
        <code>{palette.primary}</code>
      </div>
    </div>
  );
}

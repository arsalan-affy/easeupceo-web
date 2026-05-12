import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, Eye, EyeOff, PartyPopper } from 'lucide-react';

/**
 * Final celebration view, rendered fullscreen when `fullscreen=true`.
 *
 *   <ChatComplete fullscreen onEnter={(final) => …} />
 *
 * `onEnter` receives the full onboarding payload (the same `final` shown
 * via "Show setup JSON") so the host app can POST it to its own backend
 * before navigating into the workspace.
 */
export default function ChatComplete({ fullscreen = false, data, state, options = [], onEnter, logoUrl: heroLogoUrl }) {
  const final  = data?.final?.result || data?.final || null;
  const company = state?.company?.name || final?.company?.name || 'Your Workspace';
  const theme   = state?.branding?.selected_theme || final?.branding?.selected_theme || null;
  // Prefer the absolute logo URL passed from LynxChat (resolved through
  // onboardingApi). Falls back to the relative path on the session for
  // any other caller.
  const logoUrl = heroLogoUrl || state?.branding?.logo_url || '';
  const empCount = (state?.employees?.employees || final?.employee_setup?.employees || []).length;

  const [showJson, setShowJson] = useState(false);
  const [confettiOn, setConfettiOn] = useState(true);

  // Confetti runs for ~3.4s then unmounts so the DOM stays clean.
  useEffect(() => {
    const t = setTimeout(() => setConfettiOn(false), 3400);
    return () => clearTimeout(t);
  }, []);

  const enterOpt = options.find((o) => o.id === 'enter_workspace') || { label: 'Enter Workspace' };

  const handleEnter = () => {
    // The host app receives the final payload via the `onComplete` prop
    // wired to LynxChat → here. Hook your downstream API up there (see
    // main.jsx for an example).
    if (onEnter) onEnter(final);
  };

  return (
    <div className={`lynx-complete ${fullscreen ? 'lynx-complete--fullscreen' : ''}`}>
      {confettiOn && <Confetti />}

      <div className="lynx-complete__inner">
        <div className="lynx-complete__badge">
          <PartyPopper size={14} />
          <span>Setup complete</span>
        </div>

        {logoUrl ? (
          <div className="lynx-complete__hero-logo">
            <div className="lynx-complete__hero-frame">
              <img src={logoUrl} alt={`${company} logo`} />
            </div>
            <span className="lynx-complete__hero-check" aria-hidden>
              <Check size={14} strokeWidth={3.5} />
            </span>
          </div>
        ) : (
          <div className="lynx-complete__check"><Check size={28} strokeWidth={3} /></div>
        )}

        <h1 className="lynx-complete__title">
          You’re all set, <span className="lynx-complete__title-name">{company}</span>.
        </h1>
        <p className="lynx-complete__subtitle">
          Your Worklynx workspace is configured and ready to go.
        </p>

        <div className="lynx-complete__summary">
          <SummaryItem label="Company"   value={company} />
          <SummaryItem label="Theme"     value={theme ? <Swatches theme={theme} /> : '—'} />
          <SummaryItem label="Employees" value={empCount > 0 ? `${empCount} on file` : 'Skipped — add later'} />
        </div>

        <div className="lynx-complete__cta">
          <button type="button" className="lynx-action lynx-action--primary lynx-action--xl" onClick={handleEnter}>
            {enterOpt.label} <ArrowRight size={18} />
          </button>
          <button
            type="button"
            className="lynx-action lynx-action--ghost"
            onClick={() => setShowJson((v) => !v)}
          >
            {showJson ? <EyeOff size={15} /> : <Eye size={15} />}
            {showJson ? 'Hide setup JSON' : 'Show setup JSON'}
          </button>
        </div>

        {showJson && (
          <pre className="lynx-complete__json">
{JSON.stringify(final || {}, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="lynx-complete__summary-row">
      <span className="lynx-complete__summary-label">{label}</span>
      <span className="lynx-complete__summary-value">{value}</span>
    </div>
  );
}

function Swatches({ theme }) {
  return (
    <span className="lynx-complete__swatches">
      <i style={{ background: theme.primary }} />
      <i style={{ background: theme.secondary }} />
      <i style={{ background: theme.accent }} />
    </span>
  );
}

/**
 * Center-burst confetti — 80 particles fired outward from ~the centre with
 * varied angle, distance, rotation, shape and colour. Far more dramatic
 * than the old top-of-page sprinkle, and naturally falls past the viewport.
 */
function Confetti() {
  const PIECES = 80;
  const colors = [
    '#3b82f6', '#10b981', '#f97316', '#a855f7', '#facc15',
    '#ec4899', '#06b6d4', '#84cc16', '#f43f5e', '#6366f1',
  ];
  return (
    <div className="lynx-confetti" aria-hidden>
      {Array.from({ length: PIECES }).map((_, i) => {
        const isCircle  = i % 4 === 0;
        const isLong    = i % 5 === 1;
        const size      = 6 + (i % 5) * 2;        // 6–14
        const angle     = (i / PIECES) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
        const distance  = 220 + Math.random() * 380; // travel
        const drop      = 240 + Math.random() * 360; // gravity tail
        const dx        = Math.cos(angle) * distance;
        const dy        = Math.sin(angle) * distance + drop;
        const duration  = 1.6 + Math.random() * 1.4;
        const delay     = Math.random() * 0.18;
        const spin      = 540 + Math.floor(Math.random() * 720);
        return (
          <span
            key={i}
            className="lynx-confetti__piece"
            style={{
              width:  size,
              height: isLong ? size * 2 : size,
              background: colors[i % colors.length],
              borderRadius: isCircle ? '50%' : '2px',
              animationDuration: `${duration}s`,
              animationDelay:    `${delay}s`,
              ['--dx']:   `${dx}px`,
              ['--dy']:   `${dy}px`,
              ['--spin']: `${spin}deg`,
            }}
          />
        );
      })}
    </div>
  );
}

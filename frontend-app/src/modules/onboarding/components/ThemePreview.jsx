import React from 'react';
import {
  CalendarClock, ChartLine, Clock, TrendingUp, Users,
} from 'lucide-react';

/**
 * Mini HRMS dashboard preview — mirrors the live Worklynx attendance
 * overview page so the user can see exactly what their workspace will
 * look like with the chosen palette.
 */
export default function ThemePreview({ theme, logoUrl }) {
  if (!theme) {
    return (
      <div className="wlx-tp">
        <div className="wlx-tp__placeholder">
          <ChartLine size={28} />
          Select a theme to preview your dashboard
        </div>
      </div>
    );
  }

  const { primary, secondary, accent, background } = theme;

  return (
    <div className="wlx-tp" style={{ '--tp-primary': primary, '--tp-secondary': secondary, '--tp-accent': accent, '--tp-bg': background }}>
      <div className="wlx-tp__chrome">
        <span className="wlx-tp__dot" style={{ background: '#ff5f56' }} />
        <span className="wlx-tp__dot" style={{ background: '#ffbd2e' }} />
        <span className="wlx-tp__dot" style={{ background: '#27c93f' }} />
        <div className="wlx-tp__url">app.worklynx.com/dashboard</div>
      </div>

      <div className="wlx-tp__body">
        <div className="wlx-tp__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {logoUrl && (
              <img src={logoUrl} alt="Logo" style={{ height: '32px', width: 'auto', borderRadius: '4px', objectFit: 'contain' }} />
            )}
            <div>
              <div className="wlx-tp__title">Attendance Overview</div>
              <div className="wlx-tp__sub">March 2026</div>
            </div>
          </div>
          <span className="wlx-tp__live">
            <span className="wlx-tp__live-dot" /> Live
          </span>
        </div>

        <div className="wlx-tp__stats">
          <StatCard
            Icon={Users}
            iconBg={primary}
            label="Present Today"
            value="152"
            delta="+3%"
            deltaColor="#10b981"
          />
          <StatCard
            Icon={Clock}
            iconBg={accent}
            label="On Leave"
            value="8"
            delta="-2"
            deltaColor="#dc2626"
          />
          <StatCard
            Icon={TrendingUp}
            iconBg={secondary}
            label="Rate"
            value="94.6%"
            delta="+1.2%"
            deltaColor="#10b981"
          />
        </div>

        <div className="wlx-tp__chart-card">
          <div className="wlx-tp__chart-head">
            <span>Attendance — This Month</span>
            <CalendarClock size={14} />
          </div>
          <MiniLineChart color={primary} />
        </div>

        <div className="wlx-tp__checkins">
          <div className="wlx-tp__checkins-title">Recent Check-ins</div>
          {[
            { name: 'Arjun Sharma',  time: '09:02 AM', status: 'On time' },
            { name: 'Priya Patel',   time: '09:14 AM', status: 'On time' },
            { name: 'Rahul Verma',   time: '09:31 AM', status: 'Late' },
          ].map((row, i) => (
            <div key={i} className="wlx-tp__checkin-row">
              <span className="wlx-tp__avatar" style={{ background: primary }}>
                {row.name.charAt(0)}
              </span>
              <span className="wlx-tp__checkin-name">{row.name}</span>
              <span className="wlx-tp__checkin-time">{row.time}</span>
              <span
                className="wlx-tp__chip"
                style={{
                  background: row.status === 'Late' ? '#fef2f2' : '#ecfdf5',
                  color: row.status === 'Late' ? '#dc2626' : '#047857',
                }}
              >
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function StatCard({ Icon, iconBg, label, value, delta, deltaColor }) {
  return (
    <div className="wlx-tp__stat">
      <span className="wlx-tp__stat-icon" style={{ background: iconBg }}>
        <Icon size={16} />
      </span>
      <div className="wlx-tp__stat-body">
        <span className="wlx-tp__stat-label">{label}</span>
        <span className="wlx-tp__stat-value">{value}</span>
      </div>
      <span className="wlx-tp__stat-delta" style={{ color: deltaColor }}>{delta}</span>
    </div>
  );
}

function MiniLineChart({ color }) {
  // Smoothed sine-like curve covering the chart card
  const points = [
    [0, 60], [10, 50], [20, 65], [30, 45], [40, 58], [50, 38],
    [60, 52], [70, 32], [80, 48], [90, 28], [100, 40],
  ];
  const path =
    'M ' + points.map(([x, y]) => `${x} ${y}`).join(' L ');

  return (
    <svg viewBox="0 0 100 80" preserveAspectRatio="none" className="wlx-tp__chart">
      <defs>
        <linearGradient id="tpFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={path + ' L 100 80 L 0 80 Z'} fill="url(#tpFill)" />
      <path d={path} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

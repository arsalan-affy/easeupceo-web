import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

/**
 * Renders the validation block returned by the backend after parsing an
 * employee xlsx (state.employees.validation in the chat session).
 */
export default function ValidationReport({ validation, summary }) {
  if (!validation) return null;

  const {
    missing_columns = [],
    invalid_rows = [],
    duplicate_entries = [],
    empty_required_fields = [],
    invalid_date_formats = [],
    warnings = [],
  } = validation;

  const totalIssues =
    missing_columns.length +
    invalid_rows.length +
    duplicate_entries.length +
    empty_required_fields.length +
    invalid_date_formats.length;

  const ok = totalIssues === 0 && warnings.length === 0;

  return (
    <div className={`wlx-validation ${ok ? 'wlx-validation--ok' : ''}`}>
      <p className="wlx-validation__title">
        {ok
          ? <><CheckCircle2 size={16} color="var(--wlx-success)" /> All clear</>
          : <><AlertTriangle size={16} color="var(--wlx-warn)" /> Validation issues</>}
      </p>
      {summary && <p style={{ margin: 0, fontSize: 13 }}>{summary}</p>}

      {missing_columns.length > 0 && (
        <Group title="Missing columns">
          <ul className="wlx-validation__list">
            {missing_columns.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </Group>
      )}

      {empty_required_fields.length > 0 && (
        <Group title={`Empty required fields (${empty_required_fields.length})`}>
          <ul className="wlx-validation__list">
            {empty_required_fields.slice(0, 8).map((e, i) => (
              <li key={i}>Row {e.row}: <code>{e.field}</code></li>
            ))}
            {empty_required_fields.length > 8 && <li>… and {empty_required_fields.length - 8} more</li>}
          </ul>
        </Group>
      )}

      {invalid_date_formats.length > 0 && (
        <Group title={`Invalid dates (${invalid_date_formats.length})`}>
          <ul className="wlx-validation__list">
            {invalid_date_formats.slice(0, 6).map((e, i) => (
              <li key={i}>Row {e.row}: <code>{e.field}</code> — “{e.value}”</li>
            ))}
            {invalid_date_formats.length > 6 && <li>… and {invalid_date_formats.length - 6} more</li>}
          </ul>
        </Group>
      )}

      {duplicate_entries.length > 0 && (
        <Group title={`Duplicate entries (${duplicate_entries.length})`}>
          <ul className="wlx-validation__list">
            {duplicate_entries.slice(0, 6).map((e, i) => (
              <li key={i}>
                Row {e.row}: duplicate <code>{e.field}</code> “{e.value}” (first seen on row {e.first_seen_row})
              </li>
            ))}
          </ul>
        </Group>
      )}

      {invalid_rows.length > 0 && (
        <Group title={`Invalid rows (${invalid_rows.length})`}>
          <ul className="wlx-validation__list">
            {invalid_rows.slice(0, 6).map((e, i) => (
              <li key={i}>Row {e.row}: {e.reason}</li>
            ))}
          </ul>
        </Group>
      )}

      {warnings.length > 0 && (
        <Group title="Warnings">
          <ul className="wlx-validation__list">
            {warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </Group>
      )}
    </div>
  );
}

function Group({ title, children }) {
  return (
    <div className="wlx-validation__group">
      <h5>{title}</h5>
      {children}
    </div>
  );
}

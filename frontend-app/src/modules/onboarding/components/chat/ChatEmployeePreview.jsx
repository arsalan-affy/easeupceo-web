import React, { useState } from 'react';
import { AlertTriangle, ArrowLeft, Check, ChevronDown, ChevronUp, Users } from 'lucide-react';

import EmployeeTable from '../EmployeeTable';
import ValidationReport from '../ValidationReport';

/**
 * Inline card rendered after Lynx parses an employee Excel (or loads demo).
 * Shows:
 *   - one-line stat strip (count, validation status)
 *   - validation report (collapsed if zero issues)
 *   - top-N employee preview table
 *   - confirm / re-upload action buttons (driven by the chat backend)
 */
export default function ChatEmployeePreview({ data, onConfirm, onBack, disabled, options = [] }) {
  const employees   = data?.employees   || [];
  const validation  = data?.validation  || {};
  const method      = data?.method      || 'uploaded';
  const rowCount    = data?.row_count ?? employees.length;

  const blockerCount =
    (validation.missing_columns?.length      || 0) +
    (validation.invalid_rows?.length         || 0) +
    (validation.duplicate_entries?.length    || 0) +
    (validation.empty_required_fields?.length|| 0) +
    (validation.invalid_date_formats?.length || 0);
  const warningCount = validation.warnings?.length || 0;
  const allClean     = blockerCount === 0 && warningCount === 0;

  const [showDetails, setShowDetails] = useState(!allClean);

  const confirmOpt = options.find((o) => o.id === 'confirm_employees');
  const backOpt    = options.find((o) => o.id === 'back_employee_choice');

  return (
    <div className="lynx-emp-preview">
      <div className={`lynx-emp-preview__strip ${allClean ? 'is-ok' : 'is-warn'}`}>
        <span className="lynx-emp-preview__icon">
          {allClean ? <Check size={16} /> : <AlertTriangle size={16} />}
        </span>
        <div className="lynx-emp-preview__strip-text">
          <strong>{rowCount}</strong> {method === 'sample' ? 'demo' : ''} employee{rowCount === 1 ? '' : 's'} ready.
          {!allClean && (
            <span className="lynx-emp-preview__strip-meta">
              · {blockerCount} issue{blockerCount === 1 ? '' : 's'}
              {warningCount > 0 && `, ${warningCount} warning${warningCount === 1 ? '' : 's'}`}
            </span>
          )}
        </div>
        <button
          type="button"
          className="lynx-emp-preview__toggle"
          onClick={() => setShowDetails((v) => !v)}
        >
          {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showDetails ? 'Hide details' : 'See details'}
        </button>
      </div>

      {showDetails && validation && Object.keys(validation).length > 0 && (
        <div className="lynx-emp-preview__report">
          <ValidationReport validation={validation} />
        </div>
      )}

      {employees.length > 0 && (
        <div className="lynx-emp-preview__table">
          <div className="lynx-emp-preview__table-head">
            <Users size={14} />
            <span>Preview ({Math.min(employees.length, 8)} of {employees.length})</span>
          </div>
          <EmployeeTable employees={employees} maxRows={8} />
        </div>
      )}

      <div className="lynx-actions">
        {confirmOpt && (
          <button
            type="button"
            className="lynx-action lynx-action--primary"
            onClick={onConfirm}
            disabled={disabled || rowCount === 0}
          >
            <Check size={16} /> {confirmOpt.label}
          </button>
        )}
        {backOpt && (
          <button
            type="button"
            className="lynx-action lynx-action--ghost"
            onClick={onBack}
            disabled={disabled}
          >
            <ArrowLeft size={16} /> {backOpt.label}
          </button>
        )}
      </div>
    </div>
  );
}

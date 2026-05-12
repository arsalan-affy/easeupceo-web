import React from 'react';

const COLUMNS = [
  'Employee Code',
  'First Name',
  'Last Name',
  'Email',
  'Working Status',
  'Department',
  'Position',
  'Role',
];

export default function EmployeeTable({ employees = [], maxRows = 10 }) {
  const rows = employees.slice(0, maxRows);
  if (!employees.length) {
    return <p style={{ color: 'var(--wlx-muted)' }}>No employees loaded yet.</p>;
  }

  return (
    <div>
      <div className="wlx-table-wrap">
        <table className="wlx-table">
          <thead>
            <tr>
              {COLUMNS.map((c) => <th key={c}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((emp, i) => (
              <tr key={emp['Employee Code'] || emp['_id'] || i}>
                {COLUMNS.map((c) => (
                  <td key={c}>{emp[c] === undefined || emp[c] === '' ? '—' : String(emp[c])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {employees.length > maxRows && (
        <p style={{ color: 'var(--wlx-muted)', fontSize: 13, marginTop: 8 }}>
          Showing {maxRows} of {employees.length} employees.
        </p>
      )}
    </div>
  );
}

import React, { useCallback, useRef, useState } from 'react';
import { ArrowLeft, Check, Download, FileSpreadsheet, Loader2, Upload } from 'lucide-react';

import onboardingApi from '../../onboardingApi';

/**
 * In-chat employee upload card. The user has to:
 *   1. Download the template (gates the upload zone)
 *   2. Fill it in
 *   3. Drop the .xlsx back here
 *
 * The template URL points at the existing /onboarding/employees/template
 * endpoint — same file the legacy step uses, so nothing changes server-side.
 */
export default function ChatExcelUpload({ onPickFile, onBack, disabled }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const stage = busy ? 3 : downloaded ? 2 : 1;

  const handleFiles = useCallback(async (files) => {
    if (!files?.length || disabled || stage < 2) return;
    setBusy(true);
    try {
      await onPickFile(files[0]);
    } finally {
      setBusy(false);
    }
  }, [onPickFile, disabled, stage]);

  const lockUpload = stage < 2;

  return (
    <div className="lynx-excel">
      <div className="lynx-excel__steps">
        <Step n={1} active={stage === 1} done={stage > 1} icon={Download} title="Download" />
        <Step n={2} active={stage === 2} done={stage > 2} icon={FileSpreadsheet} title="Fill in" />
        <Step n={3} active={stage === 3} done={false}     icon={Upload}          title="Upload" />
      </div>

      <a
        href={onboardingApi.templateUrl()}
        download
        className={`lynx-action ${stage === 1 ? 'lynx-action--primary' : 'lynx-action--ghost'}`}
        onClick={() => setDownloaded(true)}
        style={{ textDecoration: 'none', alignSelf: 'flex-start' }}
      >
        <Download size={16} />
        <span>{downloaded ? 'Re-download template' : 'Download Template'}</span>
      </a>

      <div className={`lynx-dropzone lynx-dropzone--excel ${drag ? 'is-drag' : ''} ${lockUpload ? 'is-locked' : ''} ${busy ? 'is-busy' : ''}`}
        onClick={() => !lockUpload && !busy && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!lockUpload) setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (!lockUpload) handleFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={lockUpload ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !lockUpload && !busy) inputRef.current?.click();
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xlsm"
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={lockUpload || busy}
        />
        <span className="lynx-dropzone__icon">
          {busy ? <Loader2 size={22} className="lynx-spin" /> : <Upload size={22} />}
        </span>
        <div>
          <div className="lynx-dropzone__title">
            {busy ? 'Validating your file…' : lockUpload ? 'Download the template first' : 'Drop your filled template here'}
          </div>
          <div className="lynx-dropzone__hint">.xlsx · up to ~5MB · we'll validate it instantly</div>
        </div>
      </div>

      {onBack && (
        <button
          type="button"
          className="lynx-action lynx-action--ghost lynx-action--inline"
          onClick={onBack}
          disabled={disabled || busy}
        >
          <ArrowLeft size={15} />
          <span>Choose another option</span>
        </button>
      )}
    </div>
  );
}

function Step({ n, active, done, icon: Icon, title }) {
  return (
    <div className={`lynx-excel__step ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}`}>
      <div className="lynx-excel__num">{done ? <Check size={14} /> : n}</div>
      <Icon size={16} />
      <span>{title}</span>
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Plus, X, Copy, Check, ChevronRight, LogOut, Loader2, Settings } from 'lucide-react';
import { createClient } from '@/lib/lakshya/supabase-client';
import { ScrapeStatusBar } from '@/components/lakshya/ScrapeStatusBar';
import type { LakshyaJob, LakshyaProfile, JobStatus } from '@/lib/lakshya/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: JobStatus[] = [
  'Saved', 'Applied', 'Screening', 'Interview', 'Final Round', 'Offer', 'Rejected', 'Ghosted',
];

const STATUS_COLORS: Record<JobStatus, string> = {
  Saved: 'var(--lk-text-muted)',
  Applied: 'var(--lk-cyan)',
  Screening: 'var(--lk-purple)',
  Interview: 'var(--lk-cyan)',
  'Final Round': 'var(--lk-cyan)',
  Offer: 'var(--lk-green)',
  Rejected: 'var(--lk-red)',
  Ghosted: 'var(--lk-text-muted)',
};

const DECISION_COLORS = {
  'Apply Now': 'var(--lk-cyan)',
  'Update First': 'var(--lk-amber)',
  Skip: 'var(--lk-red)',
};

const FILTERS = ['All', 'Apply Now', 'Update First', 'Applied', 'Interview', 'Starred'] as const;
type Filter = (typeof FILTERS)[number];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(score: number | null): string {
  if (!score) return 'var(--lk-text-muted)';
  if (score >= 75) return 'var(--lk-cyan)';
  if (score >= 55) return 'var(--lk-amber)';
  return 'var(--lk-red)';
}

function filterJobs(jobs: LakshyaJob[], filter: Filter): LakshyaJob[] {
  switch (filter) {
    case 'Apply Now':
      return jobs.filter((j) => j.decision === 'Apply Now');
    case 'Update First':
      return jobs.filter((j) => j.decision === 'Update First');
    case 'Applied':
      return jobs.filter((j) => j.status === 'Applied' || j.status === 'Screening');
    case 'Interview':
      return jobs.filter((j) => j.status === 'Interview' || j.status === 'Final Round');
    case 'Starred':
      return jobs.filter((j) => j.is_starred);
    default:
      return jobs;
  }
}

// ─── CopyButton ───────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      title="Copy"
      style={{
        background: 'var(--lk-surface-2)',
        border: '1px solid var(--lk-border)',
        borderRadius: '6px',
        padding: '6px 10px',
        cursor: 'pointer',
        color: copied ? 'var(--lk-cyan)' : 'var(--lk-text-muted)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '12px',
        fontFamily: 'var(--lk-font)',
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

// ─── AddJobModal ──────────────────────────────────────────────────────────────

function AddJobModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: (job: LakshyaJob) => void;
}) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jdText, setJdText] = useState('');
  const [location, setLocation] = useState('');
  const [ctcRange, setCtcRange] = useState('');
  const [applyLink, setApplyLink] = useState('');
  const [portal, setPortal] = useState('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const input: React.CSSProperties = {
    background: 'var(--lk-surface-2)',
    border: '1px solid var(--lk-border)',
    color: 'var(--lk-text)',
    padding: '10px 14px',
    borderRadius: '8px',
    width: '100%',
    fontSize: '14px',
    fontFamily: 'var(--lk-font)',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const label: React.CSSProperties = {
    color: 'var(--lk-text-2)',
    fontSize: '13px',
    fontWeight: 500,
    marginBottom: '6px',
    display: 'block',
  };

  async function handleSubmit() {
    if (!company.trim() || !role.trim() || !jdText.trim()) {
      setError('Company, Role, and Job Description are required.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/lakshya/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: company.trim(),
          role: role.trim(),
          jd_text: jdText.trim(),
          location: location.trim() || undefined,
          ctc_range: ctcRange.trim() || undefined,
          apply_link: applyLink.trim() || undefined,
          portal: portal || 'manual',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add job');
      onAdded(data.job as LakshyaJob);
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '16px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: 'var(--lk-surface)',
          border: '1px solid var(--lk-border)',
          borderRadius: 'var(--lk-radius)',
          padding: '28px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ color: 'var(--lk-text)', fontSize: '18px', fontWeight: 700, margin: 0 }}>
            Add Job
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--lk-text-muted)',
              display: 'flex',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={label}>Company *</label>
              <input
                style={input}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Razorpay"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>Role *</label>
              <input
                style={input}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Lead Frontend Engineer"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={label}>Location</label>
              <input
                style={input}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>CTC Range</label>
              <input
                style={input}
                value={ctcRange}
                onChange={(e) => setCtcRange(e.target.value)}
                placeholder="e.g. 40–60 LPA"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={label}>Apply Link</label>
              <input
                style={input}
                value={applyLink}
                onChange={(e) => setApplyLink(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>Portal</label>
              <select
                value={portal}
                onChange={(e) => setPortal(e.target.value)}
                style={{ ...input, cursor: 'pointer' }}
              >
                {['manual', 'linkedin', 'naukri', 'wellfound', 'company', 'other'].map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={label}>Job Description * (paste full JD)</label>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={10}
              style={{
                ...input,
                resize: 'vertical',
                lineHeight: 1.6,
              }}
            />
          </div>

          {error && (
            <p
              style={{
                color: 'var(--lk-red)',
                fontSize: '13px',
                margin: 0,
                padding: '10px 14px',
                background: 'rgba(239,68,68,0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              {error}
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              onClick={onClose}
              disabled={isLoading}
              style={{
                background: 'transparent',
                color: 'var(--lk-text-muted)',
                border: '1px solid var(--lk-border)',
                borderRadius: '50px',
                padding: '10px 20px',
                fontSize: '14px',
                fontFamily: 'var(--lk-font)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '50px',
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: 800,
                fontFamily: 'var(--lk-font)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '140px',
                justifyContent: 'center',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  Scoring with AI...
                </>
              ) : (
                'Score & Add Job'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── JobDetailPanel ───────────────────────────────────────────────────────────

function JobDetailPanel({
  job,
  onClose,
  onUpdate,
}: {
  job: LakshyaJob;
  onClose: () => void;
  onUpdate: (updated: LakshyaJob) => void;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'prep' | 'cover' | 'cold'>('overview');
  const [coverLetter, setCoverLetter] = useState(job.cover_letter || '');
  const [coldMessage, setColdMessage] = useState(job.cold_message || '');
  const [generatingCover, setGeneratingCover] = useState(false);
  const [generatingCold, setGeneratingCold] = useState(false);
  const [status, setStatus] = useState<JobStatus>(job.status);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  async function generate(type: 'cover_letter' | 'cold_message') {
    setGenError(null);
    if (type === 'cover_letter') setGeneratingCover(true);
    else setGeneratingCold(true);

    try {
      const res = await fetch(`/api/lakshya/jobs/${job.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      if (type === 'cover_letter') {
        setCoverLetter(data.cover_letter);
        onUpdate({ ...job, cover_letter: data.cover_letter });
      } else {
        setColdMessage(data.cold_message);
        onUpdate({ ...job, cold_message: data.cold_message });
      }
    } catch (err) {
      setGenError((err as Error).message);
    } finally {
      setGeneratingCover(false);
      setGeneratingCold(false);
    }
  }

  async function updateStatus(newStatus: JobStatus) {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/lakshya/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          applied_date: newStatus === 'Applied' ? new Date().toISOString() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus(newStatus);
      onUpdate({ ...job, status: newStatus });
    } catch (err) {
      setGenError((err as Error).message);
    } finally {
      setUpdatingStatus(false);
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'prep', label: 'Interview Prep' },
    { id: 'cover', label: 'Cover Letter' },
    { id: 'cold', label: 'Cold Message' },
  ] as const;

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    maxWidth: '560px',
    background: 'var(--lk-surface)',
    borderLeft: '1px solid var(--lk-border)',
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 49,
        }}
      />
      <div style={panelStyle}>
        {/* Panel header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--lk-border)',
            position: 'sticky',
            top: 0,
            background: 'var(--lk-surface)',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2
                style={{
                  color: 'var(--lk-text)',
                  fontSize: '18px',
                  fontWeight: 700,
                  margin: '0 0 2px',
                }}
              >
                {job.company}
              </h2>
              <p style={{ color: 'var(--lk-text-2)', fontSize: '14px', margin: '0 0 12px' }}>
                {job.role}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span
                  style={{
                    fontFamily: 'var(--lk-font-mono)',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: scoreColor(job.match_score),
                  }}
                >
                  {job.match_score ?? '—'}%
                </span>
                {job.decision && (
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: DECISION_COLORS[job.decision],
                      background: `${DECISION_COLORS[job.decision]}18`,
                      padding: '2px 10px',
                      borderRadius: '99px',
                      border: `1px solid ${DECISION_COLORS[job.decision]}40`,
                    }}
                  >
                    {job.decision}
                  </span>
                )}
                {job.is_moonshot && (
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--lk-purple)',
                      background: 'rgba(139,92,246,0.1)',
                      padding: '2px 10px',
                      borderRadius: '99px',
                      border: '1px solid rgba(139,92,246,0.3)',
                    }}
                  >
                    Moonshot
                  </span>
                )}
                {job.location && (
                  <span style={{ fontSize: '12px', color: 'var(--lk-text-muted)' }}>
                    {job.location}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--lk-text-muted)',
                display: 'flex',
                padding: '4px',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Status selector */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={updatingStatus}
                  style={{
                    fontSize: '12px',
                    fontFamily: 'var(--lk-font)',
                    padding: '4px 10px',
                    borderRadius: '99px',
                    cursor: updatingStatus ? 'not-allowed' : 'pointer',
                    border: `1px solid ${s === status ? STATUS_COLORS[s] + '80' : 'var(--lk-border)'}`,
                    background: s === status ? `${STATUS_COLORS[s]}18` : 'transparent',
                    color: s === status ? STATUS_COLORS[s] : 'var(--lk-text-muted)',
                    fontWeight: s === status ? 600 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Apply link */}
          {job.apply_link && (
            <a
              href={job.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '12px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--lk-cyan)',
                textDecoration: 'none',
              }}
            >
              Apply Now <ChevronRight size={14} />
            </a>
          )}
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--lk-border)',
            padding: '0 24px',
            gap: '0',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--lk-cyan)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--lk-cyan)' : 'var(--lk-text-muted)',
                fontFamily: 'var(--lk-font)',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? 600 : 400,
                padding: '12px 16px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: '24px', flex: 1 }}>
          {genError && (
            <p
              style={{
                color: 'var(--lk-red)',
                fontSize: '13px',
                padding: '10px 14px',
                background: 'rgba(239,68,68,0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(239,68,68,0.2)',
                marginBottom: '16px',
              }}
            >
              {genError}
            </p>
          )}

          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {job.jd_summary && (
                <Section title="JD Summary">
                  <p style={{ color: 'var(--lk-text-2)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
                    {job.jd_summary}
                  </p>
                </Section>
              )}

              {job.decision_reason && (
                <Section title="Decision Rationale">
                  <p style={{ color: 'var(--lk-text-2)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
                    {job.decision_reason}
                  </p>
                </Section>
              )}

              {job.why_fit?.length > 0 && (
                <Section title="Why You Fit">
                  <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {job.why_fit.map((point, i) => (
                      <li key={i} style={{ color: 'var(--lk-text-2)', fontSize: '14px', lineHeight: 1.6 }}>
                        {point}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {job.gaps?.length > 0 && (
                <Section title="Gaps">
                  <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {job.gaps.map((gap, i) => (
                      <li key={i} style={{ color: 'var(--lk-red)', fontSize: '14px', lineHeight: 1.6 }}>
                        {gap}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {job.resume_updates?.length > 0 && (
                <Section title="Resume Updates to Make">
                  <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {job.resume_updates.map((upd, i) => (
                      <li key={i} style={{ color: 'var(--lk-text-2)', fontSize: '14px', lineHeight: 1.6 }}>
                        {upd}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {job.study_topics?.length > 0 && (
                <Section title="Study Topics">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {job.study_topics.map((t, i) => (
                      <div
                        key={i}
                        style={{
                          background: 'var(--lk-surface-2)',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '8px',
                        }}
                      >
                        <div>
                          <p style={{ color: 'var(--lk-text)', fontSize: '13px', fontWeight: 600, margin: '0 0 2px' }}>
                            {t.topic}
                          </p>
                          <p style={{ color: 'var(--lk-text-muted)', fontSize: '12px', margin: 0 }}>
                            {t.resource}
                          </p>
                        </div>
                        <span
                          style={{
                            fontFamily: 'var(--lk-font-mono)',
                            fontSize: '12px',
                            color: 'var(--lk-cyan)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {t.hours}h
                        </span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          )}

          {activeTab === 'prep' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {job.interview_questions?.length > 0 ? (
                job.interview_questions.map((q, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--lk-surface-2)',
                      borderRadius: '8px',
                      padding: '14px',
                      borderLeft: `3px solid ${
                        q.difficulty === 'Hard'
                          ? 'var(--lk-red)'
                          : q.difficulty === 'Medium'
                          ? 'var(--lk-amber)'
                          : 'var(--lk-green)'
                      }`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontFamily: 'var(--lk-font-mono)',
                          color:
                            q.difficulty === 'Hard'
                              ? 'var(--lk-red)'
                              : q.difficulty === 'Medium'
                              ? 'var(--lk-amber)'
                              : 'var(--lk-green)',
                        }}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                    <p style={{ color: 'var(--lk-text)', fontSize: '14px', fontWeight: 600, margin: '0 0 6px', lineHeight: 1.5 }}>
                      {q.q}
                    </p>
                    <p style={{ color: 'var(--lk-text-muted)', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>
                      {q.angle}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--lk-text-muted)', fontSize: '14px' }}>
                  No interview questions generated yet.
                </p>
              )}
            </div>
          )}

          {activeTab === 'cover' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {coverLetter ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <CopyButton text={coverLetter} />
                  </div>
                  <div
                    style={{
                      background: 'var(--lk-surface-2)',
                      borderRadius: '8px',
                      padding: '16px',
                      color: 'var(--lk-text-2)',
                      fontSize: '14px',
                      lineHeight: 1.8,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {coverLetter}
                  </div>
                  <button
                    onClick={() => generate('cover_letter')}
                    disabled={generatingCover}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--lk-border)',
                      borderRadius: '50px',
                      padding: '8px 16px',
                      color: 'var(--lk-text-muted)',
                      fontFamily: 'var(--lk-font)',
                      fontSize: '13px',
                      cursor: generatingCover ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {generatingCover ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                    Regenerate
                  </button>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <p style={{ color: 'var(--lk-text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                    No cover letter yet. Generate one tailored to this role.
                  </p>
                  <button
                    onClick={() => generate('cover_letter')}
                    disabled={generatingCover}
                    style={{
                      background: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '50px',
                      padding: '10px 24px',
                      fontSize: '14px',
                      fontWeight: 800,
                      fontFamily: 'var(--lk-font)',
                      cursor: generatingCover ? 'not-allowed' : 'pointer',
                      opacity: generatingCover ? 0.7 : 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {generatingCover ? (
                      <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : null}
                    {generatingCover ? 'Generating...' : 'Generate Cover Letter'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cold' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {coldMessage ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <CopyButton text={coldMessage} />
                  </div>
                  <div
                    style={{
                      background: 'var(--lk-surface-2)',
                      borderRadius: '8px',
                      padding: '16px',
                      color: 'var(--lk-text-2)',
                      fontSize: '14px',
                      lineHeight: 1.8,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {coldMessage}
                  </div>
                  <button
                    onClick={() => generate('cold_message')}
                    disabled={generatingCold}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--lk-border)',
                      borderRadius: '50px',
                      padding: '8px 16px',
                      color: 'var(--lk-text-muted)',
                      fontFamily: 'var(--lk-font)',
                      fontSize: '13px',
                      cursor: generatingCold ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {generatingCold ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                    Regenerate
                  </button>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <p style={{ color: 'var(--lk-text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                    No cold message yet. Generate a 150-word LinkedIn DM.
                  </p>
                  <button
                    onClick={() => generate('cold_message')}
                    disabled={generatingCold}
                    style={{
                      background: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '50px',
                      padding: '10px 24px',
                      fontSize: '14px',
                      fontWeight: 800,
                      fontFamily: 'var(--lk-font)',
                      cursor: generatingCold ? 'not-allowed' : 'pointer',
                      opacity: generatingCold ? 0.7 : 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {generatingCold ? (
                      <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : null}
                    {generatingCold ? 'Generating...' : 'Generate Cold Message'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        style={{
          fontFamily: 'var(--lk-font-mono)',
          fontSize: '11px',
          color: 'var(--lk-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          margin: '0 0 10px',
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

// ─── JobCard ──────────────────────────────────────────────────────────────────

function JobCard({
  job,
  onSelect,
  onToggleStar,
}: {
  job: LakshyaJob;
  onSelect: () => void;
  onToggleStar: () => void;
}) {
  return (
    <div
      style={{
        background: 'var(--lk-surface)',
        border: '1px solid var(--lk-border)',
        borderRadius: 'var(--lk-radius)',
        padding: '20px',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--lk-border-hover)')
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--lk-border)')
      }
      onClick={onSelect}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              color: 'var(--lk-text)',
              fontSize: '16px',
              fontWeight: 700,
              margin: '0 0 2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {job.company}
          </h3>
          <p
            style={{
              color: 'var(--lk-text-2)',
              fontSize: '14px',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {job.role}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
          {/* Match score */}
          <span
            style={{
              fontFamily: 'var(--lk-font-mono)',
              fontSize: '20px',
              fontWeight: 700,
              color: scoreColor(job.match_score),
            }}
          >
            {job.match_score ?? '—'}%
          </span>
          {/* Star */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar();
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: job.is_starred ? 'var(--lk-cyan)' : 'var(--lk-border)',
              display: 'flex',
              padding: '2px',
              transition: 'color 0.15s',
            }}
          >
            <Star size={16} fill={job.is_starred ? 'var(--lk-cyan)' : 'none'} />
          </button>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {job.decision && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: DECISION_COLORS[job.decision],
              background: `${DECISION_COLORS[job.decision]}18`,
              padding: '2px 8px',
              borderRadius: '99px',
              border: `1px solid ${DECISION_COLORS[job.decision]}40`,
            }}
          >
            {job.decision}
          </span>
        )}
        <span
          style={{
            fontSize: '11px',
            color: STATUS_COLORS[job.status],
            background: `${STATUS_COLORS[job.status]}18`,
            padding: '2px 8px',
            borderRadius: '99px',
            border: `1px solid ${STATUS_COLORS[job.status]}40`,
          }}
        >
          {job.status}
        </span>
        {job.is_moonshot && (
          <span
            style={{
              fontSize: '11px',
              color: 'var(--lk-purple)',
              background: 'rgba(139,92,246,0.1)',
              padding: '2px 8px',
              borderRadius: '99px',
              border: '1px solid rgba(139,92,246,0.3)',
            }}
          >
            Moonshot
          </span>
        )}
        {job.location && (
          <span style={{ fontSize: '11px', color: 'var(--lk-text-muted)' }}>{job.location}</span>
        )}
        {job.ctc_range && (
          <span style={{ fontSize: '11px', color: 'var(--lk-text-muted)' }}>{job.ctc_range}</span>
        )}
      </div>

      {/* Why fit preview */}
      {job.why_fit?.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          {job.why_fit.slice(0, 2).map((point, i) => (
            <p
              key={i}
              style={{
                color: 'var(--lk-text-muted)',
                fontSize: '13px',
                margin: '0 0 2px',
                lineHeight: 1.5,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              · {point}
            </p>
          ))}
        </div>
      )}

      {/* View details link */}
      <p
        style={{
          color: 'var(--lk-cyan)',
          fontSize: '12px',
          fontWeight: 600,
          margin: '8px 0 0',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2px',
        }}
      >
        View details <ChevronRight size={12} />
      </p>
    </div>
  );
}

// ─── StatsBar ─────────────────────────────────────────────────────────────────

function StatsBar({ jobs }: { jobs: LakshyaJob[] }) {
  const total = jobs.length;
  const applyNow = jobs.filter((j) => j.decision === 'Apply Now').length;
  const applied = jobs.filter((j) => j.status === 'Applied' || j.status === 'Screening' || j.status === 'Interview' || j.status === 'Final Round').length;
  const avgScore =
    jobs.length > 0
      ? Math.round(jobs.reduce((sum, j) => sum + (j.match_score ?? 0), 0) / jobs.length)
      : 0;

  const stats = [
    { label: 'Total Jobs', value: total, color: 'var(--lk-text)' },
    { label: 'Apply Now', value: applyNow, color: 'var(--lk-green)' },
    { label: 'Avg Match', value: `${avgScore}%`, color: scoreColor(avgScore) },
    { label: 'In Pipeline', value: applied, color: 'var(--lk-cyan)' },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '24px',
      }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: 'var(--lk-surface)',
            border: '1px solid var(--lk-border)',
            borderRadius: 'var(--lk-radius)',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--lk-font-mono)',
              fontSize: '24px',
              fontWeight: 700,
              color: s.color,
              margin: '0 0 4px',
            }}
          >
            {s.value}
          </p>
          <p style={{ color: 'var(--lk-text-muted)', fontSize: '12px', margin: 0 }}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardClient({
  profile,
  initialJobs,
}: {
  profile: LakshyaProfile;
  initialJobs: LakshyaJob[];
}) {
  const router = useRouter();
  const [jobs, setJobs] = useState<LakshyaJob[]>(initialJobs);
  const [filter, setFilter] = useState<Filter>('All');
  const [selectedJob, setSelectedJob] = useState<LakshyaJob | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const filteredJobs = filterJobs(jobs, filter);

  const handleJobAdded = useCallback((job: LakshyaJob) => {
    setJobs((prev) => [job, ...prev]);
    setShowAddModal(false);
    setSelectedJob(job);
  }, []);

  const handleJobUpdated = useCallback((updated: LakshyaJob) => {
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    if (selectedJob?.id === updated.id) setSelectedJob(updated);
  }, [selectedJob]);

  async function handleToggleStar(job: LakshyaJob) {
    const updated = { ...job, is_starred: !job.is_starred };
    setJobs((prev) => prev.map((j) => (j.id === job.id ? updated : j)));
    await fetch(`/api/lakshya/jobs/${job.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_starred: updated.is_starred }),
    });
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/lakshya/login');
  }

  const avatarInitial =
    profile.full_name?.charAt(0).toUpperCase() ||
    profile.email?.charAt(0).toUpperCase() ||
    '?';

  return (
    <div
      style={{
        minHeight: '100vh',
        fontFamily: 'var(--lk-font)',
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid var(--lk-border)',
          padding: '0 24px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: 'var(--lk-bg)',
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--lk-font-mono)',
            color: 'var(--lk-cyan)',
            fontSize: '18px',
            fontWeight: 500,
            margin: 0,
            letterSpacing: '-0.5px',
          }}
        >
          लक्ष्य Lakshya
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: '#ffffff',
              color: '#000000',
              border: 'none',
              borderRadius: '50px',
              padding: '7px 14px',
              fontSize: '13px',
              fontWeight: 800,
              fontFamily: 'var(--lk-font)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Plus size={14} />
            Add Job
          </button>

          {/* Avatar */}
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--lk-cyan-dim)',
                border: '1px solid var(--lk-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--lk-font-mono)',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--lk-cyan)',
              }}
            >
              {avatarInitial}
            </div>
          )}

          {/* Settings */}
          <Link href="/lakshya/settings" title="Settings" style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--lk-text-muted)', display: 'flex', padding: '4px',
            textDecoration: 'none',
          }}>
            <Settings size={16} />
          </Link>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            title="Sign out"
            style={{
              background: 'none',
              border: 'none',
              cursor: isSigningOut ? 'not-allowed' : 'pointer',
              color: 'var(--lk-text-muted)',
              display: 'flex',
              padding: '4px',
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Nav */}
      <nav style={{
        borderBottom: '1px solid var(--lk-border)',
        padding: '0 24px',
        display: 'flex',
        gap: '0',
        overflow: 'auto',
      }}>
        {[
          { href: '/lakshya/dashboard', label: 'Dashboard' },
          { href: '/lakshya/tracker', label: 'Tracker' },
          { href: '/lakshya/prep', label: 'Prep' },
          { href: '/lakshya/study', label: 'Study' },
          { href: '/lakshya/insights', label: 'Insights' },
        ].map(({ href, label }) => (
          <Link key={href} href={href} style={{
            padding: '10px 16px', fontSize: '13px',
            fontFamily: 'var(--lk-font)', textDecoration: 'none',
            color: 'var(--lk-text-muted)', borderBottom: '2px solid transparent',
            whiteSpace: 'nowrap', display: 'block',
          }}>
            {label}
          </Link>
        ))}
      </nav>

      {/* Main content */}
      <main style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Scrape status */}
        <ScrapeStatusBar profile={profile} onJobsRefreshed={(newJobs) => setJobs(newJobs)} />

        {/* Stats */}
        <StatsBar jobs={jobs} />

        {/* Filters */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'var(--lk-cyan-dim)' : 'transparent',
                border: filter === f ? '1px solid var(--lk-cyan)' : '1px solid var(--lk-border)',
                color: filter === f ? 'var(--lk-cyan)' : 'var(--lk-text-muted)',
                borderRadius: '99px',
                padding: '6px 16px',
                fontSize: '13px',
                fontFamily: 'var(--lk-font)',
                fontWeight: filter === f ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {f}
              {f !== 'All' && (
                <span style={{ marginLeft: '6px', fontFamily: 'var(--lk-font-mono)', fontSize: '11px' }}>
                  ({filterJobs(jobs, f).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Job list */}
        {filteredJobs.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '64px 24px',
              color: 'var(--lk-text-muted)',
            }}
          >
            {jobs.length === 0 ? (
              <>
                <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--lk-text-2)', marginBottom: '8px' }}>
                  No jobs yet
                </p>
                <p style={{ fontSize: '14px', marginBottom: '20px' }}>
                  Add your first job to get AI-powered match scoring.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  style={{
                    background: '#ffffff',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '10px 24px',
                    fontSize: '14px',
                    fontWeight: 800,
                    fontFamily: 'var(--lk-font)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Plus size={16} />
                  Add Your First Job
                </button>
              </>
            ) : (
              <p style={{ fontSize: '14px' }}>No jobs match this filter.</p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSelect={() => setSelectedJob(job)}
                onToggleStar={() => handleToggleStar(job)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add job modal */}
      {showAddModal && (
        <AddJobModal onClose={() => setShowAddModal(false)} onAdded={handleJobAdded} />
      )}

      {/* Job detail panel */}
      {selectedJob && (
        <JobDetailPanel
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onUpdate={handleJobUpdated}
        />
      )}

      {/* CSS for spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

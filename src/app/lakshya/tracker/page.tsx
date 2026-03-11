'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Loader2, GripVertical } from 'lucide-react';
import type { LakshyaJob, JobStatus } from '@/lib/lakshya/types';

const COLUMNS: JobStatus[] = ['Saved','Applied','Screening','Interview','Final Round','Offer','Rejected','Ghosted'];

const COLUMN_COLORS: Record<JobStatus, string> = {
  Saved: 'var(--lk-text-muted)',
  Applied: 'var(--lk-cyan)',
  Screening: 'var(--lk-purple)',
  Interview: 'var(--lk-cyan)',
  'Final Round': 'var(--lk-amber)',
  Offer: 'var(--lk-green)',
  Rejected: 'var(--lk-red)',
  Ghosted: 'var(--lk-text-muted)',
};

function scoreColor(score: number | null) {
  if (!score) return 'var(--lk-text-muted)';
  if (score >= 75) return 'var(--lk-cyan)';
  if (score >= 55) return 'var(--lk-amber)';
  return 'var(--lk-red)';
}

function daysSince(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1d ago';
  return `${days}d ago`;
}

interface JobsResponse { jobs?: LakshyaJob[] }

export default function TrackerPage() {
  const [jobs, setJobs] = useState<LakshyaJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<JobStatus | null>(null);
  const [selectedJob, setSelectedJob] = useState<LakshyaJob | null>(null);

  useEffect(() => {
    fetch('/api/lakshya/jobs').then(r => r.json()).then((d: JobsResponse) => {
      setJobs(d.jobs ?? []);
      setLoading(false);
    });
  }, []);

  const moveJob = useCallback(async (jobId: string, newStatus: JobStatus) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    try {
      await fetch(`/api/lakshya/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      const res = await fetch('/api/lakshya/jobs');
      const data = await res.json() as JobsResponse;
      setJobs(data.jobs ?? []);
    }
  }, []);

  const handleDrop = (col: JobStatus) => {
    if (draggingId) moveJob(draggingId, col);
    setDraggingId(null);
    setDragOverCol(null);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--lk-cyan)' }} />
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'var(--lk-font)' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--lk-border)', padding: '0 24px',
        height: '56px', display: 'flex', alignItems: 'center', gap: '16px',
        position: 'sticky', top: 0, background: 'var(--lk-bg)', zIndex: 10,
      }}>
        <Link href="/lakshya/dashboard" style={{ color: 'var(--lk-text-muted)', display: 'flex', textDecoration: 'none' }}>
          <ChevronLeft size={20} />
        </Link>
        <h1 style={{ fontFamily: 'var(--lk-font-mono)', color: 'var(--lk-text)', fontSize: '16px', fontWeight: 600, margin: 0 }}>
          Application Tracker
        </h1>
        <span style={{ fontFamily: 'var(--lk-font-mono)', fontSize: '12px', color: 'var(--lk-text-muted)' }}>
          {jobs.length} jobs
        </span>
      </header>

      {/* Board */}
      <div style={{ overflowX: 'auto', padding: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', minWidth: 'max-content' }}>
          {COLUMNS.map(col => {
            const colJobs = jobs.filter(j => j.status === col);
            const color = COLUMN_COLORS[col];
            const isOver = dragOverCol === col;
            return (
              <div key={col}
                onDragOver={(e) => { e.preventDefault(); setDragOverCol(col); }}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={() => handleDrop(col)}
                style={{
                  width: '240px', flexShrink: 0,
                  background: isOver ? 'rgba(255,255,255,0.03)' : 'transparent',
                  borderRadius: '10px', transition: 'background 0.15s',
                  border: isOver ? `1px solid ${color}40` : '1px solid transparent',
                }}>
                {/* Column header */}
                <div style={{
                  padding: '10px 12px', background: `${color}18`,
                  borderRadius: '8px 8px 0 0',
                  borderTop: `3px solid ${color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '8px',
                }}>
                  <span style={{ color, fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {col}
                  </span>
                  <span style={{
                    background: `${color}30`, color, borderRadius: '99px',
                    padding: '2px 8px', fontSize: '11px', fontFamily: 'var(--lk-font-mono)', fontWeight: 700,
                  }}>{colJobs.length}</span>
                </div>

                {/* Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 4px 8px', minHeight: '120px' }}>
                  {colJobs.map(job => (
                    <div key={job.id}
                      draggable
                      onDragStart={() => setDraggingId(job.id)}
                      onDragEnd={() => setDraggingId(null)}
                      onClick={() => setSelectedJob(job)}
                      style={{
                        background: 'var(--lk-surface)', border: '1px solid var(--lk-border)',
                        borderRadius: '8px', padding: '12px', cursor: 'pointer',
                        opacity: draggingId === job.id ? 0.4 : 1,
                        transition: 'border-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--lk-border-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--lk-border)')}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <p style={{ color: 'var(--lk-text)', fontSize: '13px', fontWeight: 700, margin: 0, flex: 1, lineHeight: 1.3 }}>
                          {job.company}
                        </p>
                        <span style={{ fontFamily: 'var(--lk-font-mono)', fontSize: '13px', fontWeight: 700, color: scoreColor(job.match_score), marginLeft: '6px', flexShrink: 0 }}>
                          {job.match_score != null ? `${job.match_score}%` : '—'}
                        </span>
                      </div>
                      <p style={{ color: 'var(--lk-text-2)', fontSize: '12px', margin: '0 0 6px', lineHeight: 1.3 }}>
                        {job.role}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {job.ctc_range && <span style={{ fontSize: '11px', color: 'var(--lk-text-muted)' }}>{job.ctc_range}</span>}
                        <span style={{ fontSize: '11px', color: 'var(--lk-text-muted)', marginLeft: 'auto' }}>
                          {daysSince(job.updated_at)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginTop: '6px', gap: '4px' }}>
                        <GripVertical size={12} style={{ color: 'var(--lk-text-muted)', opacity: 0.4 }} />
                        <span style={{ fontSize: '10px', color: 'var(--lk-text-muted)', opacity: 0.5 }}>drag to move</span>
                      </div>
                    </div>
                  ))}
                  {colJobs.length === 0 && (
                    <div style={{
                      border: '1px dashed rgba(255,255,255,0.08)',
                      borderRadius: '8px', padding: '16px', textAlign: 'center',
                      color: 'var(--lk-text-muted)', fontSize: '12px', minHeight: '80px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simple detail modal */}
      {selectedJob && (
        <div onClick={() => setSelectedJob(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: 'var(--lk-surface)', border: '1px solid var(--lk-border)',
            borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '480px',
            maxHeight: '80vh', overflowY: 'auto',
          }}>
            <h2 style={{ color: 'var(--lk-text)', fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>{selectedJob.company}</h2>
            <p style={{ color: 'var(--lk-text-2)', fontSize: '14px', margin: '0 0 16px' }}>{selectedJob.role}</p>
            {selectedJob.decision_reason && (
              <p style={{ color: 'var(--lk-text-muted)', fontSize: '13px', lineHeight: 1.6 }}>{selectedJob.decision_reason}</p>
            )}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              {selectedJob.apply_link && (
                <a href={selectedJob.apply_link} target="_blank" rel="noopener noreferrer" style={{
                  background: '#fff', color: '#000', borderRadius: '50px',
                  padding: '8px 16px', fontSize: '13px', fontWeight: 700,
                  textDecoration: 'none', fontFamily: 'var(--lk-font)',
                }}>Apply Now</a>
              )}
              <button onClick={() => setSelectedJob(null)} style={{
                background: 'transparent', border: '1px solid var(--lk-border)',
                borderRadius: '50px', padding: '8px 16px', fontSize: '13px',
                fontFamily: 'var(--lk-font)', cursor: 'pointer', color: 'var(--lk-text-muted)',
              }}>Close</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

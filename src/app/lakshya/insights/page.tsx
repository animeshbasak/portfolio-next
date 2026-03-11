'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, BarChart2, Loader2 } from 'lucide-react';
import type { LakshyaJob, LakshyaRun } from '@/lib/lakshya/types';

interface InsightsResponse { jobs?: LakshyaJob[]; runs?: LakshyaRun[] }

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function ScoreBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ flex: 1, height: '6px', background: 'var(--lk-surface-2)', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '99px', transition: 'width 0.5s' }} />
      </div>
      <span style={{ fontFamily: 'var(--lk-font-mono)', fontSize: '12px', color, fontWeight: 700, minWidth: '32px', textAlign: 'right' }}>
        {value}
      </span>
    </div>
  );
}

export default function InsightsPage() {
  const [jobs, setJobs] = useState<LakshyaJob[]>([]);
  const [runs, setRuns] = useState<LakshyaRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/lakshya/insights').then(r => r.json()).then((d: InsightsResponse) => {
      setJobs(d.jobs ?? []);
      setRuns(d.runs ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--lk-cyan)' }} />
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // Aggregations
  const scored = jobs.filter(j => j.match_score != null);
  const avgScore = scored.length > 0
    ? Math.round(scored.reduce((s, j) => s + (j.match_score ?? 0), 0) / scored.length)
    : 0;
  const applyNow = jobs.filter(j => j.decision === 'Apply Now').length;
  const updateFirst = jobs.filter(j => j.decision === 'Update First').length;
  const skip = jobs.filter(j => j.decision === 'Skip').length;
  const applied = jobs.filter(j => j.status === 'Applied').length;
  const interviews = jobs.filter(j => ['Interview', 'Final Round'].includes(j.status)).length;
  const offers = jobs.filter(j => j.status === 'Offer').length;

  // Score distribution buckets
  const buckets = [
    { label: '90-100', count: scored.filter(j => (j.match_score ?? 0) >= 90).length, color: 'var(--lk-cyan)' },
    { label: '75-89', count: scored.filter(j => (j.match_score ?? 0) >= 75 && (j.match_score ?? 0) < 90).length, color: 'var(--lk-cyan)' },
    { label: '60-74', count: scored.filter(j => (j.match_score ?? 0) >= 60 && (j.match_score ?? 0) < 75).length, color: 'var(--lk-amber)' },
    { label: '45-59', count: scored.filter(j => (j.match_score ?? 0) >= 45 && (j.match_score ?? 0) < 60).length, color: 'var(--lk-amber)' },
    { label: '0-44', count: scored.filter(j => (j.match_score ?? 0) < 45).length, color: 'var(--lk-red)' },
  ];

  // Portal breakdown
  const portalCounts = jobs.reduce<Record<string, number>>((acc, j) => {
    const p = j.portal ?? 'manual';
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart2 size={16} style={{ color: 'var(--lk-cyan)' }} />
          <h1 style={{ fontFamily: 'var(--lk-font-mono)', color: 'var(--lk-text)', fontSize: '16px', fontWeight: 600, margin: 0 }}>
            Insights
          </h1>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '32px' }}>
          {[
            { label: 'Total Jobs', value: jobs.length, color: 'var(--lk-text)' },
            { label: 'Avg Match Score', value: `${avgScore}%`, color: 'var(--lk-cyan)' },
            { label: 'Apply Now', value: applyNow, color: 'var(--lk-cyan)' },
            { label: 'Applied', value: applied, color: 'var(--lk-purple)' },
            { label: 'In Interview', value: interviews, color: 'var(--lk-amber)' },
            { label: 'Offers', value: offers, color: 'var(--lk-green)' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'var(--lk-surface)', border: '1px solid var(--lk-border)',
              borderRadius: '10px', padding: '16px',
            }}>
              <p style={{ color: 'var(--lk-text-muted)', fontSize: '12px', margin: '0 0 4px' }}>{stat.label}</p>
              <p style={{ fontFamily: 'var(--lk-font-mono)', color: stat.color, fontSize: '24px', fontWeight: 700, margin: 0 }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
          {/* Score distribution */}
          <div style={{
            background: 'var(--lk-surface)', border: '1px solid var(--lk-border)',
            borderRadius: '12px', padding: '20px',
          }}>
            <h2 style={{ color: 'var(--lk-text)', fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>
              Score Distribution
            </h2>
            {scored.length === 0 ? (
              <p style={{ color: 'var(--lk-text-muted)', fontSize: '13px' }}>No scored jobs yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {buckets.map(b => (
                  <div key={b.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--lk-text-muted)', fontSize: '12px' }}>{b.label}</span>
                    </div>
                    <ScoreBar value={b.count} max={Math.max(1, scored.length)} color={b.color} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Decision breakdown */}
          <div style={{
            background: 'var(--lk-surface)', border: '1px solid var(--lk-border)',
            borderRadius: '12px', padding: '20px',
          }}>
            <h2 style={{ color: 'var(--lk-text)', fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>
              AI Decision Breakdown
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Apply Now', value: applyNow, color: 'var(--lk-cyan)' },
                { label: 'Update First', value: updateFirst, color: 'var(--lk-amber)' },
                { label: 'Skip', value: skip, color: 'var(--lk-red)' },
              ].map(d => (
                <div key={d.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--lk-text-2)', fontSize: '13px' }}>{d.label}</span>
                  </div>
                  <ScoreBar value={d.value} max={Math.max(1, jobs.length)} color={d.color} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--lk-border)' }}>
              <h3 style={{ color: 'var(--lk-text-2)', fontSize: '13px', fontWeight: 600, margin: '0 0 8px' }}>By Portal</h3>
              {Object.entries(portalCounts).map(([portal, count]) => (
                <div key={portal} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--lk-text-muted)', fontSize: '12px', textTransform: 'capitalize' }}>{portal}</span>
                  <span style={{ fontFamily: 'var(--lk-font-mono)', color: 'var(--lk-cyan)', fontSize: '12px', fontWeight: 700 }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scrape run history */}
        <div style={{
          background: 'var(--lk-surface)', border: '1px solid var(--lk-border)',
          borderRadius: '12px', padding: '20px',
        }}>
          <h2 style={{ color: 'var(--lk-text)', fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>
            Scrape Run History
          </h2>
          {runs.length === 0 ? (
            <p style={{ color: 'var(--lk-text-muted)', fontSize: '13px' }}>
              No scrape runs yet. Use the Scrape Now button on the dashboard.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--lk-border)' }}>
                    {['Date', 'Status', 'Scraped', 'New', 'Portals', 'Errors'].map(h => (
                      <th key={h} style={{ color: 'var(--lk-text-muted)', fontWeight: 600, padding: '8px 12px', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {runs.map(run => (
                    <tr key={run.id} style={{ borderBottom: '1px solid var(--lk-border)' }}>
                      <td style={{ padding: '10px 12px', color: 'var(--lk-text-2)', whiteSpace: 'nowrap' }}>
                        {formatDate(run.created_at)}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          background: run.status === 'completed' ? 'rgba(16,185,129,0.15)'
                            : run.status === 'running' ? 'rgba(34,211,238,0.15)'
                            : 'rgba(239,68,68,0.15)',
                          color: run.status === 'completed' ? 'var(--lk-green)'
                            : run.status === 'running' ? 'var(--lk-cyan)'
                            : 'var(--lk-red)',
                          borderRadius: '99px', padding: '2px 8px',
                          fontSize: '11px', fontFamily: 'var(--lk-font-mono)', fontWeight: 700,
                          border: `1px solid ${run.status === 'completed' ? 'rgba(16,185,129,0.3)'
                            : run.status === 'running' ? 'rgba(34,211,238,0.3)'
                            : 'rgba(239,68,68,0.3)'}`,
                        }}>
                          {run.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--lk-font-mono)', color: 'var(--lk-text)' }}>{run.jobs_scraped}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--lk-font-mono)', color: 'var(--lk-cyan)', fontWeight: 700 }}>{run.jobs_new}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--lk-text-muted)', fontSize: '12px' }}>
                        {(run.portals_used ?? []).join(', ')}
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--lk-red)', fontSize: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {run.error_message ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

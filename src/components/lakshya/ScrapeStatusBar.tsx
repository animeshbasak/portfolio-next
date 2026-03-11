'use client';

import { useState, useCallback } from 'react';
import { RefreshCw, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import type { LakshyaJob, LakshyaProfile } from '@/lib/lakshya/types';

type ScrapeState = 'idle' | 'running' | 'complete' | 'error';

interface ScrapeStatusResponse {
  run: {
    status: 'running' | 'completed' | 'failed';
    jobs_new?: number;
    error_message?: string | null;
  } | null;
}

interface ScrapeStartResponse {
  runId?: string;
  error?: string;
  setupRequired?: boolean;
  scraped?: number;
  new?: number;
  portalCounts?: Record<string, number>;
}

interface JobsResponse {
  jobs?: LakshyaJob[];
}

export function ScrapeStatusBar({
  profile,
  onJobsRefreshed,
}: {
  profile: LakshyaProfile;
  onJobsRefreshed: (jobs: LakshyaJob[]) => void;
}) {
  const [state, setState] = useState<ScrapeState>('idle');
  const [message, setMessage] = useState('');
  const [newCount, setNewCount] = useState(0);

  const refreshJobs = useCallback(async () => {
    try {
      const res = await fetch('/api/lakshya/jobs');
      const data = await res.json() as JobsResponse;
      if (data.jobs) onJobsRefreshed(data.jobs);
    } catch { /* ignore */ }
  }, [onJobsRefreshed]);

  const handleScrapeNow = async () => {
    setState('running');
    setMessage('Scraping LinkedIn, Naukri, Indeed...');
    try {
      const res = await fetch('/api/lakshya/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      const data = await res.json() as ScrapeStartResponse;
      if (!res.ok) {
        setState('error');
        setMessage(data.setupRequired ? 'setup-required' : (data.error || 'Scrape failed'));
        return;
      }
      // Build per-portal breakdown for toast
      const counts = data.portalCounts ?? {};
      const breakdown = Object.entries(counts)
        .map(([p, n]) => `${p.charAt(0).toUpperCase() + p.slice(1)} (${n})`)
        .join('  ');
      setState('complete');
      setNewCount(data.new ?? 0);
      setMessage(breakdown || `${data.new ?? 0} new jobs found`);
      await refreshJobs();
    } catch (err) {
      setState('error');
      setMessage((err as Error).message);
    }
  };


  if (!profile.apify_key) {
    return (
      <div style={{
        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
        borderRadius: '8px', padding: '10px 16px', marginBottom: '20px',
        display: 'flex', alignItems: 'center', gap: '10px',
        fontFamily: 'var(--lk-font)', fontSize: '13px',
      }}>
        <AlertTriangle size={14} style={{ color: 'var(--lk-amber)', flexShrink: 0 }} />
        <span style={{ color: 'var(--lk-text-2)' }}>
          Add your Apify key in{' '}
          <Link href="/lakshya/settings" style={{ color: 'var(--lk-cyan)', textDecoration: 'none', fontWeight: 600 }}>
            Settings → API Keys
          </Link>
          {' '}to enable auto-scraping.
        </span>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--lk-surface)', border: '1px solid var(--lk-border)',
      borderRadius: '8px', padding: '10px 16px', marginBottom: '20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '16px', fontFamily: 'var(--lk-font)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {state === 'running' && (
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'var(--lk-cyan)', display: 'inline-block',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        )}
        {state === 'complete' && <CheckCircle size={14} style={{ color: 'var(--lk-green)' }} />}
        {state === 'error' && message !== 'setup-required' && <AlertTriangle size={14} style={{ color: 'var(--lk-red)' }} />}
        <span style={{
          fontSize: '13px',
          color: state === 'complete' ? 'var(--lk-green)'
            : state === 'error' ? 'var(--lk-red)'
            : 'var(--lk-text-2)',
        }}>
          {state === 'idle' && 'Ready to scrape'}
          {state === 'running' && message}
          {state === 'complete' && `${newCount} new jobs found`}
          {state === 'error' && message !== 'setup-required' && message}
          {state === 'error' && message === 'setup-required' && (
            <>Add Apify key in <Link href="/lakshya/settings" style={{ color: 'var(--lk-amber)' }}>Settings</Link></>
          )}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        {(state === 'complete' || state === 'error') && (
          <button onClick={() => { setState('idle'); setMessage(''); }} style={{
            background: 'transparent', border: '1px solid var(--lk-border)',
            borderRadius: '50px', padding: '6px 14px', fontSize: '12px',
            fontFamily: 'var(--lk-font)', cursor: 'pointer', color: 'var(--lk-text-muted)',
          }}>Reset</button>
        )}
        <button onClick={handleScrapeNow} disabled={state === 'running'} style={{
          background: state === 'running' ? 'rgba(255,255,255,0.05)' : '#ffffff',
          color: state === 'running' ? 'var(--lk-text-muted)' : '#000000',
          border: state === 'running' ? '1px solid var(--lk-border)' : 'none',
          borderRadius: '50px', padding: '6px 14px', fontSize: '13px',
          fontWeight: 700, fontFamily: 'var(--lk-font)',
          cursor: state === 'running' ? 'not-allowed' : 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: '6px',
        }}>
          {state === 'running'
            ? <><RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> Scraping...</>
            : <><Zap size={12} /> Scrape Now</>}
        </button>
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

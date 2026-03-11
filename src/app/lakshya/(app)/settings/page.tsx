'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check, X, AlertTriangle, Loader2, Settings, ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/lakshya/supabase-client';
import type { LakshyaProfile } from '@/lib/lakshya/types';

// ─── Constants ─────────────────────────────────────────────────────────────

const ROLE_OPTIONS = [
  'Lead Frontend Engineer','Staff Frontend Engineer','Principal Frontend Engineer',
  'Engineering Manager','Frontend Architect','Other',
];
const LOCATION_OPTIONS = ['Remote','Delhi NCR','Hybrid','Mumbai','Bangalore','Any'];
const DOMAIN_OPTIONS = ['Fintech','SaaS','Consumer Tech','Dev Tools','AI/ML','Gaming','Healthcare','E-commerce'];
const TECH_PRESETS = ['React','Next.js','TypeScript','JavaScript','Node.js','Vue','Angular','Python','GraphQL','React Native','PostgreSQL','MongoDB','Docker','AWS','GCP'];
const PORTAL_OPTIONS = ['linkedin','naukri','wellfound'];

type Tab = 'profile' | 'preferences' | 'apikeys' | 'danger';

// ─── Helpers ───────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
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

const labelStyle: React.CSSProperties = {
  color: 'var(--lk-text-2)',
  fontSize: '13px',
  fontWeight: 500,
  marginBottom: '6px',
  display: 'block',
};

function ToggleChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '6px 12px', borderRadius: '99px', fontSize: '13px',
      fontFamily: 'var(--lk-font)', cursor: 'pointer', transition: 'all 0.15s',
      background: selected ? 'var(--lk-cyan-dim)' : 'rgba(255,255,255,0.05)',
      border: selected ? '1px solid var(--lk-cyan)' : '1px solid rgba(255,255,255,0.08)',
      color: selected ? 'var(--lk-cyan)' : 'var(--lk-text-2)',
      fontWeight: selected ? 600 : 400,
    }}>
      {label}
    </button>
  );
}

function Toast({ message, type, onDismiss }: { message: string; type: 'success' | 'error'; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      background: type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
      border: `1px solid ${type === 'success' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
      color: type === 'success' ? 'var(--lk-green)' : 'var(--lk-red)',
      padding: '12px 20px', borderRadius: '8px', fontSize: '14px',
      fontFamily: 'var(--lk-font)', zIndex: 200,
      display: 'flex', alignItems: 'center', gap: '8px',
    }}>
      {type === 'success' ? <Check size={14} /> : <X size={14} />}
      {message}
    </div>
  );
}

function SliderField({ label, value, min, max, step = 1, unit, onChange }: {
  label: string; value: number; min: number; max: number; step?: number; unit: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label style={labelStyle}>{label}</label>
        <span style={{ fontFamily: 'var(--lk-font-mono)', fontSize: '13px', color: 'var(--lk-cyan)', fontWeight: 600 }}>
          {unit === '₹' ? `₹${value} LPA` : `${value}${unit}`}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%', accentColor: 'var(--lk-cyan)', height: '4px',
          borderRadius: '99px', outline: 'none', cursor: 'pointer',
          appearance: 'none', WebkitAppearance: 'none',
          background: `linear-gradient(to right, var(--lk-cyan) ${pct}%, var(--lk-surface-2) ${pct}%)`,
        }} />
    </div>
  );
}

// ─── Confirm Modal ─────────────────────────────────────────────────────────

function ConfirmModal({ title, message, confirmText, requireType, onConfirm, onCancel, danger }: {
  title: string; message: string; confirmText: string; requireType?: string;
  onConfirm: () => void; onCancel: () => void; danger?: boolean;
}) {
  const [typed, setTyped] = useState('');
  const canConfirm = requireType ? typed === requireType : true;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px',
    }} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div style={{
        background: 'var(--lk-surface)', border: danger ? '1px solid rgba(239,68,68,0.4)' : '1px solid var(--lk-border)',
        borderRadius: '12px', padding: '28px', width: '100%', maxWidth: '420px',
      }}>
        <h3 style={{ color: 'var(--lk-text)', fontSize: '18px', fontWeight: 700, margin: '0 0 8px' }}>{title}</h3>
        <p style={{ color: 'var(--lk-text-2)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 20px' }}>{message}</p>
        {requireType && (
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Type <strong>{requireType}</strong> to confirm</label>
            <input style={inputStyle} value={typed} onChange={(e) => setTyped(e.target.value)}
              placeholder={requireType} autoFocus />
          </div>
        )}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            background: 'transparent', color: 'var(--lk-text-muted)',
            border: '1px solid var(--lk-border)', borderRadius: '50px',
            padding: '9px 20px', fontSize: '14px', fontFamily: 'var(--lk-font)', cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={onConfirm} disabled={!canConfirm} style={{
            background: danger ? 'rgba(239,68,68,0.15)' : '#ffffff',
            color: danger ? 'var(--lk-red)' : '#000000',
            border: danger ? '1px solid rgba(239,68,68,0.4)' : 'none',
            borderRadius: '50px', padding: '9px 20px', fontSize: '14px',
            fontFamily: 'var(--lk-font)', fontWeight: 700, cursor: canConfirm ? 'pointer' : 'not-allowed',
            opacity: canConfirm ? 1 : 0.5,
          }}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Tag Editor ─────────────────────────────────────────────────────────────

function TagEditor({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState('');
  function addTag() {
    const t = input.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setInput('');
  }
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
        {tags.map((tag) => (
          <span key={tag} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'var(--lk-cyan-dim)', border: '1px solid var(--lk-cyan)',
            color: 'var(--lk-cyan)', padding: '4px 10px', borderRadius: '99px', fontSize: '13px',
          }}>
            {tag}
            <button onClick={() => onChange(tags.filter((t) => t !== tag))} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lk-cyan)',
              padding: 0, display: 'flex', alignItems: 'center',
            }}><X size={12} /></button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input style={{ ...inputStyle, flex: 1 }} value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
          placeholder="Add keyword + Enter" />
        <button onClick={addTag} style={{
          background: 'var(--lk-cyan-dim)', border: '1px solid var(--lk-cyan)',
          color: 'var(--lk-cyan)', borderRadius: '8px', padding: '10px 16px',
          fontSize: '13px', fontFamily: 'var(--lk-font)', cursor: 'pointer', fontWeight: 600,
        }}>Add</button>
      </div>
    </div>
  );
}

// ─── Toggle Switch ──────────────────────────────────────────────────────────

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!enabled)} style={{
      width: '44px', height: '24px', borderRadius: '99px',
      background: enabled ? 'var(--lk-cyan)' : 'var(--lk-surface-2)',
      border: '1px solid var(--lk-border)', cursor: 'pointer',
      position: 'relative', transition: 'background 0.2s', flexShrink: 0,
    }}>
      <span style={{
        position: 'absolute', top: '3px',
        left: enabled ? '22px' : '3px',
        width: '16px', height: '16px', borderRadius: '50%',
        background: '#fff', transition: 'left 0.2s',
      }} />
    </button>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LakshyaProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('profile');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<null | 'clear-jobs' | 'reset-onboarding' | 'delete-account'>(null);
  const [dangerLoading, setDangerLoading] = useState(false);

  // API Keys state
  const [apifyKey, setApifyKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [testingApify, setTestingApify] = useState(false);
  const [apifyStatus, setApifyStatus] = useState<'idle' | 'connected' | 'invalid'>('idle');

  // AI Keys (BYOK)
  const [anthropicKey, setAnthropicKey] = useState('');
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch('/api/lakshya/settings')
      .then((r) => r.json())
      .then(({ profile: p }: { profile: LakshyaProfile }) => {
        setProfile(p);
        setApifyKey(p?.apify_key || '');
        setAnthropicKey(p?.anthropic_key || '');
        setOpenaiKey(p?.openai_key || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const save = useCallback(async (patch: Partial<LakshyaProfile>) => {
    setSaving(true);
    try {
      const res = await fetch('/api/lakshya/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const data = await res.json() as { profile: LakshyaProfile; error?: string };
      if (!res.ok) throw new Error(data.error);
      setProfile(data.profile);
      setToast({ message: 'Saved', type: 'success' });
    } catch (err) {
      setToast({ message: (err as Error).message || 'Save failed', type: 'error' });
    } finally {
      setSaving(false);
    }
  }, []);

  const debouncedSave = useCallback((patch: Partial<LakshyaProfile>) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => save(patch), 500);
  }, [save]);

  async function testApify() {
    setTestingApify(true);
    try {
      // Save key first
      await save({ apify_key: apifyKey || null });
      const res = await fetch('/api/lakshya/settings?action=test-apify');
      const data = await res.json() as { connected: boolean };
      setApifyStatus(data.connected ? 'connected' : 'invalid');
    } catch {
      setApifyStatus('invalid');
    } finally {
      setTestingApify(false);
    }
  }

  async function handleDangerAction(action: string) {
    setDangerLoading(true);
    try {
      const res = await fetch('/api/lakshya/settings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error('Action failed');
      if (action === 'clear-jobs') {
        setToast({ message: 'All jobs cleared', type: 'success' });
      } else if (action === 'reset-onboarding') {
        router.push('/lakshya/onboarding');
      } else if (action === 'delete-account') {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/lakshya/login');
      }
    } catch {
      setToast({ message: 'Action failed', type: 'error' });
    } finally {
      setDangerLoading(false);
      setModal(null);
    }
  }

  if (loading || !profile) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--lk-cyan)' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'preferences', label: 'Job Preferences' },
    { id: 'apikeys', label: 'API Keys' },
    { id: 'danger', label: 'Danger Zone' },
  ];

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'var(--lk-font)', paddingBottom: '64px' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--lk-border)', padding: '0 24px',
        height: '56px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0,
        background: 'var(--lk-bg)', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.push('/lakshya/dashboard')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--lk-text-muted)', display: 'flex', padding: '4px',
          }}>
            <ChevronLeft size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={16} style={{ color: 'var(--lk-cyan)' }} />
            <h1 style={{
              fontFamily: 'var(--lk-font-mono)', color: 'var(--lk-text)',
              fontSize: '16px', fontWeight: 600, margin: 0,
            }}>Settings</h1>
          </div>
        </div>
        {saving && (
          <span style={{ color: 'var(--lk-text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
            Saving...
          </span>
        )}
      </header>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar"
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'var(--lk-cyan-dim)', border: '1px solid var(--lk-cyan)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--lk-font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--lk-cyan)',
            }}>
              {profile.full_name?.charAt(0).toUpperCase() || profile.email?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
          <div>
            <p style={{ color: 'var(--lk-text)', fontSize: '16px', fontWeight: 600, margin: '0 0 2px' }}>
              {profile.full_name || 'No name set'}
            </p>
            <p style={{ color: 'var(--lk-text-muted)', fontSize: '13px', margin: 0 }}>{profile.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--lk-border)', marginBottom: '32px', gap: 0 }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: 'none', border: 'none',
              borderBottom: tab === t.id ? '2px solid var(--lk-cyan)' : '2px solid transparent',
              color: tab === t.id
                ? (t.id === 'danger' ? 'var(--lk-red)' : 'var(--lk-cyan)')
                : (t.id === 'danger' ? 'rgba(239,68,68,0.6)' : 'var(--lk-text-muted)'),
              fontFamily: 'var(--lk-font)', fontSize: '13px',
              fontWeight: tab === t.id ? 600 : 400,
              padding: '10px 16px', cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1 — Profile */}
        {tab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} defaultValue={profile.full_name || ''}
                onChange={(e) => debouncedSave({ full_name: e.target.value })}
                placeholder="Your name" />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Current Company</label>
                <input style={inputStyle} defaultValue={profile.current_company || ''}
                  onChange={(e) => debouncedSave({ current_company: e.target.value })}
                  placeholder="e.g. Airtel Digital" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Current Role</label>
                <input style={inputStyle} defaultValue={profile.current_role || ''}
                  onChange={(e) => debouncedSave({ current_role: e.target.value })}
                  placeholder="e.g. Lead Frontend Engineer" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Target Roles</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {ROLE_OPTIONS.map((r) => (
                  <ToggleChip key={r} label={r} selected={profile.target_roles?.includes(r) ?? false}
                    onClick={() => {
                      const roles = profile.target_roles?.includes(r)
                        ? profile.target_roles.filter((x) => x !== r)
                        : [...(profile.target_roles || []), r];
                      setProfile({ ...profile, target_roles: roles });
                      debouncedSave({ target_roles: roles });
                    }} />
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Tech Stack</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {TECH_PRESETS.map((tech) => (
                  <ToggleChip key={tech} label={tech} selected={profile.tech_stack?.includes(tech) ?? false}
                    onClick={() => {
                      const stack = profile.tech_stack?.includes(tech)
                        ? profile.tech_stack.filter((x) => x !== tech)
                        : [...(profile.tech_stack || []), tech];
                      setProfile({ ...profile, tech_stack: stack });
                      debouncedSave({ tech_stack: stack });
                    }} />
                ))}
              </div>
            </div>
            <div style={{
              background: 'var(--lk-surface-2)', border: '1px solid var(--lk-border)',
              borderRadius: '8px', padding: '14px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ color: 'var(--lk-text)', fontSize: '14px', fontWeight: 500, margin: '0 0 2px' }}>
                  Resume
                </p>
                <p style={{ color: 'var(--lk-text-muted)', fontSize: '12px', margin: 0 }}>
                  {profile.resume_url ? 'resume.pdf' : 'No resume uploaded'}
                </p>
              </div>
              <button onClick={() => {
                fetch('/api/lakshya/settings', {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'reset-onboarding' }),
                }).then(() => router.push('/lakshya/onboarding'));
              }} style={{
                background: 'transparent', border: '1px solid var(--lk-border)',
                borderRadius: '50px', padding: '7px 16px', fontSize: '13px',
                fontFamily: 'var(--lk-font)', cursor: 'pointer', color: 'var(--lk-text-2)',
              }}>
                Re-upload
              </button>
            </div>
          </div>
        )}

        {/* TAB 2 — Job Preferences */}
        {tab === 'preferences' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SliderField
              label="Minimum Target Salary" value={profile.target_salary_min}
              min={10} max={200} step={5} unit="₹"
              onChange={(v) => {
                setProfile({ ...profile, target_salary_min: v });
                debouncedSave({ target_salary_min: v });
              }} />
            <div>
              <label style={labelStyle}>Preferred Locations</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {LOCATION_OPTIONS.map((loc) => (
                  <ToggleChip key={loc} label={loc} selected={profile.target_locations?.includes(loc) ?? false}
                    onClick={() => {
                      const locs = profile.target_locations?.includes(loc)
                        ? profile.target_locations.filter((x) => x !== loc)
                        : [...(profile.target_locations || []), loc];
                      setProfile({ ...profile, target_locations: locs });
                      debouncedSave({ target_locations: locs });
                    }} />
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Preferred Domains</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {DOMAIN_OPTIONS.map((d) => (
                  <ToggleChip key={d} label={d} selected={profile.preferred_domains?.includes(d) ?? false}
                    onClick={() => {
                      const doms = profile.preferred_domains?.includes(d)
                        ? profile.preferred_domains.filter((x) => x !== d)
                        : [...(profile.preferred_domains || []), d];
                      setProfile({ ...profile, preferred_domains: doms });
                      debouncedSave({ preferred_domains: doms });
                    }} />
                ))}
              </div>
            </div>
            <SliderField
              label="Min Match Score to show" value={profile.min_match_score}
              min={0} max={100} step={5} unit="%"
              onChange={(v) => {
                setProfile({ ...profile, min_match_score: v });
                debouncedSave({ min_match_score: v });
              }} />
            <div>
              <label style={labelStyle}>Scrape Keywords</label>
              <TagEditor
                tags={profile.scrape_keywords || []}
                onChange={(tags) => {
                  setProfile({ ...profile, scrape_keywords: tags });
                  debouncedSave({ scrape_keywords: tags });
                }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--lk-text)', fontSize: '14px', fontWeight: 500, margin: '0 0 2px' }}>
                  Auto-scraping enabled
                </p>
                <p style={{ color: 'var(--lk-text-muted)', fontSize: '12px', margin: 0 }}>
                  Run automatic daily scrape (requires Apify key)
                </p>
              </div>
              <ToggleSwitch
                enabled={profile.scraping_enabled}
                onChange={(v) => {
                  setProfile({ ...profile, scraping_enabled: v });
                  save({ scraping_enabled: v });
                }} />
            </div>
          </div>
        )}

        {/* TAB 3 — API Keys */}
        {tab === 'apikeys' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              borderLeft: '3px solid var(--lk-cyan)', background: 'var(--lk-cyan-dim)',
              padding: '14px 16px', borderRadius: '8px',
            }}>
              <p style={{ color: 'var(--lk-text-2)', fontSize: '13px', margin: '0 0 4px' }}>
                <strong style={{ color: 'var(--lk-cyan)' }}>Cron runs Mon–Fri 12:30 PM IST</strong> automatically
                when scraping is enabled.
              </p>
              <p style={{ color: 'var(--lk-text-muted)', fontSize: '12px', margin: 0 }}>
                Get a free API key at{' '}
                <a href="https://apify.com" target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--lk-cyan)' }}>apify.com</a>
              </p>
            </div>

            <div>
              <label style={labelStyle}>Apify API Key</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apifyKey}
                  onChange={(e) => { setApifyKey(e.target.value); setApifyStatus('idle'); }}
                  placeholder="apify_api_xxxxxxxxxxxxxxxxxxxx"
                  style={{ ...inputStyle, paddingRight: '44px' }} />
                <button type="button" onClick={() => setShowKey((p) => !p)} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lk-text-muted)',
                  display: 'flex', alignItems: 'center', padding: 0,
                }}>
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button onClick={testApify} disabled={testingApify || !apifyKey} style={{
              background: '#ffffff', color: '#000000', border: 'none',
              borderRadius: '50px', padding: '10px 24px', fontSize: '14px',
              fontWeight: 800, fontFamily: 'var(--lk-font)',
              cursor: testingApify || !apifyKey ? 'not-allowed' : 'pointer',
              opacity: !apifyKey ? 0.5 : 1,
              display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start',
            }}>
              {testingApify
                ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Testing...</>
                : 'Test Connection'}
            </button>

            {apifyStatus === 'connected' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--lk-green)', fontSize: '14px' }}>
                <Check size={16} /> Connected
              </div>
            )}
            {apifyStatus === 'invalid' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--lk-red)', fontSize: '14px' }}>
                <X size={16} /> Invalid key
              </div>
            )}

            <div>
              <label style={labelStyle}>Active Portals</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {PORTAL_OPTIONS.map((p) => (
                  <ToggleChip key={p} label={p.charAt(0).toUpperCase() + p.slice(1)}
                    selected={profile.scrape_portals?.includes(p) ?? false}
                    onClick={() => {
                      const portals = profile.scrape_portals?.includes(p)
                        ? profile.scrape_portals.filter((x) => x !== p)
                        : [...(profile.scrape_portals || []), p];
                      setProfile({ ...profile, scrape_portals: portals });
                      debouncedSave({ scrape_portals: portals });
                    }} />
                ))}
              </div>
            </div>

            {/* ── AI Keys (optional BYOK fallback) ─────────────────────── */}
            <div style={{
              borderTop: '1px solid var(--lk-border)', paddingTop: '24px',
              display: 'flex', flexDirection: 'column', gap: '20px',
            }}>
              <div>
                <p style={{ color: 'var(--lk-text)', fontSize: '14px', fontWeight: 600, margin: '0 0 4px' }}>
                  AI Keys <span style={{ color: 'var(--lk-text-muted)', fontWeight: 400 }}>(optional fallback)</span>
                </p>
                <p style={{ color: 'var(--lk-text-muted)', fontSize: '12px', margin: 0, lineHeight: 1.6 }}>
                  Used when the shared Claude credits are exhausted. Your key is stored encrypted and never logged.
                </p>
              </div>

              {/* Anthropic */}
              <div>
                <label style={labelStyle}>Anthropic API Key</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showAnthropicKey ? 'text' : 'password'}
                    value={anthropicKey}
                    onChange={(e) => setAnthropicKey(e.target.value)}
                    onBlur={() => { if (anthropicKey !== (profile.anthropic_key || '')) save({ anthropic_key: anthropicKey || null }); }}
                    placeholder="sk-ant-xxxxxxxxxxxxxxxxxxxx"
                    style={{ ...inputStyle, paddingRight: '44px' }} />
                  <button type="button" onClick={() => setShowAnthropicKey((v) => !v)} style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lk-text-muted)',
                    display: 'flex', alignItems: 'center', padding: 0,
                  }}>
                    {showAnthropicKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p style={{ color: 'var(--lk-text-muted)', fontSize: '12px', margin: '6px 0 0' }}>
                  Get a free key at{' '}
                  <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--lk-cyan)' }}>console.anthropic.com →</a>
                </p>
              </div>

              {/* OpenAI (coming soon) */}
              <div style={{ opacity: 0.5 }}>
                <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  OpenAI API Key
                  <span style={{
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '4px', padding: '1px 7px', fontSize: '10px',
                    color: 'var(--lk-text-muted)', fontWeight: 500, letterSpacing: '0.05em',
                  }}>COMING SOON</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showOpenaiKey ? 'text' : 'password'}
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
                    disabled
                    style={{ ...inputStyle, paddingRight: '44px', cursor: 'not-allowed' }} />
                  <button type="button" onClick={() => setShowOpenaiKey((v) => !v)} disabled style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'not-allowed', color: 'var(--lk-text-muted)',
                    display: 'flex', alignItems: 'center', padding: 0,
                  }}>
                    {showOpenaiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p style={{ color: 'var(--lk-text-muted)', fontSize: '12px', margin: '6px 0 0' }}>
                  Get key at{' '}
                  <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--lk-cyan)', pointerEvents: 'none' }}>platform.openai.com →</a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4 — Danger Zone */}
        {tab === 'danger' && (
          <div style={{
            border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px',
            padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <AlertTriangle size={16} style={{ color: 'var(--lk-red)' }} />
              <h2 style={{ color: 'var(--lk-red)', fontSize: '16px', fontWeight: 700, margin: 0 }}>Danger Zone</h2>
            </div>

            {[
              {
                id: 'clear-jobs' as const,
                title: 'Clear All Jobs',
                desc: 'Permanently delete all scraped and manually added jobs. This cannot be undone.',
                btn: 'Clear Jobs',
                modal: 'clear-jobs' as const,
              },
              {
                id: 'reset-onboarding' as const,
                title: 'Reset Onboarding',
                desc: 'Re-run the onboarding flow to update your resume and preferences.',
                btn: 'Reset',
                modal: 'reset-onboarding' as const,
              },
              {
                id: 'delete-account' as const,
                title: 'Delete Account',
                desc: 'Permanently delete your account and all associated data.',
                btn: 'Delete Account',
                modal: 'delete-account' as const,
              },
            ].map((item) => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingBottom: '20px', borderBottom: '1px solid rgba(239,68,68,0.15)',
                gap: '16px',
              }}>
                <div>
                  <p style={{ color: 'var(--lk-text)', fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>
                    {item.title}
                  </p>
                  <p style={{ color: 'var(--lk-text-muted)', fontSize: '13px', margin: 0 }}>{item.desc}</p>
                </div>
                <button onClick={() => setModal(item.modal)} disabled={dangerLoading} style={{
                  background: 'rgba(239,68,68,0.1)', color: 'var(--lk-red)',
                  border: '1px solid rgba(239,68,68,0.3)', borderRadius: '50px',
                  padding: '8px 16px', fontSize: '13px', fontFamily: 'var(--lk-font)',
                  cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 500,
                }}>
                  {item.btn}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {modal === 'clear-jobs' && (
        <ConfirmModal
          title="Clear All Jobs?" danger
          message="This will permanently delete all your scraped and manually added jobs. This action cannot be undone."
          confirmText="Clear All Jobs"
          onConfirm={() => handleDangerAction('clear-jobs')}
          onCancel={() => setModal(null)} />
      )}
      {modal === 'reset-onboarding' && (
        <ConfirmModal
          title="Reset Onboarding?" danger={false}
          message="You'll be redirected to the onboarding flow to update your resume and preferences."
          confirmText="Reset"
          onConfirm={() => handleDangerAction('reset-onboarding')}
          onCancel={() => setModal(null)} />
      )}
      {modal === 'delete-account' && (
        <ConfirmModal
          title="Delete Account?" danger
          message="This will permanently delete your account and all data. This cannot be undone."
          confirmText="Delete My Account" requireType="DELETE"
          onConfirm={() => handleDangerAction('delete-account')}
          onCancel={() => setModal(null)} />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

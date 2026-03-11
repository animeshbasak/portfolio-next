'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, X, ChevronDown, ChevronUp, Edit2, Trash2, Loader2 } from 'lucide-react';
import type { LakshyaStory, LakshyaJob } from '@/lib/lakshya/types';

interface StoriesResponse { stories?: LakshyaStory[] }
interface StoryResponse { story?: LakshyaStory; error?: string }
interface JobsResponse { jobs?: LakshyaJob[] }

const STAR_FIELDS = ['situation', 'task', 'action', 'result'] as const;
type StarField = (typeof STAR_FIELDS)[number];

const STAR_LABELS: Record<StarField, string> = {
  situation: 'Situation',
  task: 'Task',
  action: 'Action',
  result: 'Result',
};

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
  resize: 'vertical',
};

const labelStyle: React.CSSProperties = {
  color: 'var(--lk-text-2)',
  fontSize: '13px',
  fontWeight: 500,
  marginBottom: '6px',
  display: 'block',
};

interface StoryModalProps {
  story?: LakshyaStory | null;
  onSave: (story: LakshyaStory) => void;
  onClose: () => void;
}

function StoryModal({ story, onSave, onClose }: StoryModalProps) {
  const isEdit = !!story;
  const [form, setForm] = useState({
    company: story?.company || '',
    title: story?.title || '',
    situation: story?.situation || '',
    task: story?.task || '',
    action: story?.action || '',
    result: story?.result || '',
    tags: story?.tags?.join(', ') || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    if (!form.title || !form.situation || !form.task || !form.action || !form.result) {
      setError('All STAR fields are required');
      return;
    }
    setSaving(true);
    try {
      const tags = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const payload = { ...form, tags };
      const res = await fetch(
        isEdit ? `/api/lakshya/stories/${story!.id}` : '/api/lakshya/stories',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json() as StoryResponse;
      if (!res.ok) throw new Error(data.error || 'Save failed');
      onSave(data.story!);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px',
    }}>
      <div style={{
        background: 'var(--lk-surface)', border: '1px solid var(--lk-border)',
        borderRadius: '12px', padding: '28px', width: '100%', maxWidth: '560px',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ color: 'var(--lk-text)', fontSize: '18px', fontWeight: 700, margin: 0 }}>
            {isEdit ? 'Edit Story' : 'Add Story'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lk-text-muted)', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Company</label>
              <input style={inputStyle as React.CSSProperties} value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                placeholder="e.g. Airtel Digital" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Story Title</label>
            <input style={inputStyle as React.CSSProperties} value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Led migration from CRA to Next.js" />
          </div>
          {STAR_FIELDS.map(field => (
            <div key={field}>
              <label style={{
                ...labelStyle,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span style={{
                  background: 'var(--lk-cyan-dim)', color: 'var(--lk-cyan)',
                  border: '1px solid var(--lk-cyan)', borderRadius: '4px',
                  padding: '1px 6px', fontSize: '11px', fontFamily: 'var(--lk-font-mono)', fontWeight: 700,
                }}>
                  {field.charAt(0).toUpperCase()}
                </span>
                {STAR_LABELS[field]}
              </label>
              <textarea
                rows={3}
                style={inputStyle as React.CSSProperties}
                value={form[field]}
                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                placeholder={`Describe the ${STAR_LABELS[field].toLowerCase()}...`}
              />
            </div>
          ))}
          <div>
            <label style={labelStyle}>Tags (comma-separated)</label>
            <input style={inputStyle as React.CSSProperties} value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="leadership, migration, performance" />
          </div>
          {error && <p style={{ color: 'var(--lk-red)', fontSize: '13px', margin: 0 }}>{error}</p>}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{
              background: 'transparent', border: '1px solid var(--lk-border)',
              borderRadius: '50px', padding: '9px 20px', fontSize: '14px',
              fontFamily: 'var(--lk-font)', cursor: 'pointer', color: 'var(--lk-text-muted)',
            }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{
              background: '#ffffff', color: '#000000', border: 'none',
              borderRadius: '50px', padding: '9px 20px', fontSize: '14px',
              fontFamily: 'var(--lk-font)', fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}>
              {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : 'Save Story'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoryCard({ story, onEdit, onDelete }: {
  story: LakshyaStory;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: 'var(--lk-surface)', border: '1px solid var(--lk-border)',
      borderRadius: '10px', overflow: 'hidden',
    }}>
      <div style={{
        padding: '16px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', cursor: 'pointer',
        gap: '12px',
      }} onClick={() => setExpanded(e => !e)}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'var(--lk-text)', fontSize: '14px', fontWeight: 600, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {story.title}
          </p>
          <p style={{ color: 'var(--lk-text-muted)', fontSize: '12px', margin: 0 }}>
            {story.company && <>{story.company} · </>}
            {story.tags?.slice(0, 3).join(', ')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
          <button onClick={(e) => { e.stopPropagation(); onEdit(); }} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--lk-text-muted)', display: 'flex', padding: '4px',
          }}><Edit2 size={14} /></button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--lk-red)', display: 'flex', padding: '4px', opacity: 0.7,
          }}><Trash2 size={14} /></button>
          {expanded ? <ChevronUp size={16} style={{ color: 'var(--lk-text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--lk-text-muted)' }} />}
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid var(--lk-border)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {STAR_FIELDS.map(field => (
            <div key={field}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                marginBottom: '4px',
              }}>
                <span style={{
                  background: 'var(--lk-cyan-dim)', color: 'var(--lk-cyan)',
                  border: '1px solid var(--lk-cyan)', borderRadius: '4px',
                  padding: '1px 6px', fontSize: '11px', fontFamily: 'var(--lk-font-mono)', fontWeight: 700,
                }}>
                  {field.charAt(0).toUpperCase()}
                </span>
                <span style={{ color: 'var(--lk-text-2)', fontSize: '12px', fontWeight: 500 }}>
                  {STAR_LABELS[field]}
                </span>
              </span>
              <p style={{ color: 'var(--lk-text)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{story[field]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PrepPage() {
  const [stories, setStories] = useState<LakshyaStory[]>([]);
  const [jobs, setJobs] = useState<LakshyaJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editStory, setEditStory] = useState<LakshyaStory | null>(null);
  const [tab, setTab] = useState<'stories' | 'questions'>('stories');

  useEffect(() => {
    Promise.all([
      fetch('/api/lakshya/stories').then(r => r.json()) as Promise<StoriesResponse>,
      fetch('/api/lakshya/jobs').then(r => r.json()) as Promise<JobsResponse>,
    ]).then(([s, j]) => {
      setStories(s.stories ?? []);
      setJobs(j.jobs ?? []);
      setLoading(false);
    });
  }, []);

  async function handleDelete(id: string) {
    await fetch(`/api/lakshya/stories/${id}`, { method: 'DELETE' });
    setStories(prev => prev.filter(s => s.id !== id));
  }

  // Aggregate interview questions from jobs
  const allQuestions = jobs.flatMap(j =>
    (j.interview_questions || []).map(q => ({ ...q, company: j.company, role: j.role }))
  );

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
        height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, background: 'var(--lk-bg)', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/lakshya/dashboard" style={{ color: 'var(--lk-text-muted)', display: 'flex', textDecoration: 'none' }}>
            <ChevronLeft size={20} />
          </Link>
          <h1 style={{ fontFamily: 'var(--lk-font-mono)', color: 'var(--lk-text)', fontSize: '16px', fontWeight: 600, margin: 0 }}>
            Interview Prep
          </h1>
        </div>
        {tab === 'stories' && (
          <button onClick={() => { setEditStory(null); setShowModal(true); }} style={{
            background: '#ffffff', color: '#000000', border: 'none',
            borderRadius: '50px', padding: '7px 14px', fontSize: '13px',
            fontWeight: 800, fontFamily: 'var(--lk-font)', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
          }}>
            <Plus size={14} /> Add Story
          </button>
        )}
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--lk-border)', marginBottom: '24px' }}>
          {(['stories', 'questions'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: 'none', border: 'none',
              borderBottom: tab === t ? '2px solid var(--lk-cyan)' : '2px solid transparent',
              color: tab === t ? 'var(--lk-cyan)' : 'var(--lk-text-muted)',
              fontFamily: 'var(--lk-font)', fontSize: '13px',
              fontWeight: tab === t ? 600 : 400,
              padding: '10px 16px', cursor: 'pointer',
            }}>
              {t === 'stories' ? `Story Vault (${stories.length})` : `Question Bank (${allQuestions.length})`}
            </button>
          ))}
        </div>

        {tab === 'stories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stories.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '48px 24px',
                color: 'var(--lk-text-muted)', fontSize: '14px',
              }}>
                <p style={{ margin: '0 0 16px' }}>No stories yet. Add your first STAR story to prepare for behavioral interviews.</p>
                <button onClick={() => { setEditStory(null); setShowModal(true); }} style={{
                  background: '#ffffff', color: '#000000', border: 'none',
                  borderRadius: '50px', padding: '9px 20px', fontSize: '14px',
                  fontWeight: 800, fontFamily: 'var(--lk-font)', cursor: 'pointer',
                }}>Add First Story</button>
              </div>
            ) : (
              stories.map(story => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onEdit={() => { setEditStory(story); setShowModal(true); }}
                  onDelete={() => handleDelete(story.id)}
                />
              ))
            )}
          </div>
        )}

        {tab === 'questions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {allQuestions.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--lk-text-muted)', padding: '48px 24px' }}>
                No questions yet. Score some jobs with JD text to generate interview questions.
              </p>
            ) : (
              allQuestions.map((q, i) => (
                <div key={i} style={{
                  background: 'var(--lk-surface)', border: '1px solid var(--lk-border)',
                  borderRadius: '10px', padding: '16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                    <p style={{ color: 'var(--lk-text)', fontSize: '14px', fontWeight: 600, margin: 0, flex: 1 }}>{q.q}</p>
                    <span style={{
                      background: q.difficulty === 'Hard' ? 'rgba(239,68,68,0.15)'
                        : q.difficulty === 'Medium' ? 'rgba(245,158,11,0.15)'
                        : 'rgba(34,211,238,0.15)',
                      color: q.difficulty === 'Hard' ? 'var(--lk-red)'
                        : q.difficulty === 'Medium' ? 'var(--lk-amber)'
                        : 'var(--lk-cyan)',
                      border: `1px solid ${q.difficulty === 'Hard' ? 'rgba(239,68,68,0.3)'
                        : q.difficulty === 'Medium' ? 'rgba(245,158,11,0.3)'
                        : 'rgba(34,211,238,0.3)'}`,
                      borderRadius: '99px', padding: '2px 8px', fontSize: '11px',
                      fontFamily: 'var(--lk-font-mono)', fontWeight: 700, flexShrink: 0,
                    }}>{q.difficulty}</span>
                  </div>
                  <p style={{ color: 'var(--lk-text-muted)', fontSize: '12px', margin: '0 0 4px' }}>{q.angle}</p>
                  <p style={{ color: 'var(--lk-text-muted)', fontSize: '11px', margin: 0 }}>
                    {q.company} — {q.role}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {showModal && (
        <StoryModal
          story={editStory}
          onSave={(saved) => {
            if (editStory) {
              setStories(prev => prev.map(s => s.id === saved.id ? saved : s));
            } else {
              setStories(prev => [saved, ...prev]);
            }
            setShowModal(false);
            setEditStory(null);
          }}
          onClose={() => { setShowModal(false); setEditStory(null); }}
        />
      )}

      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

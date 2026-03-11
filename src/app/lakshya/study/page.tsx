'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, BookOpen, Loader2, ExternalLink, CheckCircle, Circle, PlayCircle } from 'lucide-react';
import type { LakshyaJob } from '@/lib/lakshya/types';

interface JobsResponse { jobs?: LakshyaJob[] }
interface GapsResponse { gaps?: string[] }

type CourseProgress = 'not-started' | 'in-progress' | 'completed';

interface Course {
  id: string;
  title: string;
  provider: string;
  url: string;
  topic: string;
  hours: number;
}

const COURSES: Course[] = [
  {
    id: 'system-design',
    title: 'System Design Interview – An Insider\'s Guide',
    provider: 'Coursera / ByteByteGo',
    url: 'https://www.coursera.org/learn/system-design',
    topic: 'System Design',
    hours: 20,
  },
  {
    id: 'react-advanced',
    title: 'Advanced React & TypeScript Patterns',
    provider: 'Coursera / Meta',
    url: 'https://www.coursera.org/learn/advanced-react',
    topic: 'React',
    hours: 15,
  },
  {
    id: 'node-performance',
    title: 'Node.js Performance & Architecture',
    provider: 'Coursera / IBM',
    url: 'https://www.coursera.org/learn/node-js',
    topic: 'Node.js',
    hours: 12,
  },
  {
    id: 'cloud-aws',
    title: 'AWS Solutions Architect (SAA-C03)',
    provider: 'Coursera / AWS',
    url: 'https://www.coursera.org/learn/aws-fundamentals',
    topic: 'Cloud / AWS',
    hours: 40,
  },
  {
    id: 'ml-basics',
    title: 'Machine Learning for Developers',
    provider: 'Coursera / DeepLearning.AI',
    url: 'https://www.coursera.org/learn/machine-learning',
    topic: 'AI/ML',
    hours: 30,
  },
];

const PROGRESS_ICONS: Record<CourseProgress, React.ReactNode> = {
  'not-started': <Circle size={16} style={{ color: 'var(--lk-text-muted)' }} />,
  'in-progress': <PlayCircle size={16} style={{ color: 'var(--lk-amber)' }} />,
  'completed': <CheckCircle size={16} style={{ color: 'var(--lk-green)' }} />,
};

const PROGRESS_LABELS: Record<CourseProgress, string> = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  'completed': 'Completed',
};

function nextProgress(p: CourseProgress): CourseProgress {
  if (p === 'not-started') return 'in-progress';
  if (p === 'in-progress') return 'completed';
  return 'not-started';
}

function loadProgress(): Record<string, CourseProgress> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem('lakshya-course-progress') || '{}') as Record<string, CourseProgress>;
  } catch { return {}; }
}

function saveProgress(p: Record<string, CourseProgress>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lakshya-course-progress', JSON.stringify(p));
}

function loadCheckedTopics(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem('lakshya-study-topics') || '{}') as Record<string, boolean>;
  } catch { return {}; }
}

function saveCheckedTopics(c: Record<string, boolean>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lakshya-study-topics', JSON.stringify(c));
}

export default function StudyPage() {
  const [topics, setTopics] = useState<Array<{ topic: string; hours: number; resource: string; company: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState<Record<string, CourseProgress>>({});
  const [checkedTopics, setCheckedTopics] = useState<Record<string, boolean>>({});
  const [gaps, setGaps] = useState<string[]>([]);
  const [loadingGaps, setLoadingGaps] = useState(false);
  const [tab, setTab] = useState<'topics' | 'courses' | 'gaps'>('topics');

  useEffect(() => {
    setCourseProgress(loadProgress());
    setCheckedTopics(loadCheckedTopics());
    fetch('/api/lakshya/jobs').then(r => r.json()).then((d: JobsResponse) => {
      const jobList = d.jobs ?? [];
      const topicMap = new Map<string, { topic: string; hours: number; resource: string; company: string }>();
      for (const job of jobList) {
        for (const st of (job.study_topics || [])) {
          if (!topicMap.has(st.topic)) {
            topicMap.set(st.topic, { ...st, company: job.company });
          }
        }
      }
      setTopics(Array.from(topicMap.values()));
      setLoading(false);
    });
  }, []);

  function toggleCourse(id: string) {
    const updated = { ...courseProgress, [id]: nextProgress(courseProgress[id] || 'not-started') };
    setCourseProgress(updated);
    saveProgress(updated);
  }

  function toggleTopic(key: string) {
    const updated = { ...checkedTopics, [key]: !checkedTopics[key] };
    setCheckedTopics(updated);
    saveCheckedTopics(updated);
  }

  async function analyzeGaps() {
    setLoadingGaps(true);
    try {
      const res = await fetch('/api/lakshya/insights/gaps', { method: 'POST' });
      const data = await res.json() as GapsResponse;
      setGaps(data.gaps ?? []);
      setTab('gaps');
    } catch {
      // ignore
    } finally {
      setLoadingGaps(false);
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--lk-cyan)' }} />
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const completedTopics = Object.values(checkedTopics).filter(Boolean).length;
  const completedCourses = Object.values(courseProgress).filter(p => p === 'completed').length;

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={16} style={{ color: 'var(--lk-cyan)' }} />
            <h1 style={{ fontFamily: 'var(--lk-font-mono)', color: 'var(--lk-text)', fontSize: '16px', fontWeight: 600, margin: 0 }}>
              Study Plan
            </h1>
          </div>
        </div>
        <button onClick={analyzeGaps} disabled={loadingGaps} style={{
          background: 'var(--lk-cyan-dim)', color: 'var(--lk-cyan)',
          border: '1px solid var(--lk-cyan)', borderRadius: '50px',
          padding: '6px 14px', fontSize: '13px', fontFamily: 'var(--lk-font)',
          cursor: loadingGaps ? 'not-allowed' : 'pointer', fontWeight: 600,
          display: 'inline-flex', alignItems: 'center', gap: '6px',
        }}>
          {loadingGaps ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : null}
          AI Skills Gap
        </button>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
        {/* Quick stats */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Topics to Study', value: topics.length, suffix: '' },
            { label: 'Topics Done', value: completedTopics, suffix: `/${topics.length}` },
            { label: 'Courses Completed', value: completedCourses, suffix: `/${COURSES.length}` },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: 1, background: 'var(--lk-surface)', border: '1px solid var(--lk-border)',
              borderRadius: '10px', padding: '16px',
            }}>
              <p style={{ color: 'var(--lk-text-muted)', fontSize: '12px', margin: '0 0 4px' }}>{stat.label}</p>
              <p style={{ fontFamily: 'var(--lk-font-mono)', color: 'var(--lk-cyan)', fontSize: '22px', fontWeight: 700, margin: 0 }}>
                {stat.value}<span style={{ fontSize: '14px', color: 'var(--lk-text-muted)' }}>{stat.suffix}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--lk-border)', marginBottom: '24px' }}>
          {(['topics', 'courses', 'gaps'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: 'none', border: 'none',
              borderBottom: tab === t ? '2px solid var(--lk-cyan)' : '2px solid transparent',
              color: tab === t ? 'var(--lk-cyan)' : 'var(--lk-text-muted)',
              fontFamily: 'var(--lk-font)', fontSize: '13px',
              fontWeight: tab === t ? 600 : 400,
              padding: '10px 16px', cursor: 'pointer',
            }}>
              {t === 'topics' ? 'JD Topics' : t === 'courses' ? 'Coursera Path' : 'Skills Gap'}
            </button>
          ))}
        </div>

        {tab === 'topics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topics.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--lk-text-muted)', padding: '48px 24px' }}>
                No study topics yet. Add jobs with JD text to get personalized study recommendations.
              </p>
            ) : (
              topics.map((t, i) => {
                const key = `${t.topic}-${i}`;
                const done = checkedTopics[key] ?? false;
                return (
                  <div key={key} onClick={() => toggleTopic(key)} style={{
                    background: 'var(--lk-surface)', border: '1px solid var(--lk-border)',
                    borderRadius: '8px', padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    cursor: 'pointer', opacity: done ? 0.6 : 1,
                    transition: 'opacity 0.15s',
                  }}>
                    <div style={{ flexShrink: 0 }}>
                      {done
                        ? <CheckCircle size={18} style={{ color: 'var(--lk-green)' }} />
                        : <Circle size={18} style={{ color: 'var(--lk-border)' }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        color: done ? 'var(--lk-text-muted)' : 'var(--lk-text)',
                        fontSize: '14px', fontWeight: 600, margin: '0 0 2px',
                        textDecoration: done ? 'line-through' : 'none',
                      }}>{t.topic}</p>
                      <p style={{ color: 'var(--lk-text-muted)', fontSize: '12px', margin: 0 }}>
                        {t.resource} · {t.hours}h · from {t.company}
                      </p>
                    </div>
                    <span style={{
                      fontFamily: 'var(--lk-font-mono)', fontSize: '12px',
                      color: 'var(--lk-text-muted)', flexShrink: 0,
                    }}>{t.hours}h</span>
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === 'courses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {COURSES.map(course => {
              const progress = courseProgress[course.id] || 'not-started';
              return (
                <div key={course.id} style={{
                  background: 'var(--lk-surface)', border: '1px solid var(--lk-border)',
                  borderRadius: '10px', padding: '16px',
                  borderLeft: progress === 'completed' ? '3px solid var(--lk-green)'
                    : progress === 'in-progress' ? '3px solid var(--lk-amber)'
                    : '3px solid var(--lk-border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <button onClick={() => toggleCourse(course.id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', padding: '2px', flexShrink: 0,
                    }}>
                      {PROGRESS_ICONS[progress]}
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <p style={{ color: 'var(--lk-text)', fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>
                          {course.title}
                        </p>
                        <a href={course.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{
                          color: 'var(--lk-cyan)', flexShrink: 0,
                        }}>
                          <ExternalLink size={14} />
                        </a>
                      </div>
                      <p style={{ color: 'var(--lk-text-muted)', fontSize: '12px', margin: '0 0 8px' }}>
                        {course.provider} · {course.hours}h · {course.topic}
                      </p>
                      <span style={{
                        background: progress === 'completed' ? 'rgba(16,185,129,0.15)'
                          : progress === 'in-progress' ? 'rgba(245,158,11,0.15)'
                          : 'rgba(255,255,255,0.05)',
                        color: progress === 'completed' ? 'var(--lk-green)'
                          : progress === 'in-progress' ? 'var(--lk-amber)'
                          : 'var(--lk-text-muted)',
                        borderRadius: '99px', padding: '3px 10px', fontSize: '11px',
                        fontFamily: 'var(--lk-font)', fontWeight: 600,
                        border: `1px solid ${progress === 'completed' ? 'rgba(16,185,129,0.3)'
                          : progress === 'in-progress' ? 'rgba(245,158,11,0.3)'
                          : 'rgba(255,255,255,0.08)'}`,
                      }}>
                        {PROGRESS_LABELS[progress]}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'gaps' && (
          <div>
            {gaps.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                <p style={{ color: 'var(--lk-text-muted)', fontSize: '14px', margin: '0 0 16px' }}>
                  Click &quot;AI Skills Gap&quot; to analyze your job descriptions and identify missing skills.
                </p>
                <button onClick={analyzeGaps} disabled={loadingGaps} style={{
                  background: '#ffffff', color: '#000000', border: 'none',
                  borderRadius: '50px', padding: '9px 20px', fontSize: '14px',
                  fontWeight: 800, fontFamily: 'var(--lk-font)', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                }}>
                  {loadingGaps ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                  Analyze Skills Gap
                </button>
              </div>
            ) : (
              <div>
                <p style={{ color: 'var(--lk-text-2)', fontSize: '13px', margin: '0 0 16px' }}>
                  Skills appearing frequently in your job descriptions but missing from your profile:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {gaps.map((gap, i) => (
                    <span key={i} style={{
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                      color: 'var(--lk-red)', padding: '6px 14px', borderRadius: '99px',
                      fontSize: '13px', fontWeight: 600,
                    }}>{gap}</span>
                  ))}
                </div>
                <button onClick={analyzeGaps} disabled={loadingGaps} style={{
                  marginTop: '24px',
                  background: 'transparent', border: '1px solid var(--lk-border)',
                  borderRadius: '50px', padding: '8px 20px', fontSize: '13px',
                  fontFamily: 'var(--lk-font)', cursor: 'pointer', color: 'var(--lk-text-muted)',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                }}>
                  {loadingGaps ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                  Re-analyze
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

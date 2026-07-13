'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Lab.module.css'

interface Experiment {
  id: string
  name: string
  url: string
  status: string
  statusAccent: boolean
  cta: string
  desc: string
  stack: string
}

const EXPERIMENTS: Experiment[] = [
  {
    id: 'EXP-001',
    name: 'Lakshya Hub',
    url: 'https://getlakshya.animeshbasak.com/',
    status: 'LIVE',
    statusAccent: true,
    cta: 'OPEN PRODUCT',
    desc: 'AI job-hunt copilot: resume → ATS fit score → 7-source discovery → A–G AI ranking → Kanban tracking. Multi-model routing, 290 tests green.',
    stack: 'NEXT.JS 16 · TYPESCRIPT · SUPABASE RLS · SENTRY',
  },
  {
    id: 'EXP-002',
    name: 'PAARTH Agent',
    url: 'https://github.com/animeshbasak/Paarth/blob/main/docs/superpowers/plans/2026-07-07-paarth-agent-evolution.md',
    status: 'IN DEV',
    statusAccent: false,
    cta: 'READ THE PLAN',
    desc: 'LLM-agnostic personal agent — perceive → recall → plan → act → verify. Deterministic Python kernel with safety gating, budget governing, tool-call repair.',
    stack: 'PYTHON · MCP · ANTHROPIC / GROQ / OLLAMA',
  },
  {
    id: 'EXP-003',
    name: 'PAARTH + insanemesh.ai',
    url: 'https://github.com/animeshbasak/Paarth',
    status: 'V4 · MIT',
    statusAccent: true,
    cta: 'STAR ON GITHUB',
    desc: 'Open-source routing brain under 9 AI coding tools — 53 skills, cross-session memory, cost guard. Powers insanemesh.ai, publishing daily with zero human input.',
    stack: 'CLAUDE CODE · ROUTING BRAIN · MEMORY-OS',
  },
]

function Card({ exp, index }: { exp: Experiment; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          io.unobserve(entry.target)
          setShown(true)
        })
      },
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <a
      ref={ref}
      href={exp.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cur="VISIT"
      className={`${styles.card} ${shown ? styles.shown : ''}`}
      style={{ transitionDelay: shown ? undefined : `${(index % 4) * 0.06}s` }}
    >
      <div className={styles.strip}>
        <span className={styles.stripId}>{exp.id}</span>
        <span className={exp.statusAccent ? styles.statusAcc : styles.status}>
          {exp.status}
        </span>
      </div>
      <div className={styles.body}>
        <div className={styles.name}>{exp.name}</div>
        <p className={styles.desc}>{exp.desc}</p>
        <div className={styles.stack}>{exp.stack}</div>
        <div className={styles.footerRow}>
          <span>{exp.cta}</span>
          <span className={styles.arrow}>↗</span>
        </div>
      </div>
    </a>
  )
}

export default function Lab() {
  return (
    <section id="lab" className="sec">
      <div className="sec-head">
        <span className="num">(03)</span>
        <span className="title">THE LAB</span>
        <span className="spacer" />
        <span className="hint">BUILT NIGHTS + WEEKENDS, RUNS 24/7</span>
      </div>

      <div className={styles.grid}>
        {EXPERIMENTS.map((exp, i) => (
          <Card key={exp.id} exp={exp} index={i} />
        ))}
      </div>
    </section>
  )
}

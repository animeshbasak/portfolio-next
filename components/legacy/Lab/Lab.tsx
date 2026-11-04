'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, stagger } from '@lib/motion'
import MockScreen from './MockScreen'
import LabVideo from './LabVideo'
import styles from './Lab.module.css'

type Project = {
  id: string
  name: React.ReactNode
  href?: string
  url: string
  badge: string
  live: boolean
  status: string
  /** HyperFrames prototype in /public/lab: {video}-light.mp4 and {video}-dark.mp4 */
  video: string
  alt: string
  description: string
  tags: string[]
}

// Order: public and working first, then in development. Only the facts the owner approved.
const PROJECTS: Project[] = [
  {
    id: 'paarth',
    name: <em>PAARTH</em>,
    href: 'https://github.com/animeshbasak/Paarth',
    url: 'github.com/animeshbasak/Paarth',
    badge: 'P',
    live: true,
    status: 'v4.0.0 · Public · MIT',
    video: 'paarth',
    alt: 'PAARTH prototype in three beats: ask once, it picks the route with memory and skills, then a destructive command is blocked and the cost guard switches to a free local model.',
    description:
      'An open-source routing brain for AI coding tools such as Claude Code, Cursor and Copilot. PAARTH routes the workflow and keeps context between sessions, so you can pick up where you left off. It blocks destructive commands and includes a cost guard with a free local-model fallback. Public under MIT.',
    tags: ['Claude Code', 'Routing Brain', 'Safety Gate', 'Cost Guard'],
  },
  {
    id: 'paarth-one',
    name: <>Paarth <em>One</em></>,
    href: 'https://github.com/animeshbasak/Paarth',
    url: 'github.com/animeshbasak/Paarth · Paarth One',
    badge: '1',
    live: true,
    status: 'Public · Part of PAARTH · MIT',
    video: 'paarth-one',
    alt: 'Paarth One prototype in three beats: your apps ask, one node routes each request to a cloud or local model, and it all runs as one local API on this machine.',
    description:
      'The optional local node that ships with PAARTH. It exposes model routing and workflow playbooks over loopback HTTP, so my own local apps can use the same routing as my coding tools, without sending anything off the machine to do it. Public under MIT.',
    tags: ['Model Routing', 'Local-first', 'HTTP API', 'Playbooks'],
  },
  {
    id: 'trinetra',
    name: <>Trine<em>tra</em></>,
    href: 'https://github.com/animeshbasak/trinetra',
    url: 'github.com/animeshbasak/trinetra',
    badge: 'T',
    live: true,
    status: 'v0.1 · Public · MIT',
    video: 'trinetra',
    alt: 'Trinetra prototype in three beats: an agent starts and the eye opens to keep the Mac awake, the lid closes and work carries on, then the agent finishes and the eye closes so the Mac can sleep.',
    description:
      'A macOS menu bar app that keeps my Mac awake while AI coding agents work, including with the lid closed. When the agents finish, it lets the Mac sleep again. I use it daily. Built in Swift and SwiftUI, and available as open source under MIT.',
    tags: ['Swift', 'SwiftUI', 'macOS', 'Agent Hooks'],
  },
  {
    id: 'firetv',
    name: <>fireTV <em>by insanemesh</em></>,
    url: 'fireTV by insanemesh · Fire TV Stick 4K',
    badge: 'F',
    live: true,
    status: 'Personal Build · Fork of dumbtv (MIT)',
    video: 'firetv',
    alt: 'fireTV prototype in three beats: one search across every app, picks that reorder to your usual evening, and an agents panel that sends Claude Code a task from the remote.',
    description:
      'My Fire TV home screen, forked from the open-source dumbtv launcher. On top of upstream: one search across every streaming app, picks that learn what we watch, a living background that follows the time of day, and an agents panel that shows what Claude Code, Codex and my own agents are doing and lets me send them tasks from the remote.',
    tags: ['Java', 'Fire OS', 'Recommendations', 'Agents'],
  },
  {
    id: 'paarth-agent',
    name: <>PAARTH <em>Agent</em> <small>(formerly FRIDAY)</small></>,
    url: 'paarth-agent · in development',
    badge: 'P',
    live: false,
    status: 'In Development · Not live',
    video: 'paarth-agent',
    alt: 'PAARTH Agent prototype in three beats: plan, act and verify run in a loop, the model behind it switches from Anthropic to Groq to local Ollama, and the same steps finish with a check.',
    description:
      'PAARTH Agent, formerly FRIDAY, is a personal agent in development. It separates the model you use from the steps the agent must follow: plan the work, act, then verify. A Python kernel enforces that sequence, with Anthropic, Groq or local Ollama behind one interface. The aim is to keep the process consistent while leaving the choice of model open.',
    tags: ['Python', 'LLM-agnostic', 'MCP', 'Ollama'],
  },
  {
    id: 'paarth-trader',
    name: <>PAARTH-<em>TRADER</em></>,
    url: 'paarth-trader · in development',
    badge: '₹',
    live: false,
    status: 'In Development · Paper money only',
    video: 'paarth-trader',
    alt: 'PAARTH-TRADER prototype in three beats: a paper money only stamp, an agent crew of signal, risk and review deciding a paper order, and every decision saved on record.',
    description:
      'A local-first, multi-agent research lab for paper trading across Indian equities, US equities and crypto. It trades fake money only: there is no live-trading code path, and the tests fail if a live endpoint ever appears. Inference runs locally. The goal is evidence, not income.',
    tags: ['Python', 'Multi-agent', 'Ollama', 'Backtesting'],
  },
  {
    id: 'lakshya',
    name: <>Lakshya <em>Hub</em></>,
    url: 'lakshya-hub · in development',
    badge: 'L',
    live: false,
    status: 'In Development',
    video: 'lakshya',
    alt: 'Lakshya Hub concept in three beats: paste a job, see a fit score, then turn each gap into a fix before you apply.',
    description:
      'Before you apply, see where you fit and what to fix. Lakshya Hub will turn a pasted job into a fit score, gaps and suggested fixes. In development for launch.',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'Multi-model AI'],
  },
  {
    id: 'insanefit',
    name: <>insane<em>Fit</em></>,
    url: 'insanefit · in design',
    badge: 'i',
    live: false,
    status: 'In Design',
    video: 'insanefit',
    alt: 'insaneFit in three beats: rings for training, food and progress fill in turn. The app is in design.',
    description:
      'An iPhone app I am designing for training, food and progress, in one place. It is for people like me who train seriously and want a little help on the low-motivation days. In design; more when it is ready.',
    tags: ['iPhone', 'Fitness', 'Health'],
  },
]

const BADGE_STYLE: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--red)',
  color: 'var(--bg)',
}

export default function Lab() {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }, [])

  // One visible control pauses every prototype loop (they run 8 s); the choice is remembered.
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    try { setPaused(localStorage.getItem('lab-motion') === 'paused') } catch { /* default: playing */ }
  }, [])
  const toggleMotion = () => {
    const next = !paused
    setPaused(next)
    try { localStorage.setItem('lab-motion', next ? 'paused' : 'playing') } catch { /* this visit only */ }
  }

  return (
    <section id="projects" className={styles.lab}>
      <div className="section-label">
        <span className="num">02</span>
        <span>——</span>
        <span>ACTIVE LAB</span>
        <span className="line" />
        <span className="tag">[EXP-ACTIVE]</span>
        <button type="button" className={styles['motion-toggle']} onClick={toggleMotion} aria-pressed={paused}>
          {paused ? '▸ Play prototypes' : '❚❚ Pause prototypes'}
        </button>
      </div>

      <motion.div
        className={styles.grid}
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {PROJECTS.map((p, i) => {
          const lastAlone = i === PROJECTS.length - 1 && PROJECTS.length % 2 === 1
          const body = (
            <>
              <MockScreen url={p.url} favicon={<span style={BADGE_STYLE}>{p.badge}</span>} media>
                <LabVideo name={p.video} label={p.alt} paused={paused} />
              </MockScreen>
              <div className={styles['card-content']}>
                <div className={styles['card-header']}>
                  <span className={styles['card-id']}>EXP-{String(i + 1).padStart(3, '0')}</span>
                  <span className={`${styles['status-badge']} ${p.live ? styles['status-live'] : styles['status-building']}`}>
                    <span className={styles['status-dot']} />
                    {p.status}
                  </span>
                </div>
                <div className={styles['card-name']}>{p.name}</div>
                <div className={styles['card-desc']}>{p.description}</div>
                <div className={styles['card-stack']}>
                  {p.tags.map((t) => (
                    <span key={t} className={styles['stack-tag']} data-hover>{t}</span>
                  ))}
                </div>
              </div>
            </>
          )
          const style: React.CSSProperties = { color: 'inherit', display: 'block', ...(lastAlone ? { gridColumn: '1 / -1' } : {}) }
          return p.href ? (
            <motion.a
              key={p.id}
              id={`lab-${p.id}`}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
              style={{ ...style, textDecoration: 'none' }}
              variants={fadeUp}
              onMouseMove={handleMouseMove}
              data-hover
            >
              {body}
            </motion.a>
          ) : (
            <motion.div
              key={p.id}
              id={`lab-${p.id}`}
              className={styles.card}
              style={style}
              variants={fadeUp}
              onMouseMove={handleMouseMove}
            >
              {body}
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}

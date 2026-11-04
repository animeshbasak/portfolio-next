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
  /** One video for both themes, /public/lab/{video}.mp4 (the project's own demo) */
  single?: boolean
  alt: string
  description: string
  tags: string[]
}

// Trinetra shows its own HyperFrames demo (from its repo); the others show prototypes made for this page.
// Order: public or in daily use first, then working locally, then in development.
// Status lines are exact: "Public" only where the code is on GitHub (Paarth One is not, yet).
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
    id: 'trinetra',
    name: <>Trine<em>tra</em></>,
    href: 'https://trinetra.animeshbasak.com',
    url: 'trinetra.animeshbasak.com',
    badge: 'T',
    live: true,
    status: 'v0.1 · Public · MIT',
    video: 'trinetra-demo',
    single: true,
    alt: "Trinetra's own demo: Claude is two hours into a task, the lid closes and the work carries on, the menu shows what each agent did along with CPU, GPU, heat and power, and when the work is done the Mac sleeps.",
    description:
      'A free, open-source macOS menu bar app and CLI. Remote Control only works while the Mac is awake, so Trinetra holds it awake, lid closed and on battery included, exactly while Claude Code, Codex, Gemini CLI or Cursor is working, then lets it sleep. The menu lists every agent and what it is doing right now, sums up what each one did and estimates the battery saved. New switch-on modules add a system monitor (CPU, GPU, memory, heat, power and the CPU each agent uses) and health alerts, with a full Mac toolkit on the way. No telemetry, MIT.',
    tags: ['Swift', 'SwiftUI', 'Agent Hooks', 'CLI', 'System Monitor'],
  },
  {
    id: 'firetv',
    name: <>Glass <em>by insanemesh</em></>,
    url: 'Glass 2.0 · Fire TV home screen · built on dumbtv',
    badge: 'G',
    live: true,
    status: 'v2.0 · In Daily Use · Built on dumbtv (MIT)',
    video: 'firetv',
    alt: 'Glass prototype in three beats: one search across every app, picks that reorder to your usual evening, and an agents panel that sends Claude Code a task from the remote.',
    description:
      "An Apple TV-style home screen for my Fire TV, built on the open-source dumbtv, which strips Amazon's ads and tracking without rooting. Glass adds a frosted-glass home whose light follows the time of day, one search that looks inside every streaming app and opens Netflix, Prime Video or JioHotstar straight to the title, and Tonight, a genre wheel for picking what to watch. Picks learn what I watch, and that profile stays on the TV. An always-on Ambient screen shows the weather, air quality and crypto; my phone becomes the remote with a QR code and plays music from YouTube; and Jarvis, a Claude assistant, answers out loud and acts. From the remote it also sends tasks to Claude Code and Codex on my Mac.",
    tags: ['Java', 'Fire OS', 'Claude', 'Agents'],
  },
  {
    id: 'paarth-one',
    name: <>Paarth <em>One</em></>,
    url: 'paarth-one · local platform',
    badge: '1',
    live: false,
    status: 'Working Locally · Not Public Yet',
    video: 'paarth-one',
    alt: 'Paarth One prototype in three beats: your apps ask, one node routes each request to a cloud or local model, and it all runs as one local API on this machine.',
    description:
      "PAARTH's installable local platform: a routing node with a task journal, receipts and memory in Obsidian. A local model (Qwen through Ollama) already completes a bounded, read-only workflow end to end, and its summaries save to and recall from my Obsidian vault. Next: weekly plans, project briefs and decision recall from my own notes.",
    tags: ['Python', 'FastAPI', 'SQLite', 'Ollama', 'Obsidian'],
  },
  {
    id: 'paarth-agent',
    name: <>PAARTH <em>Agent</em> <small>(formerly FRIDAY)</small></>,
    url: 'paarth-agent · in development',
    badge: 'P',
    live: false,
    status: 'In Development · Working Locally',
    video: 'paarth-agent',
    alt: 'PAARTH Agent prototype in three beats: plan, act and verify run in a loop, the model behind it switches from Anthropic to Groq to local Ollama, and the same steps finish with a check.',
    description:
      "PAARTH Agent, formerly FRIDAY, is the personal agent on top of Paarth One. FRIDAY's history is merged in, it installs as its own package, and a Python kernel keeps every task to the same steps: plan, act, verify. Anthropic, Groq or local Ollama sit behind one interface, and its memory is plain Markdown in Obsidian. Not public yet.",
    tags: ['Python', 'LLM-agnostic', 'MCP', 'Obsidian'],
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
      'A local-first trading research lab that runs on paper money. A desk of eleven Claude skills does what a trader would: scan thousands of charts, time the entry, set the stop and target, size the position, check it against risk limits, replay the trade 10,000 times in a Time Machine, then write the order as a plain ticket that waits for my yes. Others watch the news and SEC filings, read earnings and track the trades members of Congress disclose. Paper books for Indian stocks, options and crypto run every session against a go/no-go scorecard written before any result came in. Nothing goes live unless a book passes it.',
    tags: ['Python', 'Claude Skills', 'Multi-agent', 'Next.js'],
  },
  {
    id: 'lakshya',
    name: <>Lakshya <em>Hub</em></>,
    url: 'lakshya-hub · personal beta',
    badge: 'L',
    live: false,
    status: 'Personal Beta · Running Locally',
    video: 'lakshya',
    alt: 'Lakshya Hub concept in three beats: paste a job, see a fit score, then turn each gap into a fix before you apply.',
    description:
      'From résumé to application in one place. Import a résumé and Lakshya Hub searches employer career boards for you, shows exactly which sources it checked, and keeps stale postings off the shortlist. Pick a role and it prepares a tailored draft with every claim linked to evidence, which you review before exporting a PDF. Then track each application through interviews and offers. Your data stays on your machine. Public launch is next.',
    tags: ['Next.js', 'TypeScript', 'Résumé Import', 'Local-first'],
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
                <LabVideo name={p.video} label={p.alt} paused={paused} single={p.single} />
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

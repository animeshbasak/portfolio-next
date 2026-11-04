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

// Each project shows a HyperFrames demo of its real UI (Trinetra's comes from its repo); insaneFit, in development and not built yet, shows concept screens marked as such.
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
    status: 'v4.1.0 · Router public (MIT) · Agent and One local',
    video: 'paarth-demo',
    single: true,
    alt: "PAARTH demo: ask once in Claude Code and it prints its routing plan, a git push --force stops and asks first, the cost guard checks a free local model before switching, Paarth One keeps a request private on the machine, and PAARTH Agent plans, reads, verifies and saves a note to Obsidian.",
    description:
      'One AI system in three parts. The router is open source: ask once in Claude Code, Cursor or Copilot and PAARTH routes the workflow, keeps context between sessions, stops risky commands to ask you first, and can switch to a free local model when you near your limit. Paarth One is its installable local platform, with a task journal, receipts and memory in Obsidian; a local model (Qwen through Ollama) already completes a bounded workflow end to end. PAARTH Agent, formerly FRIDAY, runs on top: plan, act, verify, with Anthropic, Groq or Ollama behind one interface. The router is public under MIT; the platform and the agent run locally and are not public yet.',
    tags: ['Claude Code', 'Routing Brain', 'Python', 'Ollama', 'Obsidian'],
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
    video: 'glass-demo',
    single: true,
    alt: 'Glass demo on a TV: the home screen with every app on one glass row, a search for horror across every app, the Tonight genre wheel landing on a film, the Ambient screen with time, sun, weather, air and crypto, and the phone remote with Jarvis.',
    description:
      "An Apple TV-style home screen for my Fire TV, built on the open-source dumbtv, which strips Amazon's ads and tracking without rooting. Glass adds a frosted-glass home whose light follows the time of day, one search that looks inside every streaming app and opens Netflix, Prime Video or JioHotstar straight to the title, and Tonight, a genre wheel for picking what to watch. Picks learn what I watch, and that profile stays on the TV. An always-on Ambient screen shows the weather, air quality and crypto; my phone becomes the remote with a QR code and plays music from YouTube; and Jarvis, a Claude assistant, answers out loud and acts. From the remote it also sends tasks to Claude Code and Codex on my Mac.",
    tags: ['Java', 'Fire OS', 'Claude', 'Agents'],
  },
  {
    id: 'paarth-trader',
    name: <>PAARTH-<em>TRADER</em></>,
    url: 'paarth-trader · in development',
    badge: '₹',
    live: false,
    status: 'In Development · Paper money only',
    video: 'paarth-trader-demo',
    single: true,
    alt: 'PAARTH-TRADER demo on sample data: the desk plans one trade with its stop and target, the risk check says PASS, the Time Machine replays it 10,000 times as a simulation, and a paper order ticket waits for a yes.',
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
    video: 'lakshya-demo',
    single: true,
    alt: 'Lakshya Hub demo on sample data: import a résumé, see which employer sources were checked, keep stale postings off the shortlist, review a draft backed by evidence from the résumé, save the PDF, and move the application to interview.',
    description:
      'From résumé to application in one place. Import a résumé and Lakshya Hub searches employer career boards for you, shows exactly which sources it checked, and keeps stale postings off the shortlist. Pick a role and it prepares a tailored draft with every claim linked to evidence, which you review before exporting a PDF. Then track each application through interviews and offers. Your data stays on your machine. Public launch is next.',
    tags: ['Next.js', 'TypeScript', 'Résumé Import', 'Local-first'],
  },
  {
    id: 'insanefit',
    name: <>insane<em>Fit</em></>,
    url: 'insanefit · in development',
    badge: 'i',
    live: false,
    status: 'In Development · Not built yet',
    video: 'insanefit-demo',
    single: true,
    alt: 'insaneFit concept screens, marked as in development: a Today view with training, food and progress, logging a bench press set with a rest timer, adding a meal toward protein and calorie targets, sessions per week, and a 20-minute plan offered on a low-energy evening.',
    description:
      'An iPhone app I am developing for training, food and progress, in one place. It is for people like me who train seriously and want a little help on the low-motivation days. In development and not built yet: these are concept screens, not the app as it will ship.',
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
          {paused ? '▸ Play videos' : '❚❚ Pause videos'}
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

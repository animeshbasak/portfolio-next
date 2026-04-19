import type { Metadata } from 'next'
import Link from 'next/link'
import { CASE_STUDIES } from '@content/work'
import styles from './lite.module.css'

export const metadata: Metadata = {
  title: 'Animesh Basak — Lite',
  description:
    'Text-only, no-JS, accessibility-first version of animeshbasak.vercel.app.',
  robots: { index: true, follow: true },
}

const TIMELINE = [
  { period: '2025 → PRESENT', company: 'Airtel Digital Ltd.', role: 'Lead Frontend Engineer' },
  { period: '2024 → 2025', company: 'MakeMyTrip', role: 'Senior SWE II — Full Stack' },
  { period: '2021 → 2024', company: 'Paytm', role: 'Software Engineer' },
  { period: '2021', company: 'Sparklin Innovations', role: 'Frontend Developer' },
  { period: '2018 → 2021', company: 'Infosys Ltd.', role: 'Systems Engineer' },
]

const SKILLS = [
  'React', 'TypeScript', 'Next.js', 'Web Perf', 'SSR/SSG',
  'LLM APIs', 'Supabase', 'System Design', 'Python', 'Claude API',
  'GrowthBook', 'Vitest', 'Jenkins', 'MCP',
]

export default function LitePage() {
  return (
    <main id="main" className={styles.lite}>
      <header className={styles.header}>
        <p className={styles.tag}>LITE · NO-JS · TEXT-ONLY</p>
        <h1 className={styles.name}>Animesh Basak</h1>
        <p className={styles.role}>
          AI Engineer building agentic systems · Lead Frontend Engineer at consumer scale (150M+ MAU)
        </p>
        <p className={styles.location}>New Delhi, India · 28°36′N 77°12′E</p>
      </header>

      <section className={styles.section}>
        <h2>Stats</h2>
        <ul>
          <li><strong>150M+</strong> Users at scale</li>
          <li><strong>7+</strong> Years active</li>
          <li><strong>3</strong> Live AI products</li>
          <li><strong>5</strong> Platforms built</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Active Lab</h2>
        <ul>
          {CASE_STUDIES.map((c) => (
            <li key={c.slug}>
              <Link href={`/work/${c.slug}`}>
                <strong>{c.name}</strong>
              </Link>{' '}
              — {c.tagline} <span className={styles.muted}>({c.status})</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Mission Log</h2>
        <ul>
          {TIMELINE.map((t) => (
            <li key={t.company}>
              <span className={styles.muted}>{t.period}</span> — <strong>{t.company}</strong>, {t.role}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Signal Stack</h2>
        <p>{SKILLS.join(' · ')}</p>
      </section>

      <section className={styles.section}>
        <h2>Transmit</h2>
        <ul>
          <li>
            <a href="mailto:animeshsbasak@gmail.com">animeshsbasak@gmail.com</a>
          </li>
          <li>
            <a href="https://github.com/animeshbasak" rel="noopener noreferrer" target="_blank">
              GitHub — animeshbasak
            </a>
          </li>
          <li>
            <a href="https://linkedin.com/in/animeshbasak" rel="noopener noreferrer" target="_blank">
              LinkedIn — animeshbasak
            </a>
          </li>
          <li>
            <a href="https://x.com/animeshsbasak" rel="noopener noreferrer" target="_blank">
              X — @animeshsbasak
            </a>
          </li>
          <li>
            <a href="/Animesh_Basak_Resume_2026.pdf" target="_blank" rel="noopener noreferrer">
              Resume (PDF)
            </a>
          </li>
        </ul>
      </section>

      <footer className={styles.footer}>
        <Link href="/">← Return to the full experience</Link>
      </footer>
    </main>
  )
}

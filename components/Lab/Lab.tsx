'use client'

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, stagger } from '@lib/motion'
import MockScreen from './MockScreen'
import styles from './Lab.module.css'

export default function Lab() {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }, [])

  return (
    <section id="projects" className={styles.lab}>
      <div className="section-label">
        <span className="num">02</span>
        <span>——</span>
        <span>ACTIVE LAB</span>
        <span className="line" />
        <span className="tag">[EXP-ACTIVE]</span>
      </div>

      <motion.div
        className={styles.grid}
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* ── Card 1: Lakshya Hub ── */}
        <motion.a
          href="https://getlakshya.animeshbasak.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.card}
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          variants={fadeUp}
          onMouseMove={handleMouseMove}
          data-hover
        >
          <MockScreen
            url="getlakshya.animeshbasak.com"
            favicon={
              <img
                src="https://getlakshya.animeshbasak.com/favicon.ico"
                alt=""
                width={14}
                height={14}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            }
          >
            <div className={styles['terminal-line']}><span className={styles.cmd}>$ lakshya discover --sources 7</span></div>
            <div className={styles['terminal-line']}><span className={styles.comment}>{'// Resume → ATS score → discover → A–G ranked → Kanban'}</span></div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> 5-dimension AI scoring vs your actual resume</div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Personio + Teamtailor ATS adapters · 14 portal seeds</div>
            <div className={styles['terminal-line']}><span className={styles.building}>▸ 290 tests green · geo-mismatch flags... ▌</span></div>
          </MockScreen>
          <div className={styles['card-content']}>
            <div className={styles['card-header']}>
              <span className={styles['card-id']}>EXP-001</span>
              <span className={`${styles['status-badge']} ${styles['status-building']}`}>
                <span className={styles['status-dot']} />
                Live · Building
              </span>
            </div>
            <div className={styles['card-name']}>Lakshya <em>Hub</em></div>
            <div className={styles['card-desc']}>
              AI job-hunt copilot. Full-stack product build: Next.js 16, TypeScript, Supabase (RLS). Resume → ATS fit score → 7-source discovery → A–G AI ranking → Kanban tracking. Multi-model AI routing, 290-test suite.
            </div>
            <div className={styles['card-stack']}>
              {['Next.js 16', 'TypeScript', 'Supabase', 'Multi-model AI', 'Sentry'].map((t) => (
                <span key={t} className={styles['stack-tag']} data-hover>{t}</span>
              ))}
            </div>
          </div>
        </motion.a>

        {/* ── Card 2: FRIDAY ── */}
        <motion.a
          href="https://github.com/animeshbasak/FRIDAY"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.card}
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          variants={fadeUp}
          onMouseMove={handleMouseMove}
          data-hover
        >
          <MockScreen
            url="friday.local · macOS agent · Phase 4 shipped"
            favicon={
              <span style={{ width: '100%', height: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--red)', color: 'var(--bg)' }}>F</span>
            }
          >
            <div className={styles['terminal-line']}><span className={styles.cmd}>$ friday &quot;route this — minimize cost&quot;</span></div>
            <div className={styles['terminal-line']}><span className={styles.comment}>{'// Arena: multi-model bidding · Brain picks cheapest viable'}</span></div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Memory graph (SQLite) · MemPalace mining per turn</div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Safety shadow-sim · voice + Telegram interfaces</div>
            <div className={styles['terminal-line']}><span className={styles.building}>▸ Forking → PAARTH Agent: LLM-agnostic runtime... ▌</span></div>
          </MockScreen>
          <div className={styles['card-content']}>
            <div className={styles['card-header']}>
              <span className={styles['card-id']}>EXP-002</span>
              <span className={`${styles['status-badge']} ${styles['status-building']}`}>
                <span className={styles['status-dot']} />
                Phase 4 shipped · Evolving → PAARTH Agent
              </span>
            </div>
            <div className={styles['card-name']}><em>FRIDAY</em></div>
            <div className={styles['card-desc']}>
              Local-first personal AI brain for macOS, built module-by-module with deterministic safety defaults. Arena (multi-model bidding) + cost-aware brain + SQLite memory graph with MemPalace mining + safety shadow-sim + voice/Telegram interfaces. Now being forked into PAARTH Agent — a standalone, LLM-agnostic runtime.
            </div>
            <div className={styles['card-stack']}>
              {['Python', 'Ollama', 'SQLite', 'Telegram', 'Arena'].map((t) => (
                <span key={t} className={styles['stack-tag']} data-hover>{t}</span>
              ))}
            </div>
          </div>
        </motion.a>

        {/* ── Card 3: PAARTH + insanemesh.ai ── */}
        <motion.a
          href="https://github.com/animeshbasak/Paarth"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.card}
          style={{ textDecoration: 'none', color: 'inherit', display: 'block', gridColumn: '1 / -1' }}
          variants={fadeUp}
          onMouseMove={handleMouseMove}
          data-hover
        >
          <MockScreen
            url="github.com/animeshbasak/Paarth"
            favicon={
              <img
                src="https://www.google.com/s2/favicons?domain=github.com&sz=64"
                alt=""
                width={14}
                height={14}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            }
          >
            <div className={styles['terminal-line']}><span className={styles.cmd}>$ /paarth &quot;fix the dark mode bug&quot;</span></div>
            <div className={styles['terminal-line']}><span className={styles.comment}>{'// v4: 53 skills · learning router · 9 platforms'}</span></div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Memory-OS: semantic rediscovery 0% → 100%</div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Safety gate + cost guard · 196 tests green</div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> insanemesh.ai: Day 42 auto-published 19:00 IST</div>
          </MockScreen>
          <div className={styles['card-content']}>
            <div className={styles['card-header']}>
              <span className={styles['card-id']}>EXP-003</span>
              <span className={`${styles['status-badge']} ${styles['status-live']}`}>
                <span className={styles['status-dot']} />
                v4.0.0 · Public · MIT
              </span>
            </div>
            <div className={styles['card-name']}><em>PAARTH</em> + insane<em>mesh</em>.ai</div>
            <div className={styles['card-desc']}>
              Free, open-source routing brain that installs under 9 AI coding tools (Claude Code, Cursor, Copilot, Gemini, Windsurf, Codex…) — 53 skills picked by a learning router, persistent cross-session memory, a safety gate that blocks destructive commands, and a cost guard with free-local-model fallback. v4.0.0, MIT, 196 tests. Powers insanemesh.ai: a fully automated AI content pipeline (Gemini → Groq → Puppeteer → Meta API) publishing daily at 7PM IST with zero human input.
            </div>
            <div className={styles['card-stack']}>
              {['Claude Code', 'Routing Brain', 'Memory-OS', 'Safety Gate', 'Meta API'].map((t) => (
                <span key={t} className={styles['stack-tag']} data-hover>{t}</span>
              ))}
            </div>
          </div>
        </motion.a>

      </motion.div>
    </section>
  )
}

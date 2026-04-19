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
      {/* Endurance ring — rotating orbital frame */}
      <div className={styles.endurance} aria-hidden="true">
        <div className={`${styles['ring']} ${styles['ring-outer']}`} />
        <div className={`${styles['ring']} ${styles['ring-mid']}`} />
        <div className={`${styles['ring']} ${styles['ring-inner']}`} />
        <div className={styles['ring-label']}>ENDURANCE · DECK 02</div>
      </div>

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
          href="/work/lakshya-hub"
          className={styles.card}
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          variants={fadeUp}
          onMouseMove={handleMouseMove}
          data-hover
        >
          <MockScreen
            url="lakshyahub.vercel.app"
            favicon={
              <img
                src="https://lakshyahub.vercel.app/favicon.ico"
                alt=""
                width={14}
                height={14}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            }
          >
            <div className={styles['terminal-line']}><span className={styles.cmd}>$ lakshya new --role &quot;Staff AI Eng&quot;</span></div>
            <div className={styles['terminal-line']}><span className={styles.comment}>{'// Kanban: 12 applications tracked'}</span></div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Resume: Harvard template · ATS 94/100</div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Bullet rewrite: 8 improved via Claude</div>
            <div className={styles['terminal-line']}><span className={styles.building}>▸ Building: public leaderboard... ▌</span></div>
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
              Unified AI Job Search OS. Kanban board + AI Resume Builder + Recruiter Heatmap. Built on Next.js 15 + Zustand + Supabase SSR. Replaces insaneResumake and Lakshya V1 as one product.
            </div>
            <div className={styles['card-stack']}>
              {['Next.js 15', 'Zustand', 'Supabase', 'Claude API'].map((t) => (
                <span key={t} className={styles['stack-tag']} data-hover>{t}</span>
              ))}
            </div>
          </div>
        </motion.a>

        {/* ── Card 2: FRIDAY ── */}
        <motion.a
          href="/work/friday"
          className={styles.card}
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          variants={fadeUp}
          onMouseMove={handleMouseMove}
          data-hover
        >
          <MockScreen
            url="friday.local · macOS agent · Phase 1 complete"
            favicon={
              <span style={{ width: '100%', height: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--red)', color: 'var(--bg)' }}>F</span>
            }
          >
            <div className={styles['terminal-line']}><span className={styles.cmd}>$ friday &quot;plan my week given bmt apr 24&quot;</span></div>
            <div className={styles['terminal-line']}><span className={styles.comment}>{'// Governor: Heavy mode engaged'}</span></div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Memory graph: 1,247 episodic nodes</div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Safety layer: shadow sim passed</div>
            <div className={styles['terminal-line']}><span className={styles.building}>▸ Phase 2: gateway + prompt_builder... ▌</span></div>
          </MockScreen>
          <div className={styles['card-content']}>
            <div className={styles['card-header']}>
              <span className={styles['card-id']}>EXP-002</span>
              <span className={`${styles['status-badge']} ${styles['status-building']}`}>
                <span className={styles['status-dot']} />
                Building · Phase 2
              </span>
            </div>
            <div className={styles['card-name']}><em>FRIDAY</em></div>
            <div className={styles['card-desc']}>
              Local-first personal AI agent for macOS. Python + Telegram + CLI + voice. Governor (Light/Build/Heavy) + memory graph + orchestrator + safety layer. Runs on M5 Pro 48GB via Ollama. Hermes-inspired.
            </div>
            <div className={styles['card-stack']}>
              {['Python', 'Ollama', 'SQLite', 'Telegram'].map((t) => (
                <span key={t} className={styles['stack-tag']} data-hover>{t}</span>
              ))}
            </div>
          </div>
        </motion.a>

        {/* ── Card 3: SuperAgent ── */}
        <motion.a
          href="/work/superagent"
          className={styles.card}
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          variants={fadeUp}
          onMouseMove={handleMouseMove}
          data-hover
        >
          <MockScreen
            url="github.com/animeshbasak/SuperAgent"
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
            <div className={styles['terminal-line']}><span className={styles.cmd}>$ /superagent &quot;fix the hydration bug&quot;</span></div>
            <div className={styles['terminal-line']}><span className={styles.comment}>{'// Scoring intent against 47 skills'}</span></div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Routed: systematic-debugging → TDD → verify</div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Subagent dispatched in worktree</div>
            <div className={styles['terminal-line']}><span className={styles.comment}>{'// Evolves daily. New skills auto-registered.'}</span></div>
          </MockScreen>
          <div className={styles['card-content']}>
            <div className={styles['card-header']}>
              <span className={styles['card-id']}>EXP-003</span>
              <span className={`${styles['status-badge']} ${styles['status-live']}`}>
                <span className={styles['status-dot']} />
                Evolving Daily
              </span>
            </div>
            <div className={styles['card-name']}>Super<em>Agent</em></div>
            <div className={styles['card-desc']}>
              Personal Claude routing brain. /superagent command reads intent, scores against all skills, auto-invokes the optimal chain. Living system — new skills and workflows added continuously. Built on Claude Code + custom skill frontmatter.
            </div>
            <div className={styles['card-stack']}>
              {['Claude Code', 'Skills', 'Subagents', 'MCP'].map((t) => (
                <span key={t} className={styles['stack-tag']} data-hover>{t}</span>
              ))}
            </div>
          </div>
        </motion.a>

        {/* ── Card 4: insanemesh.ai ── */}
        <motion.a
          href="/work/insanemesh-ai"
          className={styles.card}
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          variants={fadeUp}
          onMouseMove={handleMouseMove}
          data-hover
        >
          <MockScreen
            url="instagram.com/insanemesh.ai · 19:00 IST"
            favicon={
              <img
                src="https://www.google.com/s2/favicons?domain=instagram.com&sz=64"
                alt=""
                width={14}
                height={14}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            }
          >
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Gemini Flash: concept generated</div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Groq Llama 3.3: caption written</div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Puppeteer: tile rendered</div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Telegram: approved</div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Meta API: Day 42 published</div>
          </MockScreen>
          <div className={styles['card-content']}>
            <div className={styles['card-header']}>
              <span className={styles['card-id']}>EXP-004</span>
              <span className={`${styles['status-badge']} ${styles['status-live']}`}>
                <span className={styles['status-dot']} />
                Live · Zero-Touch
              </span>
            </div>
            <div className={styles['card-name']}>insane<em>mesh</em>.ai</div>
            <div className={styles['card-desc']}>
              Fully automated AI content pipeline. Gemini → Groq → Puppeteer → Telegram → Meta API. Fires at 7PM IST daily. Zero human input. 90-day public AI build log.
            </div>
            <div className={styles['card-stack']}>
              {['Gemini', 'Groq', 'Puppeteer', 'Meta API'].map((t) => (
                <span key={t} className={styles['stack-tag']} data-hover>{t}</span>
              ))}
            </div>
          </div>
        </motion.a>
      </motion.div>
    </section>
  )
}

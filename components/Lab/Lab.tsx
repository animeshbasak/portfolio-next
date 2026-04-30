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
          href="https://lakshyahub.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
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
            <div className={styles['terminal-line']}><span className={styles.cmd}>$ lakshya search --sources 7</span></div>
            <div className={styles['terminal-line']}><span className={styles.comment}>{'// Adzuna + LinkedIn + 5 more · India + remote'}</span></div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Fit-scored, sessionStorage cached</div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Resume: LaTeX-Article PDF · multi-page sidebar</div>
            <div className={styles['terminal-line']}><span className={styles.building}>▸ QStash ATS fan-out · Sentry wired... ▌</span></div>
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
              Unified AI Job Search OS. 7-source unified search (Adzuna, LinkedIn, +5) · LaTeX-Article PDF resume with multi-page sidebar · QStash-backed ATS fan-out · Sentry observability · 198 tests passing. Next.js 15 + Zustand + Supabase SSR.
            </div>
            <div className={styles['card-stack']}>
              {['Next.js 15', 'Supabase', 'Claude API', 'QStash', 'Sentry'].map((t) => (
                <span key={t} className={styles['stack-tag']} data-hover>{t}</span>
              ))}
            </div>
          </div>
        </motion.a>

        {/* ── Card 2: FRIDAY ── */}
        <motion.div
          className={styles.card}
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
            <div className={styles['terminal-line']}><span className={styles.comment}>{'// Arena: 4 models bid · Brain picks cheapest viable'}</span></div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Budget guard + scheduler online</div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Skills + dashboard + telemetry shipped</div>
            <div className={styles['terminal-line']}><span className={styles.building}>▸ Phase 5: voice + browser worker... ▌</span></div>
          </MockScreen>
          <div className={styles['card-content']}>
            <div className={styles['card-header']}>
              <span className={styles['card-id']}>EXP-002</span>
              <span className={`${styles['status-badge']} ${styles['status-building']}`}>
                <span className={styles['status-dot']} />
                Phase 4 shipped · Phase 5 next
              </span>
            </div>
            <div className={styles['card-name']}><em>FRIDAY</em></div>
            <div className={styles['card-desc']}>
              Local-first personal AI agent for macOS. Phase 3+4 complete: arena (multi-model bidding) + cost-aware brain + budget guard + scheduler + skills + dashboard. Memory graph + safety shadow-sim. Runs on M5 Pro 48GB via Ollama. Hermes-inspired.
            </div>
            <div className={styles['card-stack']}>
              {['Python', 'Ollama', 'SQLite', 'Telegram', 'Arena'].map((t) => (
                <span key={t} className={styles['stack-tag']} data-hover>{t}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Card 3: SuperAgent ── */}
        <motion.a
          href="https://github.com/animeshbasak/SuperAgent/"
          target="_blank"
          rel="noopener noreferrer"
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
            <div className={styles['terminal-line']}><span className={styles.comment}>{'// v2.2: cost-aware routing · 8 platforms supported'}</span></div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> AI brain: free LLM fallback engaged</div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> 95% token savings · multi-domain</div>
            <div className={styles['terminal-line']}><span className={styles.comment}>{'// Universal installer · MIT · public release'}</span></div>
          </MockScreen>
          <div className={styles['card-content']}>
            <div className={styles['card-header']}>
              <span className={styles['card-id']}>EXP-003</span>
              <span className={`${styles['status-badge']} ${styles['status-live']}`}>
                <span className={styles['status-dot']} />
                v2.2 · Public · MIT
              </span>
            </div>
            <div className={styles['card-name']}>Super<em>Agent</em></div>
            <div className={styles['card-desc']}>
              Cost-aware AI routing brain across 8 platforms — Claude Code, Cursor, Copilot, Codex and more. /superagent reads intent, scores against all skills, picks the cheapest viable model, auto-invokes the chain. v2.2: multi-domain expansion + free LLM fallback. ~95% token savings on real workloads.
            </div>
            <div className={styles['card-stack']}>
              {['Claude Code', 'Skills', 'Cost Brain', 'MCP'].map((t) => (
                <span key={t} className={styles['stack-tag']} data-hover>{t}</span>
              ))}
            </div>
          </div>
        </motion.a>

        {/* ── Card 4: insanemesh.ai ── */}
        <motion.a
          href="https://instagram.com/insanemesh.ai"
          target="_blank"
          rel="noopener noreferrer"
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

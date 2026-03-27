'use client'

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, stagger } from '@lib/motion'
import MockScreen from './MockScreen'
import styles from './Lab.module.css'

export default function Lab() {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
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
        {/* ── Card 1: Lakshya Resume ── */}
        <motion.div
          className={styles.card}
          variants={fadeUp}
          onMouseMove={handleMouseMove}
          data-hover
        >
          <MockScreen url="lakshyaresumake.vercel.app">
            <div className={styles['mock-ats']}>
              <div className={styles['mock-ats-label']}>ATS Score</div>
              <div className={styles['mock-ats-bar']}>
                <div className={styles['mock-ats-fill']} style={{ width: '94%' }} />
                <span className={styles['mock-ats-score']}>94/100</span>
              </div>
            </div>
            <div className={styles['mock-cards-row']}>
              <div className={styles['mock-card-placeholder']} />
              <div className={styles['mock-card-placeholder']} />
              <div className={styles['mock-card-placeholder']} />
            </div>
            <div className={styles['mock-heatmap-label']}>● Recruiter Heatmap active</div>
          </MockScreen>
          <div className={styles['card-content']}>
            <div className={styles['card-header']}>
              <span className={styles['card-id']}>EXP-001</span>
              <span className={`${styles['status-badge']} ${styles['status-live']}`}>
                <span className={styles['status-dot']} />
                Live
              </span>
            </div>
            <div className={styles['card-name']}>Lakshya <em>Resume</em></div>
            <div className={styles['card-desc']}>
              AI resume engine. 10 ATS templates, built-in Gemini + Groq — no user API keys needed. Turns weak resumes into interview-ready assets.
            </div>
            <div className={styles['card-stack']}>
              {['Next.js', 'Supabase', 'Gemini', 'Groq'].map((t) => (
                <span key={t} className={styles['stack-tag']} data-hover>{t}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Card 2: Lakshya V2 ── */}
        <motion.div
          className={styles.card}
          variants={fadeUp}
          onMouseMove={handleMouseMove}
          data-hover
        >
          <MockScreen url="lakshyahq.vercel.app">
            <div className={styles['terminal-line']}><span className={styles.cmd}>$ lakshya scan --role &quot;Staff Eng&quot; --loc India</span></div>
            <div className={styles['terminal-line']}><span className={styles.comment}>{'// Scraping LinkedIn via Apify...'}</span></div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Found 47 matching roles</div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Top match: FIT 94% — generating cover letter</div>
            <div className={styles['terminal-line']}><span className={styles.building}>▸ Building V2 UI... ▌</span></div>
          </MockScreen>
          <div className={styles['card-content']}>
            <div className={styles['card-header']}>
              <span className={styles['card-id']}>EXP-002</span>
              <span className={`${styles['status-badge']} ${styles['status-building']}`}>
                <span className={styles['status-dot']} />
                Building
              </span>
            </div>
            <div className={styles['card-name']}><em>Lakshya</em> V2</div>
            <div className={styles['card-desc']}>
              AI Job Search OS. Apify LinkedIn scraper, India-first filter, fit scoring engine, cover letter gen. The job hunt — systematized, scored, weaponized.
            </div>
            <div className={styles['card-stack']}>
              {['Next.js 15', 'Apify', 'Claude API', 'Supabase'].map((t) => (
                <span key={t} className={styles['stack-tag']} data-hover>{t}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Card 3: insanemesh.ai ── */}
        <motion.div
          className={styles.card}
          variants={fadeUp}
          onMouseMove={handleMouseMove}
          data-hover
        >
          <MockScreen url="instagram.com/insanemesh.ai · 19:00 IST">
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Gemini Flash: concept generated</div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Groq Llama 3.3: caption written</div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Puppeteer: tile rendered</div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Telegram: approved</div>
            <div className={styles['terminal-line']}><span className={styles.success}>✓</span> Meta API: Day 42 published</div>
          </MockScreen>
          <div className={styles['card-content']}>
            <div className={styles['card-header']}>
              <span className={styles['card-id']}>EXP-003</span>
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
        </motion.div>

        {/* ── Card 4: Zuno ── */}
        <motion.div
          className={styles.card}
          variants={fadeUp}
          onMouseMove={handleMouseMove}
          data-hover
        >
          <div className={styles.mock}>
            <div className={styles['mock-bar']}>
              <div className={styles['traffic-dots']}>
                <span className={`${styles['traffic-dot']} ${styles['dot-red']}`} />
                <span className={`${styles['traffic-dot']} ${styles['dot-amber']}`} />
                <span className={`${styles['traffic-dot']} ${styles['dot-green']}`} />
              </div>
              <div className={styles['mock-url']}>zuno.app — ACCESS RESTRICTED</div>
            </div>
            <div className={styles['mock-body']}>
              <div className={styles.locked}>
                <div className={styles['locked-name']}>ZUNO</div>
                <div className={styles['locked-text']}>ACCESS RESTRICTED</div>
                <div className={styles['locked-unlock']}>UNLOCK: POST LAKSHYA LAUNCH</div>
              </div>
            </div>
          </div>
          <div className={styles['card-content']}>
            <div className={styles['card-header']}>
              <span className={styles['card-id']}>EXP-004</span>
              <span className={`${styles['status-badge']} ${styles['status-deferred']}`}>
                <span className={styles['status-dot']} />
                Deferred
              </span>
            </div>
            <div className={styles['card-name']}><em>Zuno</em></div>
            <div className={styles['card-desc']}>
              Flutter-based privacy-first personal AI agent for Android. Full HLD/LLD/PRD complete. On-device processing, India-first freemium pricing, 8-week sprint roadmap.
            </div>
            <div className={styles['card-stack']}>
              {['Flutter', 'On-device AI', 'Android'].map((t) => (
                <span key={t} className={styles['stack-tag']} data-hover>{t}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import { fadeUp, stagger } from '@lib/motion'
import styles from './Dossier.module.css'

const METRICS = [
  { number: '7+', label: 'Years Active' },
  { number: '150M', label: 'Users at Scale' },
  { number: '5', label: 'Platforms Built' },
  { number: '3', label: 'Live AI Products' },
  { number: '∞', label: 'Experiments Pending' },
]

export default function Dossier() {
  return (
    <section id="about" className={styles.dossier}>
      {/* Section Label */}
      <div className="section-label">
        <span className="num">00</span>
        <span>——</span>
        <span>SUBJECT DOSSIER</span>
        <span className="line" />
        <span className="tag">[TS // SCI]</span>
      </div>

      <motion.div
        className={styles.outer}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className={styles['pseudo-label']}>
          DOSSIER // SUBJECT PROFILE // RESTRICTED
        </div>

        {/* ── Top Strip ── */}
        <div className={styles['top-strip']}>
          <div className={styles['file-meta']}>
            <div><span>FILE NO:</span>AB-ENG-2026-001</div>
            <div><span>CLASS:</span>AI Engineer · Lead Frontend</div>
            <div><span>PATH:</span>Infosys → Sparklin → Paytm → MakeMyTrip → Airtel</div>
            <div><span>BASE:</span>New Delhi, India · 28°36′N 77°12′E</div>
            <div><span>STATUS:</span>Active · Open to Reassignment</div>
          </div>

          <div className={styles.stamp}>
            CLEARED<br />FOR HIRE
          </div>

          <div className={styles.badge}>
            <span className={styles['badge-pill']}>AVAILABLE NOW</span>
            <div className={styles['badge-date']}>Updated: April 2026</div>
          </div>
        </div>

        {/* ── Body Grid ── */}
        <div className={styles['body-grid']}>
          <div>
            <div className={styles['field-label']}>Primary Directive</div>
            <div className={styles['field-text']}>
              Build frontend systems that survive contact with 150M+ scale. Own the architecture. Mentor the team. Ship without excuses.
            </div>

            <div className={styles['field-label']} style={{ marginTop: '2rem' }}>Known Assets</div>
            <div className={styles['assets-list']}>
              <div className={styles['asset-row']}>
                <span className={styles['asset-name']}>Lakshya Hub</span>
                <span className={styles['asset-sep']}>·</span>
                <span className={styles['asset-desc']}>7-source AI Job OS (Live · Iterating)</span>
              </div>
              <div className={styles['asset-row']}>
                <span className={styles['asset-name']}>FRIDAY</span>
                <span className={styles['asset-sep']}>·</span>
                <span className={styles['asset-desc']}>macOS Local-First Agent (Phase 4 shipped)</span>
              </div>
              <div className={styles['asset-row']}>
                <span className={styles['asset-name']}>SuperAgent</span>
                <span className={styles['asset-sep']}>·</span>
                <span className={styles['asset-desc']}>Cost-Aware Routing Brain · v2.2 (Public, MIT)</span>
              </div>
              <div className={styles['asset-row']}>
                <span className={styles['asset-name']}>insanemesh.ai</span>
                <span className={styles['asset-sep']}>·</span>
                <span className={styles['asset-desc']}>Automated AI Content Pipeline (Live)</span>
              </div>
            </div>
          </div>

          <div>
            <div className={styles['field-label']}>Psychological Profile</div>
            <div className={styles['field-text']}>
              Believes software is a compression of intent. Every component is a hypothesis. Does not wait for permission to build. Dangerous when given autonomy. Ideal when given a hard problem and a real deadline.
            </div>

            <div className={styles['field-label']} style={{ marginTop: '2rem' }}>Threat Level</div>
            <div>
              <div className={styles['threat-row']}>
                <span className={styles['threat-label']}>Code Quality:</span>
                <span className={styles['threat-value']}>HIGH</span>
              </div>
              <div className={styles['threat-row']}>
                <span className={styles['threat-label']}>System Thinking:</span>
                <span className={styles['threat-value']}>HIGH</span>
              </div>
              <div className={styles['threat-row']}>
                <span className={styles['threat-label']}>AI Integration:</span>
                <span className={`${styles['threat-value']} ${styles.critical}`}>CRITICAL</span>
              </div>
              <div className={styles['threat-row']}>
                <span className={styles['threat-label']}>Complacency:</span>
                <span className={styles.redacted} data-hover>CLASSIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Narrative ── */}
        <div className={styles.narrative}>
          <motion.div
            className={styles['narrative-block']}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className={styles['narrative-tag']}>// ORIGIN</div>
            <div className={styles['narrative-text']}>
              It started in a corporate basement at <strong>Infosys</strong> — FINACLE, ANZ Bank, React components written under fluorescent light. Most engineers never leave that basement. I followed the signal outward — through fintech at <em>Paytm</em> serving 3 million merchants, travel at <em>MakeMyTrip</em> where 48 hours was enough to eliminate a thousand Sentry errors, and finally <strong>Airtel Digital</strong> — where the interface I own loads for a hundred and fifty million human beings every month.
            </div>
          </motion.div>

          <motion.div
            className={styles['narrative-block']}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className={styles['narrative-tag']}>// THEORY</div>
            <div className={styles['narrative-text']}>
              I believe great software is not built — it is <em>derived.</em> From first principles, from user behaviour, from the physics of the browser. A Lighthouse score is not a vanity metric. It is the delta between a user who converts and a user who bounces. A clean component API is not elegance for its own sake. It is <strong>30% faster onboarding</strong> for the next engineer on your team.
            </div>
          </motion.div>

          <motion.div
            className={styles['narrative-block']}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className={styles['narrative-tag']}>// THE EXPERIMENT</div>
            <div className={styles['narrative-text']}>
              Nights and weekends: a laboratory. The hypothesis is simple — <em>the best engineers build for the world, not just for their employer.</em> Lakshya Hub is live with 7-source search and a multi-page LaTeX resume engine. FRIDAY just shipped Phase 4 — arena routing, cost-aware brain. SuperAgent went public, MIT, with ~95% token savings on real workloads. The Instagram automation still fires itself at 7PM. <strong>The experiment has no end condition.</strong>
            </div>
          </motion.div>
        </div>

        {/* ── Metrics Bar ── */}
        <motion.div
          className={styles['metrics-bar']}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {METRICS.map((m) => (
            <motion.div
              key={m.label}
              className={styles['metric-cell']}
              variants={fadeUp}
              data-hover
            >
              <div className={styles['metric-number']}>{m.number}</div>
              <div className={styles['metric-label']}>{m.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

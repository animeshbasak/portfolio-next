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
            <div><span>CLASS:</span>Lead Frontend Engineer</div>
            <div><span>PATH:</span>Infosys → Sparklin → Paytm → MakeMyTrip → Airtel</div>
            <div><span>BASE:</span>New Delhi, India · 28°36′N 77°12′E</div>
            <div><span>STATUS:</span>Active · Open to Reassignment</div>
          </div>

          <div className={styles.stamp}>
            CLEARED<br />FOR HIRE
          </div>

          <div className={styles.badge}>
            <span className={styles['badge-pill']}>AVAILABLE NOW</span>
            <div className={styles['badge-date']}>Updated: March 2026</div>
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
                <span className={styles['asset-name']}>Lakshya Resume</span>
                <span className={styles['asset-sep']}>·</span>
                <span className={styles['asset-desc']}>AI Resume Engine (Live)</span>
              </div>
              <div className={styles['asset-row']}>
                <span className={styles['asset-name']}>Lakshya V2</span>
                <span className={styles['asset-sep']}>·</span>
                <span className={styles['asset-desc']}>AI Job OS (Building)</span>
              </div>
              <div className={styles['asset-row']}>
                <span className={styles['asset-name']}>insanemesh.ai</span>
                <span className={styles['asset-sep']}>·</span>
                <span className={styles['asset-desc']}>Automated AI Pipeline (Live)</span>
              </div>
              <div className={styles['asset-row']}>
                <span className={styles['asset-name']}>Zuno</span>
                <span className={styles['asset-sep']}>·</span>
                <span className={styles['asset-desc']}>
                  Personal AI Agent [<span className={styles.redacted} data-hover>REDACTED</span>]
                </span>
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
              Nights and weekends: a laboratory. The hypothesis is simple — <em>the best engineers build for the world, not just for their employer.</em> Lakshya Resume is live. Lakshya V2 is building. The Instagram automation runs itself at 7PM every night. <strong>Zuno is designed, blueprinted, and waiting.</strong> The experiment has no end condition.
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

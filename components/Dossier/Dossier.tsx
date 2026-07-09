'use client'

import { motion } from 'framer-motion'
import { fadeUp, stagger } from '@lib/motion'
import styles from './Dossier.module.css'

const METRICS = [
  { number: '7+', label: 'Years Active' },
  { number: '150M', label: 'Users at Scale' },
  { number: '5', label: 'Platforms Built' },
  { number: '4', label: 'AI Products Built' },
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
            <div><span>CLASS:</span>Senior Frontend Engineer · React/TS + Gen AI</div>
            <div><span>PATH:</span>Infosys → Sparklin → Paytm → MakeMyTrip → Airtel</div>
            <div><span>BASE:</span>New Delhi, India · 28°36′N 77°12′E</div>
            <div><span>STATUS:</span>Active · Open to Reassignment</div>
          </div>

          <div className={styles.stamp}>
            CLEARED<br />FOR HIRE
          </div>

          <div className={styles.badge}>
            <span className={styles['badge-pill']}>AVAILABLE NOW</span>
            <div className={styles['badge-date']}>Updated: July 2026</div>
          </div>
        </div>

        {/* ── Body Grid ── */}
        <div className={styles['body-grid']}>
          <div>
            <div className={styles['field-label']}>Primary Directive</div>
            <div className={styles['field-text']}>
              Build consumer-scale frontends used by 150M+ people — React, TypeScript, React Native — with the full-stack range to ship end-to-end and the AI capability to make products smarter. Own the architecture. Mentor the squad. Ship without excuses.
            </div>

            <div className={styles['field-label']} style={{ marginTop: '2rem' }}>Known Assets</div>
            <div className={styles['assets-list']}>
              <div className={styles['asset-row']}>
                <span className={styles['asset-name']}>Lakshya Hub</span>
                <span className={styles['asset-sep']}>·</span>
                <span className={styles['asset-desc']}>AI Job-Hunt Copilot · 290 tests (Live · Iterating)</span>
              </div>
              <div className={styles['asset-row']}>
                <span className={styles['asset-name']}>PAARTH Agent</span>
                <span className={styles['asset-sep']}>·</span>
                <span className={styles['asset-desc']}>LLM-Agnostic Personal Agent, ex-FRIDAY (In Dev)</span>
              </div>
              <div className={styles['asset-row']}>
                <span className={styles['asset-name']}>PAARTH</span>
                <span className={styles['asset-sep']}>·</span>
                <span className={styles['asset-desc']}>AI Routing Brain · v4.0.0 (Public, MIT)</span>
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
                <span className={styles['threat-label']}>Frontend Architecture:</span>
                <span className={`${styles['threat-value']} ${styles.critical}`}>CRITICAL</span>
              </div>
              <div className={styles['threat-row']}>
                <span className={styles['threat-label']}>System Thinking:</span>
                <span className={styles['threat-value']}>HIGH</span>
              </div>
              <div className={styles['threat-row']}>
                <span className={styles['threat-label']}>AI Integration:</span>
                <span className={styles['threat-value']}>HIGH</span>
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
            <div className={styles['narrative-tag']}>// CURRENT MISSION</div>
            <div className={styles['narrative-text']}>
              I build consumer-scale frontends used by <strong>150M+ people</strong>. Currently Lead Engineer on the <strong>Airtel Thanks App</strong> — leading a 5–7 engineer squad across React/TypeScript surfaces, and shipping an <em>agentic AI bot journey</em> for SKYC onboarding in React Native.
            </div>
          </motion.div>

          <motion.div
            className={styles['narrative-block']}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className={styles['narrative-tag']}>// RANGE</div>
            <div className={styles['narrative-text']}>
              Frontend-first, full-stack capable: I&apos;ve shipped <strong>Spring Boot REST services</strong> for DTH order flows end-to-end, and I build LLM applications on the side — <em>RAG pipelines, multi-model routing, agentic systems.</em>
            </div>
          </motion.div>

          <motion.div
            className={styles['narrative-block']}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className={styles['narrative-tag']}>// PRIOR DEPLOYMENTS</div>
            <div className={styles['narrative-text']}>
              Previously: <strong>MakeMyTrip</strong> (lifted Lighthouse <em>6 → 8–9</em> on the hotels PWA, 5M+ monthly sessions), <strong>Paytm</strong> (React migration for 3M+ merchants, <em>40% EDC sales lift</em> via Soundbox checkout), <strong>ICICI</strong>, <strong>ANZ Bank</strong>.
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

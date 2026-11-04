'use client'

import { motion } from 'framer-motion'
import { fadeUp, stagger } from '@lib/motion'
import {career} from '../../../lib/portfolio/data'
import styles from './Dossier.module.css'

const METRICS = [
  { number: '7+', label: 'Years Active' },
  { number: '2018', label: 'Engineering Since' },
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
        <span className="tag">[OPEN FILE]</span>
      </div>

      <motion.div
        className={styles.outer}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className={styles['pseudo-label']}>
          DOSSIER // SUBJECT PROFILE // OPEN FILE
        </div>

        {/* ── Top Strip ── */}
        <div className={styles['top-strip']}>
          <div className={styles['file-meta']}>
            <div><span>FILE NO:</span>AB-ENG-2026-001</div>
            <div><span>CLASS:</span>Lead Frontend Engineer · Hands-on tech lead</div>
            <div><span>PATH:</span>Infosys → Sparklin → Paytm → MakeMyTrip → Airtel</div>
            <div><span>BASE:</span>New Delhi, India · Remote India</div>
            <div><span>STATUS:</span>Employed · Open to new roles</div>
          </div>

          <div className={styles.stamp}>
            CLEARED<br />FOR HIRE
          </div>

          <div className={styles.badge}>
            <span className={styles['badge-pill']}>OPEN TO ROLES</span>
            <div className={styles['badge-date']}>Updated: November 2026</div>
          </div>
        </div>

        {/* ── Body Grid ── */}
        <div className={styles['body-grid']}>
          <div>
            <div className={styles['field-label']}>Primary Directive</div>
            <div className={styles['field-text']}>
              I build clear interfaces, lead frontend decisions and help teams get their work ready to ship.
            </div>

            <div className={styles['field-label']} style={{ marginTop: '2rem' }}>Known Assets</div>
            <div className={styles['assets-list']}>
              <div className={styles['asset-row']}>
                <span className={styles['asset-name']}>PAARTH</span>
                <span className={styles['asset-sep']}>·</span>
                <span className={styles['asset-desc']}>AI routing brain, local platform and agent · router v4.1.0 (Public, MIT)</span>
              </div>
              <div className={styles['asset-row']}>
                <span className={styles['asset-name']}>Trinetra</span>
                <span className={styles['asset-sep']}>·</span>
                <span className={styles['asset-desc']}>Keeps the Mac awake for AI agents, lid closed, with a system monitor · v0.1 (Public, MIT)</span>
              </div>
              <div className={styles['asset-row']}>
                <span className={styles['asset-name']}>Glass</span>
                <span className={styles['asset-sep']}>·</span>
                <span className={styles['asset-desc']}>Apple TV-style Fire TV home: search every app, a Claude assistant · v2.0 (In Daily Use)</span>
              </div>
              <div className={styles['asset-row']}>
                <span className={styles['asset-name']}>PAARTH-TRADER</span>
                <span className={styles['asset-sep']}>·</span>
                <span className={styles['asset-desc']}>Paper-trading desk of Claude skills with a go/no-go scorecard (In Development)</span>
              </div>
              <div className={styles['asset-row']}>
                <span className={styles['asset-name']}>Lakshya Hub</span>
                <span className={styles['asset-sep']}>·</span>
                <span className={styles['asset-desc']}>Résumé to application, personal beta (Running Locally)</span>
              </div>
              <div className={styles['asset-row']}>
                <span className={styles['asset-name']}>insaneFit</span>
                <span className={styles['asset-sep']}>·</span>
                <span className={styles['asset-desc']}>iPhone app for training, food and progress (In Development, not built yet)</span>
              </div>
            </div>
          </div>

          <div>
            <div className={styles['field-label']}>Psychological Profile</div>
            <div className={styles['field-text']}>
              I prefer clear decisions, readable code and a shared understanding of the work. I stay involved from the first design discussion through to review and release, and build my own tools to explore new ideas.
            </div>

            <div className={styles['field-label']} style={{ marginTop: '2rem' }}>Threat Level</div>
            <div>
              <div className={styles['threat-row']}>
                <span className={styles['threat-label']}>Frontend Architecture:</span>
                <span className={`${styles['threat-value']} ${styles.critical}`}>CORE WORK</span>
              </div>
              <div className={styles['threat-row']}>
                <span className={styles['threat-label']}>System Thinking:</span>
                <span className={styles['threat-value']}>CORE</span>
              </div>
              <div className={styles['threat-row']}>
                <span className={styles['threat-label']}>AI Integration:</span>
                <span className={styles['threat-value']}>LABS</span>
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
              {career[0].narrative}
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
              Frontend is my core, with experience across backend and React Native. My independent projects explore how AI tools can use context, respect limits and fit everyday work.
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
              Previously at MakeMyTrip, Paytm, Sparklin and Infosys, working on travel, merchant tools and banking interfaces with a focus on everyday use.
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

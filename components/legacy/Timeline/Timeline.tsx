'use client'

import { motion } from 'framer-motion'
import { slideInLeft, stagger } from '@lib/motion'
import {career} from '../../../lib/portfolio/data'
import styles from './Timeline.module.css'

const TIMELINE_DATA = career.map(job=>({period:job.dates,company:job.company,role:job.role,bullets:[job.narrative,...job.responsibilities],tags:job.focus}))

function formatRole(role: string) {
  return role.replace(/\*(.*?)\*/g, '<em>$1</em>')
}

export default function Timeline() {
  return (
    <section id="timeline" className={styles.timeline}>
      {/* Section Label */}
      <div className="section-label">
        <span className="num">01</span>
        <span>——</span>
        <span>MISSION LOG</span>
        <span className="line" />
        <span className="tag">[VERIFIED]</span>
      </div>

      <div className={styles['intro-quote']}>
        <strong>Five companies.</strong> One through-line: find the hardest problem in the room and make it look inevitable in retrospect.
      </div>

      <motion.div
        className={styles['timeline-list']}
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className={styles.axis} />

        {TIMELINE_DATA.map((item, idx) => (
          <motion.div
            key={idx}
            className={styles.item}
            variants={slideInLeft}
          >
            <div className={styles.node} />
            <div className={styles.period}>{item.period}</div>
            <div className={styles.company}>{item.company}</div>
            <div
              className={styles.role}
              dangerouslySetInnerHTML={{ __html: formatRole(item.role) }}
            />
            <div className={styles.bullets}>
              {item.bullets.map((bullet, bi) => (
                <div
                  key={bi}
                  className={styles.bullet}
                  dangerouslySetInnerHTML={{ __html: bullet }}
                />
              ))}
            </div>
            <div className={styles.tags}>
              {item.tags.map((tag) => (
                <span key={tag} className={styles.tag} data-hover>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

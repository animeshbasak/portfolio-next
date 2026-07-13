'use client'

import { motion } from 'framer-motion'
import { slideInLeft, stagger } from '@lib/motion'
import styles from './Timeline.module.css'

const TIMELINE_DATA = [
  {
    period: 'JUN 2025 → PRESENT',
    company: 'Airtel Digital Ltd.',
    role: 'Lead *Engineer*',
    bullets: [
      'Lead a <strong>5–7 engineer squad</strong> owning architecture, delivery, and release standards. Final production review gate before merge.',
      'Own React/TypeScript surfaces at <strong>~150M MAU</strong> — Airtel One, Airtel Black, Prepaid, Postpaid, SKYC.',
      'Shipping an <strong>agentic AI bot journey in React Native</strong> for SKYC onboarding.',
      'Built <strong>Spring Boot REST services for DTH order flows</strong> end-to-end. Authored <strong>HLD + LLD with Architect sign-off.</strong>',
    ],
    tags: ['React', 'TypeScript', 'React Native', 'Spring Boot', 'HLD/LLD', 'GrowthBook'],
  },
  {
    period: 'JUL 2024 → MAY 2025',
    company: 'MakeMyTrip India Pvt. Ltd.',
    role: 'Senior Software Engineer II — *Frontend*',
    bullets: [
      'Hotels PWA booking funnel (<strong>5M+ monthly sessions</strong>): <strong>Lighthouse 6 → 8–9</strong> via SSR tuning and critical rendering path improvements.',
      'Killed <strong>1,000+ Sentry errors in 48 hours</strong> by resolving one systemic bug.',
      'Rush Deals, Devotees, Collections — A/B surfaces driving conversion uplift. <strong>90%+ test coverage.</strong>',
    ],
    tags: ['SSR', 'Web Vitals', 'Vitest', 'Sentry'],
  },
  {
    period: 'OCT 2021 → JUN 2024',
    company: 'One97 Communications Ltd. (Paytm)',
    role: 'Software *Engineer*',
    bullets: [
      'Led legacy → React migration for <strong>~3M active merchants.</strong> Lighthouse 6 → 8–9.',
      'Soundbox purchase journey revamp → <strong>40% increase in EDC device sales.</strong>',
      'Sole Analytics SPOC — dashboards driving <strong>10–15% merchant engagement lift.</strong>',
    ],
    tags: ['React', 'Redux', 'Analytics', 'Spring Boot'],
  },
  {
    period: '2021',
    company: 'Sparklin Innovations',
    role: 'Frontend *Developer*',
    bullets: [
      'Angular UI components for <strong>ICICI Internet Banking — Nirvana Project.</strong>',
      'Improved banking workflow usability, accessibility compliance, initial load latency.',
    ],
    tags: ['Angular', 'Banking UI', 'Accessibility'],
  },
  {
    period: '2018 → 2021',
    company: 'Infosys Ltd.',
    role: '*Origin* — Systems Engineer',
    bullets: [
      'FINACLE ecosystem at <strong>ANZ Bank.</strong> React UI components, API validation, regression automation via WebDriverIO.',
      'Strengthened regression testing reliability across banking platform.',
    ],
    tags: ['React', 'FINACLE', 'WebDriverIO', 'Banking'],
  },
]

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

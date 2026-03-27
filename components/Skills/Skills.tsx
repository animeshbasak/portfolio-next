'use client'

import { motion } from 'framer-motion'
import { fadeUp } from '@lib/motion'
import RadarCanvas from './RadarCanvas'
import SkillCategories from './SkillCategories'
import styles from './Skills.module.css'

const LEGEND = [
  { name: 'React', value: 97 },
  { name: 'TypeScript', value: 95 },
  { name: 'Next.js', value: 93 },
  { name: 'Web Perf', value: 96 },
  { name: 'SSR/SSG', value: 92 },
  { name: 'LLM APIs', value: 88 },
  { name: 'Supabase', value: 87 },
  { name: 'Sys Design', value: 91 },
]

export default function Skills() {
  return (
    <section id="skills" className={styles.skills}>
      <div className="section-label">
        <span className="num">03</span>
        <span>——</span>
        <span>SIGNAL STACK</span>
        <span className="line" />
        <span className="tag">[VERIFIED]</span>
      </div>

      <div className={styles.layout}>
        <motion.div
          className={styles['radar-wrapper']}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <RadarCanvas />

          <div className={styles.legend}>
            {LEGEND.map((item) => (
              <div key={item.name} className={styles['legend-item']}>
                <span className={styles['legend-name']}>{item.name}</span>
                <div className={styles['legend-bar-bg']}>
                  <motion.div
                    className={styles['legend-bar-fill']}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: item.value / 100 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  />
                </div>
                <span className={styles['legend-value']}>{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        <SkillCategories />
      </div>
    </section>
  )
}

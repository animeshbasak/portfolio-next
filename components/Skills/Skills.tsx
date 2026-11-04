'use client'

import { motion } from 'framer-motion'
import { fadeUp } from '@lib/motion'
import RadarCanvas from './RadarCanvas'
import SkillCategories from './SkillCategories'
import styles from './Skills.module.css'

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

        </motion.div>

        <SkillCategories />
      </div>
    </section>
  )
}

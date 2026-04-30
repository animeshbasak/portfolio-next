'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './HyperHero.module.css'

interface HyperHeroProps {
  title: string
  subtitle?: string
  fileId?: string
  date?: string
  stack?: string[]
  status?: string
}

const SCRAMBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'

export default function HyperHero({
  title,
  subtitle,
  fileId = 'TX-2026',
  date,
  stack = [],
  status = 'TRANSMITTING',
}: HyperHeroProps) {
  const [displayed, setDisplayed] = useState('')
  const [decrypted, setDecrypted] = useState(false)
  const [dots, setDots] = useState('')

  useEffect(() => {
    let frame = 0
    const total = 28
    const interval = setInterval(() => {
      frame++
      const progress = Math.min(frame / total, 1)
      const revealCount = Math.floor(progress * title.length)
      let next = ''
      for (let i = 0; i < title.length; i++) {
        if (i < revealCount) next += title[i]
        else if (title[i] === ' ') next += ' '
        else next += SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
      }
      setDisplayed(next)
      if (progress >= 1) {
        setDisplayed(title)
        setDecrypted(true)
        clearInterval(interval)
      }
    }, 45)
    return () => clearInterval(interval)
  }, [title])

  useEffect(() => {
    if (decrypted) return
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? '' : d + '.')), 350)
    return () => clearInterval(id)
  }, [decrypted])

  return (
    <section className={styles.hero}>
      <div className={styles.scan} aria-hidden="true" />

      <div className={styles.corners} aria-hidden="true">
        <span className={`${styles.corner} ${styles.tl}`} />
        <span className={`${styles.corner} ${styles.tr}`} />
        <span className={`${styles.corner} ${styles.bl}`} />
        <span className={`${styles.corner} ${styles.br}`} />
      </div>

      <motion.div
        className={styles.fileRow}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <span className={styles.classified}>CLASSIFIED</span>
        <span className={styles.fileId}>FILE_ID: {fileId}</span>
        <span className={styles.divider} />
        <span className={`${styles.status} ${decrypted ? styles.statusOk : ''}`}>
          {decrypted ? `${status} ✓` : `DECRYPTING${dots}`}
        </span>
      </motion.div>

      <h1 className={styles.title}>{displayed || title}</h1>

      {subtitle && (
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: decrypted ? 1 : 0, y: decrypted ? 0 : 8 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {subtitle}
        </motion.p>
      )}

      {(stack.length > 0 || date) && (
        <motion.div
          className={styles.metaRow}
          initial={{ opacity: 0 }}
          animate={{ opacity: decrypted ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {date && <span className={styles.date}>{date}</span>}
          {stack.length > 0 && (
            <div className={styles.stack}>
              {stack.map((t) => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </section>
  )
}

'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import styles from './HUD.module.css'

const MESSAGES: Record<string, string[]> = {
  hero: [
    'Systems online. Welcome aboard.',
    'Honesty setting: 90%.',
    'Humor setting: 75%. Optimal for interview conditions.',
  ],
  about: [
    'Subject profile loaded.',
    'Seven years operational. No anomalies.',
  ],
  projects: [
    'Four active experiments. All nominal.',
    'FRIDAY is running low on caffeine.',
  ],
  timeline: [
    'Chronometer synced. Five missions logged.',
    '150 million users surveyed. Patterns recognized.',
  ],
  skills: [
    'Instrument array calibrated.',
    'React-fluency: beyond measurable thresholds.',
  ],
  blog: [
    'Transmissions incoming from deep space.',
  ],
  contact: [
    'Beacon operational. Signal strong.',
    'Transmit at will. Response guaranteed.',
  ],
}

export default function TARS() {
  const [section, setSection] = useState<string>('hero')
  const [line, setLine] = useState<string>('')
  const [typed, setTyped] = useState<string>('')
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const ids = Object.keys(MESSAGES)
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setSection(e.target.id)
        }
      },
      { threshold: 0.4 }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (dismissed) return
    const pool = MESSAGES[section] || []
    if (!pool.length) return
    const next = pool[Math.floor(Math.random() * pool.length)]
    setLine(next)
    setTyped('')
    setVisible(true)
  }, [section, dismissed])

  useEffect(() => {
    if (!line) return
    let i = 0
    const tick = () => {
      setTyped(line.slice(0, i))
      i++
      if (i <= line.length) {
        timerRef.current = setTimeout(tick, 32)
      }
    }
    tick()
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [line])

  const close = useCallback(() => {
    setVisible(false)
    setDismissed(true)
  }, [])

  if (dismissed) return null

  return (
    <aside
      className={`${styles.tars} ${visible ? styles['tars-visible'] : ''}`}
      aria-live="polite"
      aria-label="TARS companion"
    >
      <div className={styles['tars-header']}>
        <span className={styles['tars-lights']}>
          <span className={styles['tars-light']} />
          <span className={styles['tars-light']} />
          <span className={styles['tars-light']} />
        </span>
        <span>TARS · v4.7</span>
        <button type="button" className={styles['tars-close']} onClick={close} data-hover aria-label="Close TARS">
          ×
        </button>
      </div>
      <div className={styles['tars-body']}>
        <span className={styles['tars-prompt']}>»</span>
        {typed}
        <span className={styles['tars-cursor']} />
      </div>
    </aside>
  )
}

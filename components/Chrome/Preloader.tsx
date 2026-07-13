'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Preloader.module.css'

const SEEN_KEY = 'v6-preloader-seen'

export default function Preloader() {
  const [active, setActive] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const numRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let seen = false
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1'
    } catch {
      /* storage unavailable — show once per load */
    }
    if (rm || seen) return

    setActive(true)
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* ignore */
    }

    let raf = 0
    let t0: number | null = null
    const dur = 1150
    const step = (t: number) => {
      if (t0 === null) t0 = t
      let k = Math.min(1, (t - t0) / dur)
      k = 1 - Math.pow(1 - k, 3)
      if (numRef.current) {
        numRef.current.textContent = String(Math.round(k * 100)).padStart(2, '0')
      }
      if (k < 1) {
        raf = requestAnimationFrame(step)
      } else {
        setLeaving(true)
        setTimeout(() => setActive(false), 950)
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  if (!active) return null

  return (
    <div className={`${styles.pre} ${leaving ? styles.leaving : ''}`} aria-hidden="true">
      <div className={styles.top}>
        <span>ANIMESH BASAK — PORTFOLIO</span>
        <span>© 2026 EDITION</span>
      </div>
      <div className={styles.bottom}>
        <span className={styles.tag}>LOADING TYPE + NERVE</span>
        <span ref={numRef} className={styles.num}>
          00
        </span>
      </div>
    </div>
  )
}

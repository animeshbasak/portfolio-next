'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Hero.module.css'

export default function Hero() {
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const [clock, setClock] = useState('--:--:--')

  // Line reveal — plays under the preloader overlay on first load
  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lines = [line1Ref.current, line2Ref.current]
    if (rm) {
      lines.forEach((el) => {
        if (el) el.style.transform = 'translateY(0)'
      })
      return
    }
    const timeouts: ReturnType<typeof setTimeout>[] = []
    lines.forEach((el, i) => {
      if (!el) return
      timeouts.push(
        setTimeout(() => {
          el.style.transform = 'translateY(0)'
        }, 300 + i * 120)
      )
    })
    return () => timeouts.forEach(clearTimeout)
  }, [])

  // Subtle parallax on the headline
  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (rm) return
    let raf = 0
    const loop = () => {
      const el = h1Ref.current
      if (el) el.style.translate = `0 ${(window.scrollY * 0.14).toFixed(1)}px`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Live IST clock
  useEffect(() => {
    const tick = () => {
      try {
        setClock(
          new Date().toLocaleTimeString('en-GB', {
            timeZone: 'Asia/Kolkata',
            hour12: false,
          })
        )
      } catch {
        /* keep placeholder */
      }
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header id="top" className={styles.hero}>
      <div className={styles.topRow}>
        <div className={styles.kicker}>
          SENIOR FRONTEND ENGINEER
          <span className={styles.star}> ✦ </span>
          REACT / TYPESCRIPT + GEN AI
        </div>
        <div className={styles.badge}>
          <svg width="130" height="130" viewBox="0 0 130 130" className={styles.badgeSvg}>
            <defs>
              <path
                id="abcir"
                d="M 65,65 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
              />
            </defs>
            <text className={styles.badgeText}>
              <textPath href="#abcir">OPEN TO WORK ✦ DELHI — REMOTE ✦ 150M USERS ✦ </textPath>
            </text>
          </svg>
          <span className={styles.badgeArrow}>↓</span>
        </div>
      </div>

      <h1 ref={h1Ref} className={styles.h1}>
        <span className={styles.lineMask}>
          <span ref={line1Ref} className={styles.line}>
            ANIMESH
          </span>
        </span>
        <span className={styles.lineMask}>
          <span ref={line2Ref} className={styles.line}>
            BASAK<span className={styles.dot}>.</span>
          </span>
        </span>
      </h1>

      <div className={styles.midRow}>
        <p className={styles.intro}>
          Frontends for <strong>150M+ people</strong>. Full-stack range, AI conviction,
          and a squad that ships. Currently Lead Engineer on the Airtel Thanks App.
        </p>
        <div className={styles.path}>
          <div>INFOSYS → SPARKLIN → PAYTM</div>
          <div>
            → MAKEMYTRIP → <span className={styles.pathAcc}>AIRTEL DIGITAL</span>
          </div>
        </div>
      </div>

      <div className={styles.infoStrip}>
        <div className={styles.infoCell}>
          <span className={styles.infoLabel}>LOCATION</span>
          <span className={styles.infoValue}>
            New Delhi, India — <span suppressHydrationWarning>{clock}</span> IST
          </span>
        </div>
        <div className={styles.infoCell}>
          <span className={styles.infoLabel}>CURRENTLY</span>
          <span className={styles.infoValue}>Lead Engineer @ Airtel Digital</span>
        </div>
        <div className={styles.infoCell}>
          <span className={styles.infoLabel}>SEEKING</span>
          <span className={styles.infoValue}>Senior / Lead / Staff — IC+</span>
        </div>
        <div className={`${styles.infoCell} ${styles.infoCellEnd}`}>
          <span className={styles.infoLabel}>SCROLL</span>
          <span className={styles.infoValue}>↓</span>
        </div>
      </div>
    </header>
  )
}

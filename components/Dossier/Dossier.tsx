'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Dossier.module.css'

const STATEMENT =
  'I specialise in frontend systems and architecture. My career has grown from frontend development and quality engineering to shared platforms and technical direction. Alongside that focus, I make AI-assisted backend and React Native contributions, and build independent products and tools.'

const WORDS = STATEMENT.split(' ')

interface Stat {
  target: number
  pad: number
  suffix: string
  label: string
  accent?: boolean
}

const STATS: Stat[] = [
  { target: 7, pad: 2, suffix: '', label: 'YEARS SHIPPING' },
  { target: 5, pad: 2, suffix: '', label: 'INDEPENDENT PROJECTS', accent: true },
  { target: 5, pad: 2, suffix: '', label: 'COMPANIES' },
  { target: 2018, pad: 0, suffix: '', label: 'ENGINEERING SINCE' },
]

const fmt = (stat: Stat, val: number) =>
  String(val).padStart(stat.pad, '0') + stat.suffix

function StatCell({ stat, index }: { stat: Stat; index: number }) {
  const cellRef = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const cell = cellRef.current
    if (!cell) return
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (rm) {
      setShown(true)
      if (numRef.current) numRef.current.textContent = fmt(stat, stat.target)
      return
    }

    let raf = 0
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          io.unobserve(entry.target)
          setShown(true)
          let t0: number | null = null
          const run = (t: number) => {
            if (t0 === null) t0 = t
            const k = Math.min(1, (t - t0) / 1100)
            const eased = 1 - Math.pow(1 - k, 3)
            if (numRef.current) {
              numRef.current.textContent = fmt(stat, Math.round(stat.target * eased))
            }
            if (k < 1) raf = requestAnimationFrame(run)
          }
          raf = requestAnimationFrame(run)
        })
      },
      { threshold: 0.5 }
    )
    io.observe(cell)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [stat])

  return (
    <div
      ref={cellRef}
      className={`${styles.cell} ${shown ? styles.cellShown : ''}`}
      style={{ transitionDelay: `${(index % 4) * 0.06}s` }}
    >
      <div
        ref={numRef}
        className={`${styles.num} ${stat.accent ? styles.numAcc : ''}`}
      >
        {fmt(stat, 0)}
      </div>
      <div className={styles.label}>{stat.label}</div>
    </div>
  )
}

export default function Dossier() {
  const fillRef = useRef<HTMLParagraphElement>(null)

  // Scroll word-fill: color the first floor(k * N) words as the reader scrolls
  useEffect(() => {
    const box = fillRef.current
    if (!box) return
    const els = Array.from(box.querySelectorAll<HTMLSpanElement>('[data-w]'))
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (rm) {
      els.forEach((el) => {
        el.style.color = 'var(--ink)'
      })
      return
    }

    let lastN = -1
    let raf = 0
    let ticking = false

    const update = () => {
      ticking = false
      const r = box.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.top >= vh || r.bottom <= 0) return
      const k = Math.max(0, Math.min(1, (vh * 0.82 - r.top) / (r.height + vh * 0.28)))
      const n = Math.floor(k * els.length)
      if (n === lastN) return
      const lo = Math.min(n, lastN < 0 ? 0 : lastN)
      const hi = Math.max(n, lastN < 0 ? els.length : lastN)
      for (let i = lo; i < hi; i++) {
        if (els[i]) els[i].style.color = i < n ? 'var(--ink)' : 'rgba(22,20,15,0.15)'
      }
      lastN = n
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        raf = requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section id="profile" className="sec">
      <div className="sec-head">
        <span className="num">(01)</span>
        <span className="title">PROFILE</span>
        <span className="spacer" />
        <span className="hint">READ WHILE SCROLLING</span>
      </div>

      <p ref={fillRef} className={styles.statement}>
        {WORDS.map((word, i) => (
          <span key={i} data-w="" className={styles.word}>
            {word}{' '}
          </span>
        ))}
      </p>

      <div className={styles.stats}>
        {STATS.map((stat, i) => (
          <StatCell key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {career} from '../../lib/portfolio/data'
import styles from './Timeline.module.css'

interface JobPreview {
  k: string
  big: string
  line: string
  tags: string
}

interface Job {
  n: string
  co: string
  legal: string
  role: string
  dates: string
  tags: string
  pts: string[]
  pv: JobPreview
}

const JOBS: Job[] = career.map((job,i)=>({n:String(i+1).padStart(2,'0'),co:job.company,legal:job.company,role:job.role,dates:job.dates,tags:job.focus.join(' · '),pts:[job.narrative,...job.responsibilities],pv:{k:job.company,big:['PLATFORMS','PERFORMANCE','MODERNISATION','USABILITY','QUALITY'][i],line:job.theme,tags:job.focus.slice(0,3).join(' · ')}}))

function RecordRow({
  job,
  open,
  onToggle,
  onHover,
}: {
  job: Job
  open: boolean
  onToggle: () => void
  onHover: (job: Job | null) => void
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  // Fade-reveal on scroll into view
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          io.unobserve(entry.target)
          setShown(true)
        })
      },
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Animate detail max-height
  useEffect(() => {
    const detail = detailRef.current
    if (!detail) return
    detail.style.maxHeight = open ? `${detail.scrollHeight}px` : '0px'
  }, [open])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle()
    }
  }

  return (
    <div ref={wrapRef} className={`${styles.rowWrap} ${shown ? styles.shown : ''}`}>
      <div
        className={styles.row}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        data-cur="EXPAND"
        onClick={onToggle}
        onKeyDown={onKeyDown}
        onMouseEnter={() => onHover(job)}
        onMouseLeave={() => onHover(null)}
      >
        <span className={styles.index}>{job.n}</span>
        <span className={styles.company}>{job.co}</span>
        <span className={styles.meta}>
          <span className={styles.dates}>{job.dates}</span>
          <span className={styles.role}>{job.role}</span>
        </span>
        <span className={`${styles.arrow} ${open ? styles.arrowOpen : ''}`}>↓</span>
      </div>
      <div ref={detailRef} className={styles.detail}>
        <div className={styles.detailGrid}>
          <span />
          <div className={styles.detailBody}>
            <span className={styles.detailMeta}>
              {job.legal} · {job.tags}
            </span>
            {job.pts.map((pt, i) => (
              <span key={i} className={styles.point}>
                <span className={styles.pointStar}>✦</span>
                <span>{pt}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Timeline() {
  const [openSet, setOpenSet] = useState<Set<string>>(new Set())
  const pvRef = useRef<HTMLDivElement>(null)
  const hoveredRef = useRef<Job | null>(null)
  const [pvJob, setPvJob] = useState<Job | null>(null)

  const onHover = useCallback((job: Job | null) => {
    hoveredRef.current = job
    if (job) setPvJob(job)
  }, [])

  // Floating preview follows the pointer with a lerp; fine pointers only
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || rm) return

    let mx = -400
    let my = -400
    let px = -400
    let py = -400
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const loop = () => {
      const pv = pvRef.current
      if (pv) {
        const on = hoveredRef.current !== null
        const txT = mx + 320 > window.innerWidth ? mx - 330 : mx + 30
        const tyT = Math.max(12, my - 100)
        px += (txT - px) * 0.14
        py += (tyT - py) * 0.14
        pv.style.transform = `translate(${px.toFixed(1)}px,${py.toFixed(1)}px) rotate(-4deg) scale(${on ? 1 : 0.9})`
        pv.style.opacity = on ? '1' : '0'
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  const toggle = (n: string) => {
    setOpenSet((prev) => {
      const next = new Set(prev)
      if (next.has(n)) next.delete(n)
      else next.add(n)
      return next
    })
  }

  return (
    <section id="record" className="sec">
      <div className="sec-head">
        <span className="num">(02)</span>
        <span className="title">THE RECORD</span>
        <span className="spacer" />
        <span className="hint">05 ROLES — CLICK TO EXPAND</span>
      </div>

      <div>
        {JOBS.map((job) => (
          <RecordRow
            key={job.n}
            job={job}
            open={openSet.has(job.n)}
            onToggle={() => toggle(job.n)}
            onHover={onHover}
          />
        ))}
      </div>

      {/* floating work preview */}
      <div ref={pvRef} className={styles.preview} aria-hidden="true">
        <div className={styles.pvK}>{pvJob?.pv.k ?? ''}</div>
        <div className={styles.pvBig}>{pvJob?.pv.big ?? ''}</div>
        <div className={styles.pvLine}>{pvJob?.pv.line ?? ''}</div>
        <div className={styles.pvTags}>{pvJob?.pv.tags ?? ''}</div>
      </div>
    </section>
  )
}

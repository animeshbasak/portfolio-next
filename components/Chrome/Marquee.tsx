'use client'

import { useEffect, useRef } from 'react'
import styles from './Marquee.module.css'

interface MarqueeProps {
  items: string[]
  direction?: 1 | -1
  className?: string
}

/** Outlined-type marquee with scroll-velocity boost, per v6 design. */
export default function Marquee({ items, direction = 1, className }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (rm) return

    let x = 0
    let w = el.scrollWidth / 2
    let lastY = window.scrollY
    let vel = 0
    let raf = 0

    const onResize = () => {
      w = el.scrollWidth / 2
    }
    window.addEventListener('resize', onResize)

    const loop = () => {
      const y = window.scrollY
      vel = vel * 0.88 + (y - lastY) * 0.12
      lastY = y
      const boost = Math.min(9, Math.abs(vel) * 0.5)
      if (w) {
        x -= (0.55 + boost) * direction
        if (x <= -w) x += w
        if (x > 0) x -= w
        el.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [direction])

  const doubled = [...items, ...items]

  return (
    <div className={`${styles.wrap} ${className ?? ''}`}>
      <div ref={trackRef} className={styles.track}>
        {doubled.map((item, i) => (
          <span key={i} className={styles.pair}>
            <span className={styles.word}>{item}</span>
            <span className={styles.star}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

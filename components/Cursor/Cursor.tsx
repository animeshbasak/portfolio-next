'use client'

import { useEffect, useRef } from 'react'
import styles from './Cursor.module.css'

/**
 * v6 custom cursor: orange dot that lerps to the pointer, plus a mono label
 * revealed when hovering any element carrying a data-cur attribute
 * (e.g. data-cur="VIEW"). Pointer-fine devices only; respects reduced motion.
 */
export default function Cursor() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || rm) return

    let mx = -100
    let my = -100
    let cx = -100
    let cy = -100
    let op = 0
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement | null
      const t = target?.closest?.('[data-cur]') as HTMLElement | null
      const lab = labelRef.current
      const dot = dotRef.current
      if (t) {
        if (lab) {
          lab.textContent = t.getAttribute('data-cur') || 'VIEW'
          lab.style.opacity = '1'
        }
        if (dot) dot.style.transform = 'scale(2.6)'
      } else {
        if (lab) lab.style.opacity = '0'
        if (dot) dot.style.transform = 'scale(1)'
      }
    }
    document.addEventListener('mouseover', onOver, true)

    const loop = () => {
      cx += (mx - cx) * 0.22
      cy += (my - cy) * 0.22
      op += ((mx < 0 ? 0 : 1) - op) * 0.18
      const w = wrapRef.current
      if (w) {
        w.style.transform = `translate(${cx.toFixed(1)}px,${cy.toFixed(1)}px)`
        w.style.opacity = op.toFixed(2)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver, true)
    }
  }, [])

  return (
    <div ref={wrapRef} className={styles.wrap} aria-hidden="true">
      <div ref={dotRef} className={styles.dot} />
      <div ref={labelRef} className={styles.label}>
        VIEW
      </div>
    </div>
  )
}

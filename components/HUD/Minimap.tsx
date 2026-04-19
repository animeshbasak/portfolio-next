'use client'

import { useEffect, useState, useCallback } from 'react'
import styles from './HUD.module.css'

const WAYPOINTS = [
  { id: 'hero', label: '00 · HORIZON' },
  { id: 'about', label: '01 · COOPER STATION' },
  { id: 'projects', label: '02 · ENDURANCE DECK' },
  { id: 'timeline', label: '03 · TESSERACT' },
  { id: 'skills', label: '04 · INSTRUMENT ARRAY' },
  { id: 'blog', label: '05 · TRANSMISSIONS' },
  { id: 'contact', label: '06 · BEACON' },
]

export default function Minimap() {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(e.target.id)
          }
        }
      },
      { threshold: 0.3, rootMargin: '-20% 0px -40% 0px' }
    )

    WAYPOINTS.forEach((w) => {
      const el = document.getElementById(w.id)
      if (el) obs.observe(el)
    })

    return () => obs.disconnect()
  }, [])

  const jump = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <nav className={styles.minimap} aria-label="Section navigator">
      {WAYPOINTS.map((w) => (
        <button
          key={w.id}
          type="button"
          onClick={() => jump(w.id)}
          className={`${styles['map-dot']} ${active === w.id ? styles.active : ''}`}
          data-label={w.label}
          data-hover
          aria-label={`Go to ${w.label}`}
          aria-current={active === w.id ? 'true' : undefined}
        />
      ))}
    </nav>
  )
}

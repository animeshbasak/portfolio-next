'use client'

import { useEffect, useState } from 'react'
import styles from './AccentPicker.module.css'

export const ACCENTS = [
  { hex: '#FF4B00', name: 'Signal Orange' },
  { hex: '#2B3FE0', name: 'Klein Blue' },
  { hex: '#B8002E', name: 'Crimson' },
  { hex: '#1F6F46', name: 'Racing Green' },
]

const KEY = 'v6-accent'

export default function AccentPicker() {
  const [active, setActive] = useState(ACCENTS[0].hex)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY)
      if (saved && ACCENTS.some((a) => a.hex === saved)) setActive(saved)
    } catch {
      /* storage unavailable */
    }
  }, [])

  const pick = (hex: string) => {
    setActive(hex)
    document.documentElement.style.setProperty('--acc', hex)
    try {
      localStorage.setItem(KEY, hex)
    } catch {
      /* ignore */
    }
  }

  return (
    <span className={styles.wrap} role="radiogroup" aria-label="Accent color" data-cur="TINT">
      {ACCENTS.map((a) => (
        <button
          key={a.hex}
          type="button"
          role="radio"
          aria-checked={active === a.hex}
          aria-label={a.name}
          title={a.name}
          className={`${styles.swatch} ${active === a.hex ? styles.active : ''}`}
          style={{ background: a.hex }}
          onClick={() => pick(a.hex)}
        />
      ))}
    </span>
  )
}

'use client'

import { useState, useEffect } from 'react'
import styles from './HUD.module.css'

function format(ms: number): string {
  const s = Math.floor(ms / 1000)
  const hh = String(Math.floor(s / 3600)).padStart(4, '0')
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

export default function MissionClock() {
  const [time, setTime] = useState('0000:00:00')

  useEffect(() => {
    const start = performance.now()
    const tick = () => setTime(format(performance.now() - start))
    const id = setInterval(tick, 1000)
    tick()
    return () => clearInterval(id)
  }, [])

  return (
    <div className={styles.clock} aria-hidden="true">
      <span className={styles['clock-dot']} />
      <span>T+</span>
      <span className={styles['clock-time']}>{time}</span>
    </div>
  )
}

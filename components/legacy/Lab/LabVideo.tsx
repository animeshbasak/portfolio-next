'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Lab.module.css'

type Props = {
  /** File stem in /public/lab, e.g. "paarth" → /lab/paarth-light.mp4 and /lab/paarth-dark.mp4 */
  name: string
  label: string
  paused: boolean
  /** One video for both themes: /lab/{name}.mp4 with /lab/{name}.webp as its poster */
  single?: boolean
}

const isDark = () => document.documentElement.getAttribute('data-portfolio-theme') === 'dark'

/**
 * A looping HyperFrames prototype. Plays only while on screen, in the current theme,
 * when motion is allowed and the visitor has not paused the Lab. Otherwise the poster shows.
 */
export default function LabVideo({ name, label, paused, single = false }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const light = useRef<HTMLVideoElement>(null)
  const dark = useRef<HTMLVideoElement>(null)
  const [inView, setInView] = useState(false)
  const [darkTheme, setDarkTheme] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    setDarkTheme(isDark())
    const mo = new MutationObserver(() => setDarkTheme(isDark()))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-portfolio-theme'] })
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMq = () => setReduced(mq.matches)
    onMq()
    mq.addEventListener('change', onMq)
    return () => { io.disconnect(); mo.disconnect(); mq.removeEventListener('change', onMq) }
  }, [])

  useEffect(() => {
    const active = single || !darkTheme ? light.current : dark.current
    const idle = single ? null : darkTheme ? light.current : dark.current
    idle?.pause()
    if (!active) return
    if (inView && !paused && !reduced) {
      active.play().catch(() => { /* Autoplay refused: the poster stays. */ })
    } else {
      active.pause()
    }
  }, [inView, paused, reduced, darkTheme, single])

  const common = { muted: true, loop: true, playsInline: true, preload: 'none' as const, 'aria-label': label }
  if (single) {
    return (
      <div ref={box} className={styles['mock-screen']}>
        <video ref={light} className={styles.proto} poster={`/lab/${name}.webp`} {...common}>
          <source src={`/lab/${name}.mp4`} type="video/mp4" />
        </video>
      </div>
    )
  }
  return (
    <div ref={box} className={styles['mock-screen']}>
      <video ref={light} className={`${styles.proto} ${styles['proto-light']}`} poster={`/lab/${name}-light.webp`} {...common}>
        <source src={`/lab/${name}-light.mp4`} type="video/mp4" />
      </video>
      <video ref={dark} className={`${styles.proto} ${styles['proto-dark']}`} poster={`/lab/${name}-dark.webp`} {...common}>
        <source src={`/lab/${name}-dark.mp4`} type="video/mp4" />
      </video>
    </div>
  )
}

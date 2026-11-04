'use client'

import {useEffect, useState} from 'react'
import {NAME_ROWS, NAME_REVEAL_DURATION, namePhase} from '../../lib/personal/name-reveal'
import {usePortfolioMotion} from './PortfolioMotion'

export default function LegacyName({hidden}: {hidden: boolean}) {
  const {ready, paused, reducedMotion} = usePortfolioMotion()
  const [elapsed, setElapsed] = useState(Number.POSITIVE_INFINITY)

  useEffect(() => {
    if (!ready) return
    if (hidden || paused || reducedMotion) { setElapsed(Number.POSITIVE_INFINITY); return }

    let frame = 0
    let start = performance.now()
    let lastPaint = 0
    const finish = () => {
      cancelAnimationFrame(frame)
      setElapsed(Number.POSITIVE_INFINITY)
    }
    const tick = (now: number) => {
      const age = now - start
      if (age >= NAME_REVEAL_DURATION) { finish(); return }
      if (now - lastPaint >= 40) { setElapsed(age); lastPaint = now }
      frame = requestAnimationFrame(tick)
    }
    // Never leave an unfinished name when the visitor switches apps or tabs.
    const onVisibility = () => { if (document.hidden) finish() }
    setElapsed(0)
    start = performance.now()
    frame = requestAnimationFrame(tick)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [ready, hidden, paused, reducedMotion])

  return <h1 className={hidden ? 'personal-sr-only' : 'identity-name identity-decrypt'} aria-label="Animesh Basak" data-revealing={Number.isFinite(elapsed)}>
    {NAME_ROWS.map((word, row) => <span className={`identity-name-row ${row === 1 ? 'identity-surname' : ''}`} key={word} aria-hidden="true">
      {[...word].map((letter, index) => <span className="identity-letter" data-phase={namePhase(row, index, elapsed)} key={index}>{letter}</span>)}
    </span>)}
    <i aria-hidden="true">*</i>
  </h1>
}

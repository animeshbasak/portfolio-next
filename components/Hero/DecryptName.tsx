'use client'

import { useEffect, useRef } from 'react'
import { useDecrypt } from '@lib/useDecrypt'
import { useMagnetic } from '@lib/useMagnetic'
import styles from './Hero.module.css'

interface DecryptNameProps {
  onComplete: () => void
}

export default function DecryptName({ onComplete }: DecryptNameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasStartedRef = useRef(false)

  const row1 = useDecrypt({
    text: 'ANIMESH',
    delay: 400,
    letterStagger: 90,
  })

  const row2 = useDecrypt({
    text: 'BASAK',
    delay: 0,
    letterStagger: 90,
  })

  const { activate } = useMagnetic(containerRef)

  // Start row 1 on mount
  useEffect(() => {
    row1.start()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Start row 2 after row 1 completes
  useEffect(() => {
    if (row1.isComplete) {
      const timeout = setTimeout(() => {
        row2.start()
      }, 120)
      return () => clearTimeout(timeout)
    }
  }, [row1.isComplete]) // eslint-disable-line react-hooks/exhaustive-deps

  // Signal completion + activate magnetic
  useEffect(() => {
    if (row2.isComplete) {
      activate()
      onComplete()
    }
  }, [row2.isComplete, activate]) // removed onComplete from deps to prevent re-runs

  const getLetterClass = (phase: string, isOutline: boolean) => {
    const classes = [styles.letter]
    if (isOutline) classes.push(styles['letter-outline'])

    switch (phase) {
      case 'hidden':
        classes.push(styles['letter-hidden'])
        break
      case 'scrambling':
        classes.push(styles['letter-scrambling'])
        break
      case 'flash':
        classes.push(styles['letter-flash'])
        break
      case 'done':
        classes.push(styles['letter-done'])
        break
    }

    return classes.join(' ')
  }

  return (
    <div className={styles['name-container']} ref={containerRef}>
      <div className={styles['name-row']}>
        {row1.displayLetters.map((letter, i) => (
          <span
            key={`r1-${i}`}
            className={getLetterClass(row1.phases[i], false)}
            data-magnetic
          >
            {row1.phases[i] === 'hidden' ? '\u00A0' : letter}
          </span>
        ))}
      </div>
      <div className={styles['name-row']}>
        {row2.displayLetters.map((letter, i) => (
          <span
            key={`r2-${i}`}
            className={getLetterClass(row2.phases[i], true)}
            data-magnetic
          >
            {row2.phases[i] === 'hidden' ? '\u00A0' : letter}
          </span>
        ))}
      </div>
    </div>
  )
}

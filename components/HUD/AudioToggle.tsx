'use client'

import { useEffect, useState, useCallback } from 'react'
import { audioEngine } from '@lib/audioEngine'
import styles from './HUD.module.css'

export default function AudioToggle() {
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    if (!audioEngine) return
    const unsub = audioEngine.subscribe(setMuted)
    return () => {
      unsub?.()
    }
  }, [])

  const toggle = useCallback(() => {
    audioEngine?.toggle()
  }, [])

  return (
    <button
      type="button"
      className={`${styles['audio-toggle']} ${muted ? '' : styles['audio-active']}`}
      onClick={toggle}
      data-hover
      aria-label={muted ? 'Enable ambient audio' : 'Mute ambient audio'}
      title={muted ? 'Audio: OFF' : 'Audio: ON'}
    >
      <span className={styles['audio-bars']}>
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className={styles['audio-label']}>{muted ? 'AUDIO · OFF' : 'AUDIO · ON'}</span>
    </button>
  )
}

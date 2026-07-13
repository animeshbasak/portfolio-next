'use client'

import { useRef } from 'react'
import { useParticles } from '@lib/useParticles'
import styles from './Hero.module.css'

export default function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useParticles(canvasRef)

  return (
    <div className={styles.particles}>
      <canvas ref={canvasRef} />
    </div>
  )
}

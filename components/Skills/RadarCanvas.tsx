'use client'

import { useEffect, useRef } from 'react'
import styles from './Skills.module.css'

const SKILLS = [
  { name: 'React', value: 0.97 },
  { name: 'TypeScript', value: 0.95 },
  { name: 'Next.js', value: 0.93 },
  { name: 'Web Perf', value: 0.96 },
  { name: 'SSR/SSG', value: 0.92 },
  { name: 'LLM APIs', value: 0.88 },
  { name: 'Supabase', value: 0.87 },
  { name: 'Sys Design', value: 0.91 },
]

export default function RadarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const angleRef = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = 400
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const maxR = 160
    const numPoints = SKILLS.length
    const angleStep = (Math.PI * 2) / numPoints

    const draw = () => {
      ctx.clearRect(0, 0, size, size)

      // Grid rings
      for (let i = 1; i <= 5; i++) {
        const r = (maxR / 5) * i
        const opacity = 0.05 + i * 0.014
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(13, 12, 10, ${opacity})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Spokes
      for (let i = 0; i < numPoints; i++) {
        const angle = angleStep * i - Math.PI / 2
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR)
        ctx.strokeStyle = 'rgba(13, 12, 10, 0.1)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Data polygon
      ctx.beginPath()
      SKILLS.forEach((skill, i) => {
        const angle = angleStep * i - Math.PI / 2
        const r = maxR * skill.value
        const x = cx + Math.cos(angle) * r
        const y = cy + Math.sin(angle) * r
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.closePath()
      ctx.fillStyle = 'rgba(200, 16, 46, 0.07)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(200, 16, 46, 0.6)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Data points
      SKILLS.forEach((skill, i) => {
        const angle = angleStep * i - Math.PI / 2
        const r = maxR * skill.value
        const x = cx + Math.cos(angle) * r
        const y = cy + Math.sin(angle) * r
        ctx.beginPath()
        ctx.arc(x, y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(200, 16, 46, 0.5)'
        ctx.fill()
      })

      // Rotating scan sweep
      const sweepAngle = angleRef.current
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, maxR, sweepAngle, sweepAngle + 0.5, false)
      ctx.closePath()
      const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR)
      sweepGrad.addColorStop(0, 'rgba(200, 16, 46, 0.15)')
      sweepGrad.addColorStop(1, 'rgba(200, 16, 46, 0)')
      ctx.fillStyle = sweepGrad
      ctx.fill()

      // Scan line from centre
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(
        cx + Math.cos(sweepAngle) * maxR,
        cy + Math.sin(sweepAngle) * maxR
      )
      ctx.strokeStyle = 'rgba(200, 16, 46, 0.5)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Labels
      ctx.font = '9px IBM Plex Mono, monospace'
      ctx.fillStyle = 'rgba(13, 12, 10, 0.4)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      SKILLS.forEach((skill, i) => {
        const angle = angleStep * i - Math.PI / 2
        const labelR = maxR + 20
        const x = cx + Math.cos(angle) * labelR
        const y = cy + Math.sin(angle) * labelR
        ctx.fillText(skill.name, x, y)
      })

      angleRef.current += 0.008
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className={styles['radar-canvas']}>
      <canvas ref={canvasRef} />
    </div>
  )
}

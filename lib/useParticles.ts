'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
}

const NODE_COUNT = 90
const CONNECTION_DIST = 100
const REPEL_RADIUS = 150
const MAX_SPEED = 0.6
const NODE_COLOR = 'rgba(200, 16, 46, 0.25)'

export function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const rafRef = useRef<number>(0)

  const init = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const w = canvas.width
    const h = canvas.height

    particlesRef.current = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * MAX_SPEED * 2,
      vy: (Math.random() - 0.5) * MAX_SPEED * 2,
    }))
  }, [canvasRef])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const particles = particlesRef.current
    const mx = mouseRef.current.x
    const my = mouseRef.current.y

    ctx.clearRect(0, 0, w, h)

    // Update + draw
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      // Mouse repel
      const dx = p.x - mx
      const dy = p.y - my
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < REPEL_RADIUS && dist > 0) {
        const force = (REPEL_RADIUS - dist) / REPEL_RADIUS
        p.vx += (dx / dist) * force * 0.5
        p.vy += (dy / dist) * force * 0.5
      }

      // Clamp speed
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
      if (speed > MAX_SPEED) {
        p.vx = (p.vx / speed) * MAX_SPEED
        p.vy = (p.vy / speed) * MAX_SPEED
      }

      p.x += p.vx
      p.y += p.vy

      // Wrap
      if (p.x < 0) p.x = w
      if (p.x > w) p.x = 0
      if (p.y < 0) p.y = h
      if (p.y > h) p.y = 0

      // Draw node
      ctx.beginPath()
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
      ctx.fillStyle = NODE_COLOR
      ctx.fill()

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j]
        const cdx = p.x - p2.x
        const cdy = p.y - p2.y
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy)
        if (cdist < CONNECTION_DIST) {
          const opacity = (1 - cdist / CONNECTION_DIST) * 0.15
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(13, 12, 10, ${opacity})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [canvasRef])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
      init()
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    handleResize()
    rafRef.current = requestAnimationFrame(animate)

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [canvasRef, init, animate])
}

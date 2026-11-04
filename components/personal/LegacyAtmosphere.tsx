'use client'

import { useEffect, useRef } from 'react'

type Props = {
  dark: boolean
  paused: boolean
  reducedMotion: boolean
}

type Node = { x: number; y: number; vx: number; vy: number }
type Packet = { from: number; to: number; progress: number; duration: number }

/** The original portfolio's quiet network, without a dependency or a perpetual idle loop. */
export default function LegacyAtmosphere({ paused, reducedMotion, dark }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controlsRef = useRef({ paused, reducedMotion, dark })
  const syncRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    controlsRef.current = { paused, reducedMotion, dark }
    syncRef.current?.()
  }, [paused, reducedMotion, dark])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const ctx = context
    const nodes: Node[] = []
    let packets: Packet[] = []
    let width = 0
    let height = 0
    let mobile = false
    let raf = 0
    let previousTime = 0
    let previousUpdate = 0
    let disposed = false
    let pointer = { x: -1000, y: -1000 }
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

    const canAnimate = () =>
      !disposed && !document.hidden &&
      !controlsRef.current.paused && !controlsRef.current.reducedMotion

    function draw() {
      ctx.clearRect(0, 0, width, height)
      const ink = controlsRef.current.dark ? '210, 219, 198' : '13, 12, 10'
      const connectionDistance = mobile ? 112 : 155
      const distanceSquared = connectionDistance * connectionDistance
      ctx.lineWidth = 0.65

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j]
          const dx = node.x - other.x
          const dy = node.y - other.y
          const square = dx * dx + dy * dy
          if (square >= distanceSquared) continue
          const strength = 1 - Math.sqrt(square) / connectionDistance
          ctx.strokeStyle = `rgba(${ink}, ${0.04 + strength * 0.18})`
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(other.x, other.y)
          ctx.stroke()
        }
        ctx.fillStyle = `rgba(${ink}, 0.29)`
        ctx.beginPath()
        ctx.arc(node.x, node.y, 1.35, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const packet of packets) {
        const from = nodes[packet.from]
        const to = nodes[packet.to]
        if (!from || !to) continue
        const x = from.x + (to.x - from.x) * packet.progress
        const y = from.y + (to.y - from.y) * packet.progress
        ctx.fillStyle = controlsRef.current.dark ? 'rgba(255, 145, 167, 0.15)' : 'rgba(200, 16, 46, 0.1)'
        ctx.beginPath()
        ctx.arc(x, y, 4.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = controlsRef.current.dark ? 'rgba(255, 145, 167, 0.95)' : 'rgba(200, 16, 46, 0.85)'
        ctx.beginPath()
        ctx.arc(x, y, 1.8, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function spawnPacket() {
      if (packets.length >= (mobile ? 3 : 5) || nodes.length < 2) return
      const from = Math.floor(Math.random() * nodes.length)
      const candidates: number[] = []
      const connectionDistance = mobile ? 112 : 155
      for (let i = 0; i < nodes.length; i++) {
        if (i === from) continue
        const dx = nodes[from].x - nodes[i].x
        const dy = nodes[from].y - nodes[i].y
        if (dx * dx + dy * dy < connectionDistance * connectionDistance) candidates.push(i)
      }
      if (!candidates.length) return
      packets.push({
        from,
        to: candidates[Math.floor(Math.random() * candidates.length)],
        progress: 0,
        duration: 1.2 + Math.random() * 1.2,
      })
    }

    function update(seconds: number) {
      for (const node of nodes) {
        let repelX = 0
        let repelY = 0
        if (finePointer.matches) {
          const dx = node.x - pointer.x
          const dy = node.y - pointer.y
          const distance = Math.hypot(dx, dy)
          if (distance > 0 && distance < 120) {
            const strength = (1 - distance / 120) * 12
            repelX = dx / distance * strength
            repelY = dy / distance * strength
          }
        }
        node.x += (node.vx + repelX) * seconds
        node.y += (node.vy + repelY) * seconds
        // Bounce rather than wrap: a travelling packet never draws a viewport-wide jump.
        if (node.x < 0 || node.x > width) {
          node.x = Math.max(0, Math.min(width, node.x))
          node.vx *= -1
        }
        if (node.y < 0 || node.y > height) {
          node.y = Math.max(0, Math.min(height, node.y))
          node.vy *= -1
        }
      }
      packets = packets.filter(packet => {
        packet.progress += seconds / packet.duration
        return packet.progress < 1
      })
      if (Math.random() < 1 - Math.exp(-(mobile ? 1 : 1.8) * seconds)) spawnPacket()
    }

    function frame(time: number) {
      raf = 0
      if (!canAnimate()) return
      if (!previousTime) {
        previousTime = time
        previousUpdate = time
      }
      const elapsed = time - previousTime
      const interval = 1000 / (mobile ? 15 : 24)
      if (elapsed >= interval) {
        // A long main-thread stall should not teleport the background on recovery.
        update(Math.min((time - previousUpdate) / 1000, 0.1))
        draw()
        previousUpdate = time
        previousTime = time - (elapsed % interval)
      }
      raf = requestAnimationFrame(frame)
    }

    function sync() {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      previousTime = 0
      previousUpdate = 0
      pointer = { x: -1000, y: -1000 }
      draw()
      if (canAnimate()) raf = requestAnimationFrame(frame)
    }

    function resize() {
      const oldWidth = width
      const oldHeight = height
      width = Math.max(1, window.innerWidth)
      height = Math.max(1, window.innerHeight)
      mobile = width <= 760
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (oldWidth && oldHeight) {
        for (const node of nodes) {
          node.x *= width / oldWidth
          node.y *= height / oldHeight
        }
      }
      const count = mobile ? 42 : 75
      if (nodes.length > count) nodes.length = count
      while (nodes.length < count) {
        const angle = Math.random() * Math.PI * 2
        const speed = 11 + Math.random() * 8
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        })
      }
      packets = packets.filter(packet => packet.from < count && packet.to < count)
      sync()
    }

    function onPointerMove(event: PointerEvent) {
      if (!canAnimate() || !finePointer.matches || event.pointerType !== 'mouse') return
      pointer = { x: event.clientX, y: event.clientY }
    }

    function clearPointer() {
      pointer = { x: -1000, y: -1000 }
    }

    syncRef.current = sync
    resize()
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('blur', clearPointer)
    document.documentElement.addEventListener('pointerleave', clearPointer)
    document.addEventListener('visibilitychange', sync)

    return () => {
      disposed = true
      syncRef.current = null
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('blur', clearPointer)
      document.documentElement.removeEventListener('pointerleave', clearPointer)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return <canvas ref={canvasRef} className="personal-atmosphere" aria-hidden="true" style={{ pointerEvents: 'none' }} />
}

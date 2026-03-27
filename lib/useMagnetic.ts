'use client'

import { useEffect, useRef, useCallback } from 'react'

const RADIUS = 180
const STRENGTH = 28

export function useMagnetic(containerRef: React.RefObject<HTMLDivElement | null>) {
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const activeRef = useRef(false)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  const animate = useCallback(() => {
    if (!containerRef.current || !activeRef.current) return

    const letters = containerRef.current.querySelectorAll<HTMLSpanElement>('[data-magnetic]')
    const mx = mouseRef.current.x
    const my = mouseRef.current.y

    letters.forEach((el) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = mx - cx
      const dy = my - cy
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < RADIUS && dist > 0) {
        const pull = (1 - dist / RADIUS)
        const ox = dx * pull * 0.6 * (STRENGTH / dist)
        const oy = dy * pull * 0.6 * (STRENGTH / dist)
        el.style.transform = `translate(${ox}px, ${oy}px)`
      } else {
        el.style.transform = 'translate(0, 0)'
      }
    })

    rafRef.current = requestAnimationFrame(animate)
  }, [containerRef])

  const activate = useCallback(() => {
    activeRef.current = true
    rafRef.current = requestAnimationFrame(animate)
  }, [animate])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      activeRef.current = false
      cancelAnimationFrame(rafRef.current)
    }
  }, [handleMouseMove])

  return { activate }
}

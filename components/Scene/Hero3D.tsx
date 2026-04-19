'use client'

import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'
import GargantuaHero from './GargantuaHero'
import { descentStore } from '@lib/descentStore'

type PerfTier = 'high' | 'medium' | 'low'

const TIER_NUM: Record<PerfTier, number> = { high: 1, medium: 0.6, low: 0.3 }

export default function Hero3D() {
  const [tier, setTier] = useState<PerfTier>('high')
  const [shouldRender, setShouldRender] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 640px)').matches
    const hasWebGL = (() => {
      try {
        const c = document.createElement('canvas')
        return !!(c.getContext('webgl2') || c.getContext('webgl'))
      } catch {
        return false
      }
    })()
    if (reducedMotion || isMobile || !hasWebGL) {
      setShouldRender(false)
      return
    }
    setShouldRender(true)
    if (isMobile) setTier('low')
  }, [])

  useEffect(() => {
    const update = (v: number) => {
      if (!wrapRef.current) return
      const opacity = 0.45 + v * 0.55
      const blend = v > 0.55 ? 'normal' : 'multiply'
      wrapRef.current.style.opacity = String(opacity)
      wrapRef.current.style.mixBlendMode = blend
    }
    update(descentStore.get())
    return descentStore.subscribe(update)
  }, [])

  if (!shouldRender) return null

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.45,
        mixBlendMode: 'multiply',
        transition: 'opacity 0.2s linear',
      }}
    >
      <Canvas
        dpr={tier === 'low' ? [1, 1] : tier === 'medium' ? [1, 1.25] : [1, 2]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <PerformanceMonitor
          onDecline={() => setTier((t) => (t === 'high' ? 'medium' : 'low'))}
          onIncline={() => setTier((t) => (t === 'low' ? 'medium' : 'high'))}
        />
        <GargantuaHero descent={0} tier={TIER_NUM[tier]} />
      </Canvas>
    </div>
  )
}

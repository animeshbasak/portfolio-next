'use client'

import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { useState } from 'react'
import GargantuaHero from './GargantuaHero'

type PerfTier = 'high' | 'medium' | 'low'

const TIER_NUM: Record<PerfTier, number> = { high: 1, medium: 0.6, low: 0.3 }

export default function Hero3D() {
  const [tier, setTier] = useState<PerfTier>('high')

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.45,
        mixBlendMode: 'multiply',
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

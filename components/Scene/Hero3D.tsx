'use client'

import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { useState } from 'react'
import GargantuaPlaceholder from './GargantuaPlaceholder'

type PerfTier = 'high' | 'medium' | 'low'

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
        opacity: 0,
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
        <GargantuaPlaceholder />
      </Canvas>
    </div>
  )
}

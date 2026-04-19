'use client'

import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'

export type PerfTier = 'high' | 'medium' | 'low'

interface SceneContextValue {
  tier: PerfTier
  setTier: (t: PerfTier) => void
  audioEnabled: boolean
  setAudioEnabled: (v: boolean) => void
  reducedMotion: boolean
}

const SceneContext = createContext<SceneContextValue | null>(null)

export function SceneProvider({ children }: { children: ReactNode }) {
  const [tier, setTierState] = useState<PerfTier>('high')
  const [audioEnabled, setAudioEnabled] = useState(false)

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const setTier = useCallback((t: PerfTier) => setTierState(t), [])

  const value = useMemo(
    () => ({ tier, setTier, audioEnabled, setAudioEnabled, reducedMotion }),
    [tier, setTier, audioEnabled, reducedMotion]
  )

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>
}

export function useScene() {
  const ctx = useContext(SceneContext)
  if (!ctx) throw new Error('useScene must be used inside SceneProvider')
  return ctx
}

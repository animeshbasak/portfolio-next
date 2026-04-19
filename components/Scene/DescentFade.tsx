'use client'

import { useRef, useEffect } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import { descentStore } from '@lib/descentStore'

interface Props {
  children: ReactNode
  range?: [number, number]
  scaleMax?: number
  style?: CSSProperties
}

export default function DescentFade({
  children,
  range = [0.65, 0.95],
  scaleMax = 0.12,
  style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = (v: number) => {
      if (!ref.current) return
      const [s, e] = range
      const t = Math.max(0, Math.min(1, (v - s) / (e - s)))
      ref.current.style.opacity = String(1 - t)
      ref.current.style.transform = `scale(${1 - t * scaleMax})`
      ref.current.style.filter = `blur(${t * 4}px)`
    }
    update(descentStore.get())
    return descentStore.subscribe(update)
  }, [range, scaleMax])

  return (
    <div
      ref={ref}
      style={{ width: '100%', transformOrigin: 'center center', willChange: 'opacity, transform, filter', ...style }}
    >
      {children}
    </div>
  )
}

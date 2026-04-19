'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { descentStore } from '@lib/descentStore'

interface Props {
  targetSelector?: string
}

export default function DescentController({ targetSelector = '#hero' }: Props) {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      descentStore.set(0)
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    const target = document.querySelector(targetSelector)
    if (!target) return

    const st = ScrollTrigger.create({
      trigger: target as Element,
      start: 'top top',
      end: '+=100%',
      scrub: 0.5,
      onUpdate: (self) => descentStore.set(self.progress),
    })

    return () => {
      st.kill()
    }
  }, [targetSelector])

  return null
}

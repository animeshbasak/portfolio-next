'use client'

import { useEffect, useRef, type RefObject } from 'react'
import type { SculpturePalette } from './createSculpture'

type Props = {
  progress: RefObject<number>
  onFrame: (progress: number) => void
  onReady: () => void
  onFailure: () => void
  composition?: 'lab' | 'story'
}

export default function SculptureCanvas({ progress, onFrame, onReady, onFailure, composition = 'lab' }: Props) {
  const host = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = host.current
    if (!element) return
    let cancelled = false
    let teardown = () => {}

    async function initialize() {
      const [THREE, { createSculpture }] = await Promise.all([import('three'), import('./createSculpture')])
      if (cancelled || !element) return
      const root = element.closest('.folio-system')!
      const style = getComputedStyle(root)
      const read = (name: string) => style.getPropertyValue(name).trim()
      const palette: SculpturePalette = { paper: read('--folio-paper-100'), ink: read('--folio-ink-950'), indigo: read('--folio-indigo-600'), signal: read('--folio-vermilion-400'), chalk: read('--folio-paper-50'), line: read('--folio-paper-300') }
      const compact = (composition === 'story' ? window.innerWidth : element.clientWidth) < 700
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: composition === 'story', powerPreference: 'high-performance' })
      const sculpture = createSculpture(palette, compact, composition)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.25 : 1.75))
      renderer.setSize(element.clientWidth, element.clientHeight)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.domElement.setAttribute('aria-hidden', 'true')
      renderer.domElement.dataset.particles = String(sculpture.particleCount)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      element.appendChild(renderer.domElement)
      sculpture.camera.aspect = element.clientWidth / element.clientHeight
      sculpture.camera.updateProjectionMatrix()

      let raf = 0
      let inView = true
      let lastTime = 0
      let displayed = progress.current
      let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0
      let frameTotal = 0, sampleCount = 0

      function frame(now: number) {
        raf = 0
        if (cancelled || document.hidden || !inView) return
        const dt = lastTime ? Math.min(now - lastTime, 50) : 16.7
        lastTime = now
        const blend = 1 - Math.exp(-dt / 85)
        displayed += (progress.current - displayed) * blend
        pointerX += (targetX - pointerX) * blend
        pointerY += (targetY - pointerY) * blend
        const moving = Math.abs(progress.current - displayed) > 0.00002 || Math.abs(pointerX - targetX) > 0.001 || Math.abs(pointerY - targetY) > 0.001
        if (!moving) displayed = progress.current
        sculpture.update(displayed, pointerX, pointerY)
        renderer.render(sculpture.scene, sculpture.camera)
        renderer.domElement.dataset.progress = displayed.toFixed(5)
        onFrame(displayed)
        if (moving) {
          frameTotal += dt; sampleCount++
          if (sampleCount === 60) {
            if (frameTotal / sampleCount > 26 && renderer.getPixelRatio() > 1) renderer.setPixelRatio(Math.max(1, renderer.getPixelRatio() - 0.25))
            frameTotal = 0; sampleCount = 0
          }
          raf = requestAnimationFrame(frame)
        } else { lastTime = 0; frameTotal = 0; sampleCount = 0 }
      }
      function wake() { if (!raf && !cancelled && !document.hidden && inView) raf = requestAnimationFrame(frame) }
      function pointer(event: PointerEvent) {
        if (event.pointerType !== 'mouse') return
        targetX = (event.clientX / innerWidth - 0.5) * 2
        targetY = (event.clientY / innerHeight - 0.5) * 2
        wake()
      }
      function visibility() {
        if (document.hidden) { cancelAnimationFrame(raf); raf = 0; lastTime = 0 }
        else wake()
      }
      function contextLost(event: Event) { event.preventDefault(); cancelAnimationFrame(raf); raf = 0; onFailure() }
      const resize = new ResizeObserver(() => {
        renderer.setSize(element!.clientWidth, element!.clientHeight)
        sculpture.camera.aspect = element!.clientWidth / element!.clientHeight
        sculpture.camera.updateProjectionMatrix(); wake()
      })
      const intersection = new IntersectionObserver(entries => {
        inView = entries.some(entry => entry.isIntersecting)
        if (inView) wake()
        else { cancelAnimationFrame(raf); raf = 0; lastTime = 0 }
      })
      teardown = () => {
        cancelAnimationFrame(raf); resize.disconnect(); intersection.disconnect()
        window.removeEventListener('scroll', wake)
        window.removeEventListener('pointermove', pointer)
        document.removeEventListener('visibilitychange', visibility)
        renderer.domElement.removeEventListener('webglcontextlost', contextLost)
        sculpture.dispose(); renderer.dispose(); renderer.domElement.remove()
      }
      await renderer.compileAsync(sculpture.scene, sculpture.camera)
      if (cancelled) return
      sculpture.update(displayed)
      resize.observe(element)
      intersection.observe(element)
      window.addEventListener('scroll', wake, { passive: true })
      window.addEventListener('pointermove', pointer, { passive: true })
      document.addEventListener('visibilitychange', visibility)
      renderer.domElement.addEventListener('webglcontextlost', contextLost)
      onReady(); wake()
    }
    initialize().catch(() => { teardown(); if (!cancelled) onFailure() })
    return () => { cancelled = true; teardown() }
  }, [progress, onFrame, onReady, onFailure, composition])
  return <div ref={host} style={{ position: 'absolute', inset: 0 }} />
}

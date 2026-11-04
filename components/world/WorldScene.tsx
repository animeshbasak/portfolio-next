'use client'

import {useEffect, useRef, type RefObject} from 'react'

type Props = {progress: RefObject<number>; paused: boolean; reducedMotion: boolean; dark: boolean; onReady: () => void; onError: () => void}

export default function WorldScene(props: Props) {
  const host = useRef<HTMLDivElement>(null)
  const state = useRef(props)
  const wakeRef = useRef<() => void>(() => {})
  useEffect(() => { state.current = props; wakeRef.current() }, [props])
  useEffect(() => {
    const element = host.current
    if (!element) return
    let cancelled = false
    let teardown = () => {}
    async function initialize() {
      const [THREE, {createWorld}] = await Promise.all([import('three'), import('./createWorld')])
      if (cancelled || !element) return
      const renderer = new THREE.WebGLRenderer({antialias: true, powerPreference: 'high-performance'})
      teardown = () => { renderer.dispose(); renderer.domElement.remove() }
      renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 760 ? 1.25 : 1.5))
      renderer.setSize(element.clientWidth, element.clientHeight)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.12
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap
      const world = createWorld(renderer, innerWidth < 760)
      element.appendChild(renderer.domElement)
      renderer.domElement.setAttribute('aria-hidden', 'true')
      renderer.domElement.dataset.world = 'procedural-original'
      let frame = 0, lastTime = 0, elapsed = 0, renderedFrames = 0
      let displayed = state.current.progress.current
      let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0
      let slowFrames = 0, samples = 0
      function render(now: number) {
        frame = 0
        if (cancelled || document.hidden) return
        const current = state.current
        const dt = lastTime ? Math.min(now - lastTime, 64) : 16.7
        lastTime = now
        const still = current.paused || current.reducedMotion
        const target = current.reducedMotion ? Math.round(current.progress.current) : current.progress.current
        const blend = 1 - Math.exp(-dt / 110)
        displayed = current.reducedMotion ? target : displayed + (target - displayed) * blend
        if (Math.abs(target - displayed) < .0001) displayed = target
        pointerX += ((still ? 0 : targetX) - pointerX) * blend
        pointerY += ((still ? 0 : targetY) - pointerY) * blend
        if (!still) elapsed += dt / 1000
        world.palette(current.dark)
        world.update(displayed, elapsed, element!.clientWidth < 760, pointerX, pointerY)
        renderer.render(world.scene, world.camera)
        renderedFrames++
        const canvas = renderer.domElement
        canvas.dataset.progress = displayed.toFixed(3)
        canvas.dataset.frames = String(renderedFrames)
        canvas.dataset.ambientTime = elapsed.toFixed(3)
        canvas.dataset.triangles = String(renderer.info.render.triangles)
        canvas.dataset.drawCalls = String(renderer.info.render.calls)
        canvas.dataset.dpr = String(renderer.getPixelRatio())
        const moving = Math.abs(target - displayed) > .0001 || Math.abs(pointerX - (still ? 0 : targetX)) > .001 || Math.abs(pointerY - (still ? 0 : targetY)) > .001
        if (!still) {
          samples++; if (dt > 32) slowFrames++
          if (samples >= 90) {
            if (slowFrames > 45 && renderer.getPixelRatio() > 1) renderer.setPixelRatio(Math.max(1, renderer.getPixelRatio() - .25))
            samples = 0; slowFrames = 0
          }
        }
        // No idle animation: render again only while input or camera interpolation moves.
        if (moving) frame = requestAnimationFrame(render)
        else lastTime = 0
      }
      function wake() { if (!frame && !cancelled && !document.hidden) frame = requestAnimationFrame(render) }
      wakeRef.current = wake
      function resize() {
        if (!element) return
        renderer.setSize(element.clientWidth, element.clientHeight)
        world.camera.aspect = element.clientWidth / Math.max(1, element.clientHeight)
        world.camera.updateProjectionMatrix(); wake()
      }
      function pointer(event: PointerEvent) {
        if (event.pointerType !== 'mouse' || state.current.reducedMotion || state.current.paused) return
        targetX = event.clientX / innerWidth * 2 - 1; targetY = event.clientY / innerHeight * 2 - 1; wake()
      }
      function visibility() {
        if (document.hidden) { cancelAnimationFrame(frame); frame = 0; lastTime = 0 }
        else wake()
      }
      function contextLost(event: Event) { event.preventDefault(); cancelAnimationFrame(frame); frame = 0; state.current.onError() }
      const observer = new ResizeObserver(resize)
      teardown = () => {
        wakeRef.current = () => {}; cancelAnimationFrame(frame); observer.disconnect()
        window.removeEventListener('scroll', wake); window.removeEventListener('pointermove', pointer)
        document.removeEventListener('visibilitychange', visibility)
        renderer.domElement.removeEventListener('webglcontextlost', contextLost)
        world.dispose(); renderer.dispose(); renderer.domElement.remove()
      }
      resize()
      world.palette(state.current.dark)
      world.update(displayed, 0, innerWidth < 760, 0, 0)
      await renderer.compileAsync(world.scene, world.camera)
      if (cancelled) return
      observer.observe(element)
      window.addEventListener('scroll', wake, {passive: true}); window.addEventListener('pointermove', pointer, {passive: true})
      document.addEventListener('visibilitychange', visibility)
      renderer.domElement.addEventListener('webglcontextlost', contextLost)
      state.current.onReady(); wake()
    }
    initialize().catch(() => { teardown(); if (!cancelled) state.current.onError() })
    return () => { cancelled = true; teardown() }
  }, [])
  return <div ref={host} style={{position: 'absolute', inset: 0}}/>
}

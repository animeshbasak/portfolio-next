'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { FolioSwitch } from './FolioPrimitives'
import LayerStudy from './LayerStudy'
import { storyProgressAt, type StoryAnchor } from './motion/timeline'
import styles from './story.module.css'

const SculptureCanvas = dynamic(() => import('./motion/SculptureCanvas'), { ssr: false })
const navigation = [
  ['new-profile', 'Profile'], ['new-record', 'Career'], ['new-projects', 'Projects'], ['new-writing', 'Writing'], ['new-contact', 'Contact'],
] as const

export default function PortfolioStory({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const line = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState('new-profile')
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [systemReduce, setSystemReduce] = useState(false)
  const [manualReduce, setManualReduce] = useState(false)
  const [preferencesReady, setPreferencesReady] = useState(false)
  const reduced = systemReduce || manualReduce
  const onReady = useCallback(() => setReady(true), [])
  const onFailure = useCallback(() => { setFailed(true); setReady(false) }, [])
  const onFrame = useCallback((p: number) => {
    if (line.current) line.current.style.transform = `scaleY(${p})`
  }, [])

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setSystemReduce(media.matches)
    update(); setPreferencesReady(true)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const element = root.current
    if (!element) return
    const markers = Array.from(element.querySelectorAll<HTMLElement>('[data-story-at]'))
    const sections = navigation.map(([id]) => element.querySelector<HTMLElement>(`#${id}`)!)
    let anchors: StoryAnchor[] = []
    let sectionTops: number[] = []
    let raf = 0
    function update() {
      raf = 0
      const readingLine = scrollY + innerHeight * 0.42
      progress.current = storyProgressAt(readingLine, anchors)
      let index = 0
      sectionTops.forEach((top, i) => { if (readingLine >= top) index = i })
      setActive(navigation[index][0])
      // Copy always uses a complete contrast pair; no gray transition behind text.
      element!.dataset.dark = String(progress.current >= 0.33 && progress.current < 0.9)
      element!.dataset.scene = String(progress.current < 0.09 ? 'whole' : progress.current < 0.28 ? 'layers' : progress.current < 0.45 ? 'structure' : progress.current < 0.74 ? 'particles' : 'rebuilding')
      onFrame(progress.current)
    }
    function measure() {
      anchors = markers.map((marker, i) => ({ top: scrollY + marker.getBoundingClientRect().top + (i === 0 ? innerHeight * 0.42 : 0), progress: Number(marker.dataset.storyAt) }))
      sectionTops = sections.map(section => scrollY + section.getBoundingClientRect().top)
      update()
    }
    function scroll() { if (!raf) raf = requestAnimationFrame(update) }
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    measure()
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('resize', measure)
    return () => { observer.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('scroll', scroll); window.removeEventListener('resize', measure) }
  }, [onFrame])

  return <main ref={root} className={'folio-system ' + styles.story} data-design-system data-portfolio-story data-reduce-motion={reduced} data-dark="false">
    <a href="#new-projects" className={styles.skip}>Skip to projects</a>
    <header className={styles.header}>
      <a className={styles.brand} href="#story-start" aria-label="Animesh Basak, back to the start">a<span>·</span></a>
      <nav aria-label="Portfolio sections">{navigation.map(([id, label]) => <a key={id} href={'#' + id} aria-current={active === id ? 'location' : undefined}>{label}</a>)}</nav>
      <FolioSwitch checked={reduced} onChange={setManualReduce} disabled={systemReduce} label={systemReduce ? 'Still · system' : 'Still mode'} />
    </header>
    <div className={styles.world} aria-hidden="true" data-ready={ready && !reduced && !failed}>
      {preferencesReady && !reduced && !failed && <SculptureCanvas composition="story" progress={progress} onFrame={onFrame} onReady={onReady} onFailure={onFailure} />}
      {(!ready || reduced || failed) && <div className={styles.still}><LayerStudy spread={0.55} /></div>}
      <div className={styles.worldCaption}><span className={styles.captionWhole}>A PRACTICE, TAKING SHAPE</span><span className={styles.captionLayers}>EXPERIENCE ADDS A LAYER</span><span className={styles.captionStructure}>FROM INTERFACE TO SYSTEM</span><span className={styles.captionParticles}>SMALL DECISIONS. CONNECTED.</span><span className={styles.captionRebuilding}>THE THINKING COMES TOGETHER</span><i>AB / 2018—2026</i></div>
    </div>
    <div className={styles.content}>{children}</div>
    <div className={styles.readingProgress} aria-hidden="true"><div ref={line} /></div>
    {failed && <p className={styles.fallbackNotice}>Still view · your browser couldn’t load the 3D illustration.</p>}
  </main>
}

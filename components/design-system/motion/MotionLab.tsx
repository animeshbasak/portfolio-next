'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { FolioIcon, FolioSwitch } from '../FolioPrimitives'
import LayerStudy from '../LayerStudy'
import { chapters, chapterAt, clamp01, sceneAt } from './timeline'
import styles from './motion.module.css'

const SculptureCanvas = dynamic(() => import('./SculptureCanvas'), { ssr: false })

export default function MotionLab() {
  const track = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const range = useRef<HTMLInputElement>(null)
  const percentage = useRef<HTMLOutputElement>(null)
  const progressLine = useRef<HTMLDivElement>(null)
  const [chapter, setChapter] = useState(0)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [manualReduce, setManualReduce] = useState(false)
  const [systemReduce, setSystemReduce] = useState(false)
  const [preferencesReady, setPreferencesReady] = useState(false)
  const reduced = manualReduce || systemReduce
  const staticView = reduced || failed

  const onFrame = useCallback((p: number) => {
    setChapter(previous => { const next = chapterAt(p); return previous === next ? previous : next })
    if (range.current && document.activeElement !== range.current) range.current.value = String(Math.round(p * 100))
    if (percentage.current) percentage.current.value = String(Math.round(p * 100)).padStart(2, '0') + '%'
    if (progressLine.current) progressLine.current.style.transform = `scaleX(${p})`
    if (stage.current) {
      const depth = sceneAt(p).depth
      stage.current.dataset.deep = String(depth > 0.75)
      stage.current.dataset.progress = p.toFixed(4)
    }
  }, [])
  const onReady = useCallback(() => setReady(true), [])
  const onFailure = useCallback(() => { setFailed(true); setReady(false) }, [])

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setSystemReduce(media.matches)
    update(); setPreferencesReady(true)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    function update() {
      if (!track.current) return
      const rect = track.current.getBoundingClientRect()
      progress.current = clamp01(-rect.top / Math.max(1, track.current.offsetHeight - innerHeight))
      if (staticView || !ready) onFrame(progress.current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [staticView, ready, onFrame])

  function seek(p: number) {
    if (!track.current) return
    const top = scrollY + track.current.getBoundingClientRect().top
    window.scrollTo({ top: top + clamp01(p) * (track.current.offsetHeight - innerHeight), behavior: 'instant' })
  }
  const current = chapters[chapter]

  return <main className={'folio-system ' + styles.lab} data-design-system data-motion-lab data-reduce-motion={reduced}>
    <a className={styles.skipLink} href="#motion-notes">Skip the motion study</a>
    <div className={styles.track} ref={track}>
      <div className={styles.stage} ref={stage} data-deep="false" data-static={staticView} data-chapter={chapter}>
        <div className={styles.canvas} aria-hidden="true" data-ready={ready && !staticView}>
          {preferencesReady && !staticView && <SculptureCanvas progress={progress} onFrame={onFrame} onReady={onReady} onFailure={onFailure} />}
        </div>
        {(!ready || staticView) && <div className={styles.fallback} aria-hidden="true"><LayerStudy spread={staticView && chapter > 0 ? 1 : 0.3} /></div>}
        <header className={styles.header}>
          <a href="/design-system" className={styles.brand} aria-label="Back to design system"><span>a·</span><span>ANIMESH BASAK<small>INSIDE THE MAKING / MOTION STUDY 01</small></span></a>
          <div><FolioSwitch checked={reduced} onChange={setManualReduce} disabled={systemReduce} label={systemReduce ? 'Reduced motion · system' : 'Reduce motion'} /><a href="/design-system" className={styles.close} aria-label="Close motion study"><FolioIcon name="close" /></a></div>
        </header>
        <div className={styles.editorial} aria-live="polite" aria-atomic="true">
          <span className={styles.eyebrow}>0{chapter + 1} / {current.label.toUpperCase()}</span>
          <h1>{current.title.split('\n').map((line, i) => i === 0 ? <span key={line}>{line}</span> : <em key={line}>{line}</em>)}</h1>
          <p>{current.body}</p>
          {chapter === 5 && <button type="button" className={styles.replay} onClick={() => seek(0)}>Take another look <FolioIcon name="arrow" /></button>}
        </div>
        <div className={styles.objectLabel}><span>{staticView ? 'STILL STUDY' : 'A CONTINUOUS, REVERSIBLE OBJECT'}</span><span>{current.scale}</span></div>
        <div className={styles.scrollCue}><span /><p>{staticView ? 'Choose a chapter. Take your time.' : chapter === 5 ? 'The loop is complete.' : 'Scroll to unfold. Reverse to rebuild.'}</p></div>
        <nav className={styles.chapters} aria-label="Motion chapters">{chapters.map((item, i) => <button key={item.label} type="button" aria-current={chapter === i ? 'step' : undefined} aria-label={'Go to ' + item.label.toLowerCase()} onClick={() => seek(item.at)}><span>0{i + 1}</span><span>{item.label}</span></button>)}</nav>
        <div className={styles.scrubber}>
          <div><label htmlFor="motion-position">EXAMINE THE JOURNEY</label><output ref={percentage} htmlFor="motion-position">00%</output></div>
          <input id="motion-position" aria-label="Motion timeline position" type="range" min="0" max="100" defaultValue="0" step="1" ref={range} onChange={event => seek(Number(event.target.value) / 100)} />
          <div className={styles.scrubLabels}><span>OUTSIDE</span><span>WITHIN</span><span>WHOLE AGAIN</span></div>
        </div>
        <div className={styles.progress}><div ref={progressLine} /></div>
      </div>
    </div>
    <section id="motion-notes" className={styles.notes}>
      <span className={styles.eyebrow}>BUILT OVER TIME / THE NEXT CHAPTER</span>
      <h2>The story continues<br /><em>beyond the effect.</em></h2>
      <p>Explore the portfolio preview to see the career record, independent projects, and writing within the new design language.</p>
      <div><a href="/design-system/preview">Explore the portfolio preview <FolioIcon name="arrow" /></a><a href="/design-system">Explore the design system <FolioIcon name="arrow" /></a></div>
      <p className={styles.technicalNote}>{failed ? '3D is unavailable in this browser. The still study and chapter controls remain usable.' : reduced ? 'Reduced-motion view: a still illustration with instantly changing chapter text.' : 'Original geometry. Native scrolling. Local prototype.'}</p>
    </section>
  </main>
}

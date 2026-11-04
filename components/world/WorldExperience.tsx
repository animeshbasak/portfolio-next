'use client'

import dynamic from 'next/dynamic'
import {Component, useCallback, useEffect, useRef, useState, type ReactNode} from 'react'
import {PortfolioTheme, usePortfolioTheme} from '../personal/PortfolioTheme'
import {NAME_REVEAL_DURATION, NAME_ROWS, namePhase} from '../../lib/personal/name-reveal'
import {contactLinks} from '../../lib/portfolio/data'
import WorldGuide from './WorldGuide'

const WorldScene = dynamic(() => import('./WorldScene'), {ssr: false})
const chapterIds = ['world-identity', 'world-experience', 'world-work', 'world-practice', 'world-contact']
const generalTopics: Record<string, string> = {
  identity: 'world-identity', overview: 'world-identity', career: 'world-experience', experience: 'world-experience', fit: 'world-experience',
  projects: 'world-work', work: 'world-work', practice: 'world-practice', approach: 'world-practice', education: 'world-practice',
  writing: 'world-notes', notes: 'world-notes', contact: 'world-contact', collaboration: 'world-contact',
}
type WorldProps = {children: ReactNode; currentRole: string; topicTargets: Record<string, string>}

class SceneBoundary extends Component<{children: ReactNode; onError: () => void}, {failed: boolean}> {
  state = {failed: false}
  static getDerivedStateFromError() { return {failed: true} }
  componentDidCatch() { this.props.onError() }
  render() { return this.state.failed ? null : this.props.children }
}

function IdentityName({still}: {still: boolean}) {
  const [elapsed, setElapsed] = useState(Number.POSITIVE_INFINITY)
  useEffect(() => {
    if (still) { setElapsed(Number.POSITIVE_INFINITY); return }
    let frame = 0
    const start = performance.now()
    let last = 0
    const finish = () => { cancelAnimationFrame(frame); setElapsed(Number.POSITIVE_INFINITY) }
    const tick = (now: number) => {
      if (now - start >= NAME_REVEAL_DURATION) { finish(); return }
      if (now - last > 40) { setElapsed(now - start); last = now }
      frame = requestAnimationFrame(tick)
    }
    const visibility = () => { if (document.hidden) finish() }
    frame = requestAnimationFrame(tick)
    document.addEventListener('visibilitychange', visibility)
    return () => { cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', visibility) }
  }, [still])
  return <h1 className="world-name" aria-label="Animesh Basak">{NAME_ROWS.map((word, row) => <span key={word} aria-hidden="true">{[...word].map((letter, index) => <span key={index} data-phase={namePhase(row, index, elapsed)}>{letter}</span>)}</span>)}</h1>
}

function Arrow() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>
}

function WorldContent({children, currentRole, topicTargets}: WorldProps) {
  const {theme, ready, toggle} = usePortfolioTheme()
  const progress = useRef(0)
  const content = useRef<HTMLElement>(null)
  const [chapter, setChapter] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [sceneFailed, setSceneFailed] = useState(false)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(true)
  const [guideOpen, setGuideOpen] = useState(false)
  const guideTrigger = useRef<HTMLButtonElement>(null)
  const onSceneReady = useCallback(() => setSceneReady(true), [])
  const onSceneError = useCallback(() => setSceneFailed(true), [])

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setReducedMotion(media.matches)
    syncMotion()
    media.addEventListener('change', syncMotion)
    setMounted(true)
    return () => media.removeEventListener('change', syncMotion)
  }, [])

  useEffect(() => {
    let scheduled = 0
    const measure = () => {
      scheduled = 0
      const scroll = window.scrollY
      const headerHeight = document.querySelector('.world-header')?.getBoundingClientRect().height ?? 100
      const starts = chapterIds.map(id => {
        const element = document.getElementById(id)
        return element ? Math.max(0, element.getBoundingClientRect().top + scroll - headerHeight - 24) : Number.POSITIVE_INFINITY
      })
      let active = 0
      for (let index = 1; index < starts.length; index++) if (scroll >= starts[index]) active = index
      let next = active
      if (active < starts.length - 1) {
        const end = starts[active + 1]
        // Long reading sections retain their camera angle; only their final viewport transitions.
        const transitionLength = Math.min(window.innerHeight * .75, Math.max(1, end - starts[active]))
        next += Math.max(0, Math.min(1, (scroll - (end - transitionLength)) / transitionLength))
      }
      progress.current = next
      setChapter(active)
    }
    const schedule = () => { if (!scheduled) scheduled = requestAnimationFrame(measure) }
    const observer = new ResizeObserver(schedule)
    if (content.current) observer.observe(content.current)
    measure()
    window.addEventListener('scroll', schedule, {passive: true})
    window.addEventListener('resize', schedule)
    return () => { cancelAnimationFrame(scheduled); observer.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [])

  const onTopic = useCallback((topic: string) => {
    const id = Object.hasOwn(topicTargets, topic) ? topicTargets[topic] : Object.hasOwn(generalTopics, topic) ? generalTopics[topic] : undefined
    if (id) document.getElementById(id)?.scrollIntoView({behavior: reducedMotion ? 'instant' : 'smooth', block: 'start'})
  }, [reducedMotion, topicTargets])
  const closeGuide = useCallback(() => { setGuideOpen(false); guideTrigger.current?.focus({preventScroll: true}) }, [])

  return <div className="world-experience" data-theme={theme} data-paused={paused || reducedMotion} data-active-chapter={chapter}>
    <a className="world-skip" href="#world-experience">Skip to experience and work</a>
    <div className="world-canvas" aria-hidden="true">
      {(!sceneReady || sceneFailed || reducedMotion) && <div className="world-fallback"><div className="world-fallback-mark">A</div></div>}
      {mounted && !reducedMotion && !sceneFailed && <SceneBoundary onError={onSceneError}><WorldScene progress={progress} paused={paused || guideOpen} reducedMotion={reducedMotion} dark={theme === 'dark'} onReady={onSceneReady} onError={onSceneError}/></SceneBoundary>}
    </div>
    <header className="world-header">
      <a href="#world-identity" className="world-wordmark" aria-label="Animesh Basak, back to introduction">AB<span aria-hidden="true">.</span></a>
      <nav aria-label="Main navigation"><a href="#world-experience" aria-current={chapter === 1 ? 'location' : undefined}>Experience</a><a href="#world-work" aria-current={chapter === 2 ? 'location' : undefined}>Work</a><a href="#world-notes">Notes</a><button ref={guideTrigger} onClick={() => setGuideOpen(true)} aria-haspopup="dialog" className="world-guide-trigger"><span className="world-guide-spark" aria-hidden="true">✳</span>Ask AI</button></nav>
    </header>

    <main ref={content} className="world-document">
      <section className="world-identity" id="world-identity" data-world-chapter="0" aria-label="Introduction">
        <div className="world-reading-lane world-hero-lane">
          <p className="world-eyebrow"><span className="world-status-dot" aria-hidden="true"/>AN INDEPENDENT MIND · NEW DELHI</p>
          <IdentityName still={!mounted || reducedMotion || paused}/>
          <p className="world-hero-role">{currentRole}</p>
          <p className="world-hero-intro">I connect frontend, backend and native journeys—and build independent AI tools. Thoughtful systems for the things people do every day.</p>
          <div className="world-hero-links"><a className="world-text-link" href="#world-work">Explore my work <Arrow/></a><a className="world-text-link" href="/resume-public.pdf" target="_blank" rel="noopener noreferrer">Résumé <Arrow/><span className="world-sr-only"> (PDF, opens in a new tab)</span></a></div>
          <a className="world-scroll-cue" href="#world-experience"><span aria-hidden="true">↓</span>SCROLL TO DISCOVER</a>
        </div>
      </section>

      {children}

      <section className="world-section world-contact" id="world-contact" data-world-chapter="4" aria-labelledby="world-contact-title">
        <div className="world-reading-lane">
          <p className="world-eyebrow">04 / THE NEXT CONNECTION</p><h2 id="world-contact-title">What could we<br/>build together?</h2>
          <p className="world-section-intro">A difficult problem. An ambitious idea. A better way for something to work. Let’s start a conversation.</p>
          <a className="world-contact-email" href="mailto:animeshsbasak@gmail.com">animeshsbasak@gmail.com <Arrow/></a>
          <nav className="world-socials" aria-label="Connect with Animesh">{contactLinks.map(link => <a href={link.href} key={link.name} target="_blank" rel="noopener noreferrer">{link.name}<Arrow/><span className="world-sr-only"> (opens in a new tab)</span></a>)}</nav>
          <p className="world-contact-signoff">Animesh Basak · New Delhi, India</p>
          <a className="world-text-link" href="#world-identity">Back to the beginning <span aria-hidden="true">↑</span></a>
        </div>
      </section>
    </main>

    <footer className="world-footer" aria-label="Appearance controls">
      <div className="world-controls">
        <button disabled={!ready} onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{theme === 'dark' ? <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></> : <path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z"/>}</svg><span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span></button>
        <button disabled={reducedMotion} onClick={() => setPaused(value => !value)} aria-pressed={paused || reducedMotion} aria-label={reducedMotion ? 'Motion reduced by your device preference' : paused ? 'Resume ambient motion' : 'Pause ambient motion'}><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">{paused || reducedMotion ? <path d="m7 4 9 6-9 6Z"/> : <path d="M7 4v12m6-12v12"/>}</svg><span>{reducedMotion ? 'Still view' : paused ? 'Play motion' : 'Pause motion'}</span></button>
      </div>
    </footer>
    {sceneFailed && <p className="world-scene-message" role="status">A lighter view for this device. All the work is still here.</p>}
    <WorldGuide open={guideOpen} onClose={closeGuide} onTopic={onTopic}/>
  </div>
}

export default function WorldExperience(props: WorldProps) { return <PortfolioTheme><WorldContent {...props}/></PortfolioTheme> }

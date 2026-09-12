'use client'

import { useEffect, useState } from 'react'
import { FolioIcon, FolioSwitch } from './FolioPrimitives'
import { Foundations, Typography } from './Foundations'
import ComponentSpecimens from './ComponentSpecimens'
import MotionSpecimen from './MotionSpecimen'
import IntelligenceSpecimen from './IntelligenceSpecimen'
import LayerStudy from './LayerStudy'
import styles from './catalog.module.css'

const sections = [
  { id: 'overview', label: 'Overview', number: '00' },
  { id: 'foundations', label: 'Foundations', number: '01' },
  { id: 'typography', label: 'Typography', number: '02' },
  { id: 'components', label: 'Components', number: '03' },
  { id: 'motion', label: 'Motion', number: '04' },
  { id: 'intelligence', label: 'Intelligence', number: '05' },
]

export default function DesignSystem({ colors }: { colors: Record<string, string> }) {
  const [active, setActive] = useState('overview')
  const [manualReduce, setManualReduce] = useState(false)
  const [systemReduce, setSystemReduce] = useState(false)
  const [notice, setNotice] = useState('')
  const reduced = manualReduce || systemReduce

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setSystemReduce(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) setActive(visible[0].target.id)
    }, { rootMargin: '-100px 0px -55% 0px', threshold: 0 })
    sections.forEach(section => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 4000)
    return () => window.clearTimeout(timer)
  }, [notice])

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value.toUpperCase())
      setNotice(label + ' copied · ' + value.toUpperCase())
    } catch {
      setNotice('Copy unavailable. Select the displayed ' + label + ' value to copy it manually.')
    }
  }

  return <div className={['folio-system', styles.root].join(' ')} data-design-system data-reduce-motion={reduced}>
    <a className={styles.skipLink} href="#overview">Skip to design system</a>
    <header className={styles.header}>
      <a href="#overview" className={styles.brand} aria-label="Built over time design system, overview"><span className={styles.monogram}>a<span>·</span></span><span><strong>ANIMESH BASAK</strong><span>DESIGN LANGUAGE / 01</span></span></a>
      <div className={styles.headerActions}><span className={styles.localBadge}><span />Local workbench</span><a href="/design-system/tokens" className={styles.downloadLink}>Get the tokens <FolioIcon name="down" /></a></div>
    </header>
    <aside className={styles.sidebar}>
      <p className={styles.sidebarLabel}>THE SYSTEM</p>
      <nav aria-label="Design system sections">
        {sections.map(section => <a href={'#' + section.id} key={section.id} aria-current={active === section.id ? 'location' : undefined} onClick={() => setActive(section.id)}><span>{section.number}</span>{section.label}<span className={styles.navDot} /></a>)}
      </nav>
      <div className={styles.sidebarFoot}>
        <span className={styles.sidebarThread} aria-hidden="true">↳</span>
        <p>A living system.<br /><em>Meant to grow.</em></p>
        <a href="/">Current portfolio <span aria-hidden="true">↗</span></a>
      </div>
    </aside>
    <main className={styles.main}>
      <section id="overview" className={styles.overview} aria-label="Design system overview">
        <div className={styles.workbenchBar}><span className={styles.smallLabel}>A PERSONAL PORTFOLIO, CONSIDERED.</span><FolioSwitch checked={reduced} onChange={setManualReduce} disabled={systemReduce} label={systemReduce ? 'Reduced motion · system' : 'Reduce motion'} /></div>
        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={styles.heroEyebrow}><span />THE FOUNDATION / V0.1</div>
            <h1>Built over<br /><em>time<span>.</span></em></h1>
            <p>A little more human.<br />A little more considered.<br />A system for the story ahead.</p>
            <a href="#foundations" className={styles.heroLink}>Explore the system <FolioIcon name="arrow" /></a>
          </div>
          <div className={styles.heroArt}>
            <span className={styles.heroFigure}>FIG. 01 — CURIOSITY COMPOUNDS</span>
            <LayerStudy />
            <div className={styles.heroArtFoot}><span>One thread. Many chapters.</span><span className={styles.artCross}>+</span></div>
          </div>
        </div>
        <div className={styles.principles}>
          <div><span>01 / HUMAN</span><p>Story before spectacle.</p></div>
          <div><span>02 / PRECISE</span><p>Every detail has a job.</p></div>
          <div><span>03 / EXPLORABLE</span><p>Leave room for curiosity.</p></div>
        </div>
      </section>
      <Foundations colors={colors} onCopy={copy} />
      <Typography />
      <ComponentSpecimens notify={setNotice} />
      <MotionSpecimen reduced={reduced} />
      <IntelligenceSpecimen />
      <footer className={styles.footer}>
        <div><span className={styles.smallLabel}>A FOUNDATION FOR WHAT’S NEXT.</span><p>On to the next <em>chapter.</em></p></div>
        <a href="#overview" aria-label="Back to top"><FolioIcon name="arrow" /></a>
        <div className={styles.footerMeta}><span>Animesh Basak / 2026</span><span>Built over time · Design system v0.1</span></div>
      </footer>
    </main>
    <div className={styles.noticeRegion} role="status" aria-live="polite" aria-atomic="true">{notice && <div className={styles.notice}><FolioIcon name="check" /><span>{notice}</span><button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')}><FolioIcon name="close" /></button></div>}</div>
  </div>
}

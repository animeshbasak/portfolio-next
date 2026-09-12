'use client'

import { useState } from 'react'
import { FolioChoices, FolioIcon, FolioSectionHeading } from './FolioPrimitives'
import LayerStudy from './LayerStudy'
import styles from './catalog.module.css'

export default function MotionSpecimen({ reduced }: { reduced: boolean }) {
  const [state, setState] = useState<'gather' | 'unfold' | 'branch'>('unfold')
  return <section id="motion" className={styles.section}>
    <FolioSectionHeading number="04" title="Motion with meaning.">A change of state should feel like a continuation.</FolioSectionHeading>
    <div className={styles.motionPanel}>
      <div className={styles.motionCopy}>
        <span className={styles.smallLabel}>THE SIGNATURE GESTURE</span>
        <h3>One thread.<br /><em>More possibilities.</em></h3>
        <p>Layers separate to reveal a journey. A second path makes room for another decision.</p>
        <FolioChoices label="Layer arrangement" options={[{ value: 'gather', label: 'Gather' }, { value: 'unfold', label: 'Unfold' }, { value: 'branch', label: 'Branch' }]} value={state} onChange={setState} />
        <p className={styles.motionCaption} aria-live="polite">{reduced ? 'Reduced motion · states change instantly.' : 'Select a state to preview the transition.'}</p>
      </div>
      <div className={styles.motionArt}><LayerStudy spread={state === 'gather' ? 0.12 : 1} branched={state === 'branch'} /><span className={styles.artCaption}>{state === 'gather' ? '01 — POSSIBILITY, GATHERED' : state === 'branch' ? '03 — ANOTHER WAY FORWARD' : '02 — A LITTLE MORE PERSPECTIVE'}</span></div>
    </div>
    <div className={styles.motionLinks}><a href="/design-system/preview">Enter the portfolio story <FolioIcon name="arrow" /></a><a href="/design-system/motion">Open the motion lab <FolioIcon name="arrow" /></a></div>
    <div className={styles.motionRules}>
      <div><span>160<span>ms</span></span><h3>Respond</h3><p>Buttons, focus, and small acknowledgments.</p></div>
      <div><span>240<span>ms</span></span><h3>Transition</h3><p>A selection or change of interface state.</p></div>
      <div><span>700<span>ms</span></span><h3>Unfold</h3><p>A deliberate, user-triggered spatial gesture.</p></div>
      <div><span>0<span>ms</span></span><h3>Respect</h3><p>Instant states when reduced motion is preferred.</p></div>
    </div>
  </section>
}

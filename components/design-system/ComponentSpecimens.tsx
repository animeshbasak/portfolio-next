'use client'

import { useState } from 'react'
import { FolioBadge, FolioButton, FolioChoices, FolioField, FolioIcon, FolioSectionHeading, FolioSwitch, type IconName } from './FolioPrimitives'
import styles from './catalog.module.css'

export default function ComponentSpecimens({ notify }: { notify: (text: string) => void }) {
  const [detail, setDetail] = useState(false)
  const [view, setView] = useState('journey')
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const invalid = touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const icons: IconName[] = ['arrow', 'down', 'copy', 'check', 'plus', 'play', 'close', 'branch']
  return <section id="components" className={styles.section}>
    <FolioSectionHeading number="03" title="Small things, done well.">A toolkit that feels like part of the same conversation.</FolioSectionHeading>
    <div className={styles.componentGrid}>
      <div className={styles.componentPanel}>
        <div className={styles.panelHeading}><h3>Calls to action</h3><span>01 / BUTTONS</span></div>
        <div className={styles.buttonSamples}>
          <FolioButton icon="arrow" onClick={() => notify('Primary action activated.')}>Explore the journey</FolioButton>
          <FolioButton variant="secondary" icon="down" onClick={() => window.location.assign('/design-system/tokens')}>Download tokens</FolioButton>
          <FolioButton variant="quiet" icon="arrow" onClick={() => notify('Text action activated.')}>A little about me</FolioButton>
          <FolioButton disabled icon="arrow">Coming next</FolioButton>
        </div>
        <p className={styles.annotation}>One primary action at a time. A quieter path for everything else.</p>
      </div>
      <div className={styles.componentPanel}>
        <div className={styles.panelHeading}><h3>Clear signals</h3><span>02 / FEEDBACK</span></div>
        <div className={styles.badgeSamples}><FolioBadge tone="success">Available</FolioBadge><FolioBadge tone="accent">Exploring</FolioBadge><FolioBadge>Independent work</FolioBadge><FolioBadge tone="warning">Guided mode</FolioBadge></div>
        <div className={styles.switchExample}><FolioSwitch checked={detail} onChange={setDetail} label="Show the thinking behind it" /><p>{detail ? 'A little more context: each state pairs a clear label with a visual signal.' : 'Just enough context to keep moving.'}</p></div>
        <div className={styles.iconSamples}>{icons.map(icon => <span key={icon} title={icon}><FolioIcon name={icon} /></span>)}</div>
      </div>
      <div className={styles.componentPanel}>
        <div className={styles.panelHeading}><h3>Room for a question</h3><span>03 / INPUTS</span></div>
        <div className={styles.fieldSamples}>
          <FolioField label="What are you curious about?" placeholder="How do you approach a difficult decision?" hint="A visible label. A useful hint. No guesswork." />
          <FolioField label="Your email · validation example" type="email" value={email} onChange={e => setEmail(e.target.value)} onBlur={() => setTouched(true)} placeholder="you@example.com" error={invalid ? 'Enter a complete email, like you@example.com.' : undefined} hint="Try an incomplete address, then leave the field. Nothing is sent." />
        </div>
      </div>
      <div className={styles.componentPanel}>
        <div className={styles.panelHeading}><h3>Choose your depth</h3><span>04 / SELECTION</span></div>
        <FolioChoices label="Content preview" options={[{ value: 'journey', label: 'Journey' }, { value: 'experiments', label: 'Experiments' }, { value: 'notes', label: 'Notes' }]} value={view} onChange={setView} />
        <div className={styles.selectionPreview} aria-live="polite">
          <span className={styles.smallLabel}>{view === 'journey' ? 'A CONTINUOUS THREAD' : view === 'experiments' ? 'LEARNING BY DOING' : 'A THOUGHT, SHARED'}</span>
          <h4>{view === 'journey' ? 'Every chapter adds something.' : view === 'experiments' ? 'Change one thing.' : 'Leave room for a better question.'}</h4>
          <p>{view === 'journey' ? 'A personal story, with space to pause and explore.' : view === 'experiments' ? 'Small, original studies in how software behaves.' : 'Short reflections, written with care and in your own words.'}</p>
        </div>
      </div>
    </div>
    <div className={styles.accessNote}><FolioIcon name="check" /><p>Designed for keyboard and touch. Visible focus, 44 px minimum control targets, and feedback that uses words as well as color.</p></div>
  </section>
}

'use client'

import { useState, type FormEvent } from 'react'
import { FolioBadge, FolioButton, FolioChoices, FolioIcon, FolioSectionHeading } from './FolioPrimitives'
import styles from './catalog.module.css'

type PreviewState = 'ready' | 'thinking' | 'answer' | 'offline'
const example = 'Can it feel instant and stay current?'

export default function IntelligenceSpecimen() {
  const [state, setState] = useState<PreviewState>('ready')
  const [question, setQuestion] = useState(example)
  const [custom, setCustom] = useState(false)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!question.trim()) return
    setCustom(question.trim() !== example)
    setState('answer')
  }
  return <section id="intelligence" className={styles.section}>
    <FolioSectionHeading number="05" title="Intelligence, with a human touch.">Useful, grounded, and honest about what it knows.</FolioSectionHeading>
    <div className={styles.studioGrid}>
      <div className={styles.studioNote}>
        <span className={styles.smallLabel}>PROOF STUDIO</span>
        <h3>Ask a question.<br /><em>Try the answer.</em></h3>
        <p>A place to explore a decision, change a constraint, and understand what happens next.</p>
        <div className={styles.studioPrinciple}><span>01</span><p>Evidence before claims.</p></div>
        <div className={styles.studioPrinciple}><span>02</span><p>Original, public examples.</p></div>
        <div className={styles.studioPrinciple}><span>03</span><p>A useful path, even offline.</p></div>
      </div>
      <div className={styles.studioSpecimen}>
        <div className={styles.studioHeader}><span className={styles.studioLogo}><FolioIcon name="branch" />Proof Studio</span><FolioBadge tone={state === 'offline' ? 'warning' : 'neutral'}>{state === 'offline' ? 'Guided mode' : 'UI preview'}</FolioBadge></div>
        <div className={styles.studioBody} aria-live="polite" aria-atomic="true">
          {state === 'ready' && <div className={styles.studioReady}><span className={styles.studioAsterisk}>✳</span><h4>A good question<br />is a good beginning.</h4><p>Explore the trade-offs behind a small, original experiment.</p><button type="button" onClick={() => { setQuestion(example); setCustom(false); setState('answer') }}>Try the reading-board example <FolioIcon name="arrow" /></button></div>}
          {state === 'thinking' && <div className={styles.thinkingState}><span className={styles.smallLabel}>THINKING STATE / PREVIEW</span><h4>Looking for a useful example.</h4><div className={styles.skeleton} /><div className={styles.skeleton} /><div className={styles.skeletonShort} /><p>This is a visual state specimen. No request is running.</p></div>}
          {state === 'answer' && <div className={styles.answerState}><span className={styles.smallLabel}>WRITTEN EXAMPLE / READING BOARD</span><h4>Fast and fresh ask<br />different things.</h4>{custom && <p className={styles.previewNotice}>Live questions are not connected yet. Here is the written example used to preview this component.</p>}<p>A cached copy can appear immediately. Waiting for a new response gives you newly verified information. The right choice depends on how old the displayed information is allowed to be.</p><div className={styles.answerSource}><FolioIcon name="check" /><span>Authored example · synthetic scenario</span></div></div>}
          {state === 'offline' && <div className={styles.offlineState}><span className={styles.smallLabel}>A USEFUL FALLBACK</span><h4>Still curious?<br />Keep exploring.</h4><p>Live answers are unavailable. The guided examples are here whenever you need them.</p><FolioButton variant="secondary" icon="arrow" onClick={() => { setCustom(false); setState('answer') }}>Read the guided example</FolioButton></div>}
        </div>
        <form className={styles.studioForm} onSubmit={submit}>
          <label htmlFor="studio-question" className={styles.srOnly}>Preview a question</label>
          <input id="studio-question" value={question} maxLength={200} onChange={e => setQuestion(e.target.value)} placeholder="What are you curious about?" />
          <button type="submit" disabled={!question.trim()} aria-label="Preview answer"><FolioIcon name="arrow" /></button>
        </form>
        <p className={styles.studioDisclaimer}>Design specimen · written content · no AI API connected</p>
      </div>
    </div>
    <div className={styles.studioStatePicker}><span className={styles.smallLabel}>EXPLORE THE STATES</span><FolioChoices label="Intelligence preview state" options={[{ value: 'ready', label: 'Ready' }, { value: 'thinking', label: 'Thinking' }, { value: 'answer', label: 'Answer' }, { value: 'offline', label: 'Offline' }]} value={state} onChange={v => { setCustom(false); setState(v) }} /></div>
  </section>
}

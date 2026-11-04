'use client'

import {useEffect, useRef, useState, type FormEvent} from 'react'
import {createInquiryMailto, createKickoffBrief, DEMO_INTAKE, EMPTY_INTAKE, INTAKE_FIELDS, validateIntake, type Intake, type IntakeErrors, type IntakeKey} from '../../lib/services/onboarding'
import s from './services.module.css'

export default function OnboardingDemo() {
  const [intake, setIntake] = useState<Intake>({...EMPTY_INTAKE})
  const [errors, setErrors] = useState<IntakeErrors>({})
  const [brief, setBrief] = useState('')
  const [status, setStatus] = useState('')
  const [ready, setReady] = useState(false)
  const previewTitle = useRef<HTMLHeadingElement>(null)
  const hasInput = Object.values(intake).some(Boolean)
  // Prevent native form submission before the browser has installed our handler.
  useEffect(() => setReady(true), [])

  function update(key: IntakeKey, value: string) {
    setIntake(current => ({...current, [key]: value}))
    setErrors(current => ({...current, [key]: undefined}))
    setBrief('')
    setStatus(brief ? 'Details changed. Generate the brief again to include your edits.' : '')
  }

  function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = validateIntake(intake)
    if (!result.ok) {
      setErrors(result.errors)
      setBrief('')
      setStatus('Check the highlighted fields, then generate again.')
      const first = INTAKE_FIELDS.find(field => result.errors[field.key])
      document.getElementById(`intake-${first?.key}`)?.focus()
      return
    }
    setErrors({})
    setBrief(createKickoffBrief(result.value))
    setStatus('Draft created in this browser. Review it before downloading or sharing.')
    requestAnimationFrame(() => previewTitle.current?.focus())
  }

  function download() {
    try {
      const url = URL.createObjectURL(new Blob([brief], {type: 'text/markdown;charset=utf-8'}))
      const link = document.createElement('a')
      link.href = url
      link.download = 'client-onboarding-brief.md'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setStatus('Download requested. If your browser blocked it, copy the Markdown from the preview.')
    } catch {
      setStatus('The download could not start. You can select and copy the Markdown from the preview.')
    }
  }

  return <div className={s.generator}>
    <div className={s.privacy}><strong>Your details stay in this browser.</strong><p>This form makes no network requests and saves no entries. Download your brief before refreshing or leaving this page. Download saves a local file; “Open enquiry draft” passes a short summary to your email app only when you click it. You choose whether to send. Use aliases and avoid passwords or sensitive client information.</p></div>
    <noscript><p className={s.privacy}>The demo needs JavaScript. You can still email animeshsbasak@gmail.com to discuss your workflow.</p></noscript>
    <div className={s.demoTools}>
      <button type="button" className="folio-btn" disabled={!ready || hasInput} aria-describedby="demo-example-note" onClick={() => {setIntake({...DEMO_INTAKE}); setErrors({}); setBrief(''); setStatus('Fictional example loaded. Edit it or generate a brief.')}}>Use fictional example</button>
      <button type="button" className="folio-btn" disabled={!ready || !hasInput} onClick={() => {setIntake({...EMPTY_INTAKE}); setErrors({}); setBrief(''); setStatus('All demo fields cleared.'); document.getElementById('intake-agency')?.focus()}}>Clear all fields</button>
      <span id="demo-example-note" className={s.note}>{hasInput ? 'Clear the form to load the example without overwriting your details.' : 'Northstar Studio and Cedar Café are fictional.'}</span>
    </div>
    <form className={s.form} onSubmit={generate} noValidate aria-label="Client onboarding intake">
      <p className={s.formNote}>Fields marked * are required. All other details can be confirmed at kickoff.</p>
      {INTAKE_FIELDS.map(field => {
        const id = `intake-${field.key}`
        const props = {id, name: field.key, disabled: !ready, value: intake[field.key], required: field.required, maxLength: field.maxLength, 'aria-invalid': Boolean(errors[field.key]), 'aria-describedby': `${id}-hint${errors[field.key] ? ` ${id}-error` : ''}`, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(field.key, event.target.value)}
        return <div className={`${s.field} ${field.multiline ? s.wide : ''}`} key={field.key}>
          <label htmlFor={id}>{field.label}{field.required && <span aria-hidden="true"> *</span>}</label>
          {field.multiline ? <textarea {...props} rows={field.key === 'goal' ? 4 : 3} /> : <input {...props} type="text" autoComplete="off" />}
          <div id={`${id}-hint`} className={s.hint}>{field.hint} <span>{intake[field.key].length}/{field.maxLength}</span></div>
          {errors[field.key] && <p id={`${id}-error`} className={s.error}>{errors[field.key]}</p>}
        </div>
      })}
      <div className={s.formActions}><button type="submit" className="folio-btn" data-variant="primary" disabled={!ready}>Generate kickoff brief ↓</button><span className={s.note}>Formats your entries. No AI calls or automatic sending.</span></div>
    </form>
    <p role="status" aria-live="polite" className={s.status}>{status}</p>
    {brief && <section className={s.preview} aria-labelledby="brief-title">
      <p className="folio-eyebrow">Your draft / ready for review</p><h3 id="brief-title" ref={previewTitle} tabIndex={-1}>Check the facts.<br />Then take it with you.</h3>
      <p>All supplied details are included below. Empty optional fields stay unconfirmed. The checklist is a starting point for a person to review.</p>
      <label htmlFor="brief-markdown">Markdown brief — select the text to copy it</label><textarea id="brief-markdown" value={brief} readOnly rows={18} spellCheck={false} />
      <div className={s.actions}><button type="button" className="folio-btn" data-variant="primary" onClick={download}>Download Markdown ↓</button><a className="folio-btn" href={createInquiryMailto(intake)}>Open enquiry draft ↗</a></div>
      <p className={s.note}>The email draft includes your agency and desired outcome. The full brief is not attached automatically; review it and attach the downloaded file yourself if you want to share it.</p>
    </section>}
  </div>
}

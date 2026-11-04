'use client'

import {useEffect, useRef, useState} from 'react'
import type {AssistantResponse} from '../../lib/assistant/engine'

type Turn = AssistantResponse & {question: string; id: number}
const starters = ['What has Animesh built?', 'How does PAARTH work?', 'Where has he worked?']
const isPublicLink = (value: string) => /^\/(?!\/)/.test(value) || /^https?:\/\//i.test(value)

function validResponse(value: unknown): value is AssistantResponse {
  if (!value || typeof value !== 'object') return false
  const reply = value as Partial<AssistantResponse>
  return typeof reply.answer === 'string' && Boolean(reply.answer.trim()) && typeof reply.topic === 'string'
    && (reply.mode === 'local-ai' || reply.mode === 'curated')
    && Array.isArray(reply.sources) && reply.sources.every(source => source && typeof source.label === 'string' && typeof source.href === 'string' && isPublicLink(source.href))
    && Array.isArray(reply.suggestions) && reply.suggestions.every(suggestion => typeof suggestion === 'string')
}

export default function WorldGuide({open, onClose, onTopic}: {open: boolean; onClose: () => void; onTopic: (topic: string) => void}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const request = useRef<AbortController | null>(null)
  const input = useRef<HTMLTextAreaElement>(null)
  const feed = useRef<HTMLDivElement>(null)
  const lastTurn = useRef<HTMLElement>(null)
  const sequence = useRef(0)
  const [question, setQuestion] = useState('')
  const [turns, setTurns] = useState<Turn[]>([])
  const [pending, setPending] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal()
    if (!open) { request.current?.abort('closed'); dialog.current?.close() }
  }, [open])
  useEffect(() => () => request.current?.abort('unmounted'), [])
  useEffect(() => {
    if (lastTurn.current && feed.current) {
      const offset = lastTurn.current.getBoundingClientRect().top - feed.current.getBoundingClientRect().top + feed.current.scrollTop
      feed.current.scrollTo({top: Math.max(0, offset - 20), behavior: 'instant'})
    }
  }, [turns.at(-1)?.id])

  async function ask(value: string) {
    const clean = value.trim()
    if (!clean || clean.length > 1200 || request.current) return
    const controller = new AbortController()
    request.current = controller
    const timer = window.setTimeout(() => controller.abort('timeout'), 32000)
    setQuestion(clean)
    setBusy(true)
    setPending(clean)
    setError('')
    try {
      const history = turns.slice(-3).flatMap(turn => [{role: 'user', content: turn.question.slice(0, 1200)}, {role: 'assistant', content: turn.answer.slice(0, 1200)}])
      const response = await fetch('/api/assistant', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({question: clean, history}), signal: controller.signal})
      if (!response.ok) throw new Error(response.status === 429 ? 'A few too many questions at once. Please try again in a minute.' : 'The guide couldn’t answer just now. Your question is still here; please try again.')
      const reply: unknown = await response.json()
      if (!validResponse(reply)) throw new Error('That answer was incomplete. Please try again.')
      if (controller.signal.aborted) return
      setTurns(previous => [...previous, {...reply, question: clean, id: ++sequence.current}].slice(-12))
      setQuestion('')
      onTopic(reply.topic)
    } catch (cause) {
      if (controller.signal.reason === 'timeout') setError('That took too long. Your question is still here; please try again.')
      else if (!controller.signal.aborted) setError(cause instanceof TypeError ? 'Couldn’t connect. Your question is still here. Try again when you’re online.' : cause instanceof Error ? cause.message : 'Couldn’t connect. Please try again.')
    } finally {
      clearTimeout(timer)
      if (request.current === controller) { request.current = null; setBusy(false); setPending('') }
    }
  }
  function reset() {
    request.current?.abort('cleared')
    request.current = null
    setBusy(false)
    setPending('')
    setTurns([])
    setQuestion('')
    setError('')
    input.current?.focus({preventScroll: true})
  }
  const latest = turns.at(-1)

  return <dialog ref={dialog} className="world-guide" aria-labelledby="world-guide-title" onCancel={event => { event.preventDefault(); onClose() }} onClose={onClose} onClick={event => { if (event.target === dialog.current) { const bounds = dialog.current.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose() } }}>
    <header className="world-guide-header"><div><span className="world-guide-label">A PERSONAL AI GUIDE</span><h2 id="world-guide-title">Follow your curiosity.</h2></div><button className="world-guide-close" aria-label="Close AI guide" onClick={onClose}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></header>
    <div className="world-guide-feed" ref={feed}>
      {!latest && !busy && <div className="world-guide-welcome"><span className="world-guide-emblem" aria-hidden="true">✳</span><p>There’s a person behind the projects.</p><p>Ask about my work, the decisions behind it, or the journey so far.</p></div>}
      {latest && <div className="world-guide-toolbar"><span>YOUR CONVERSATION</span><button onClick={reset}>Start fresh ↺</button></div>}
      <div aria-live="polite" aria-relevant="additions">{turns.map((turn, index) => <article key={turn.id} className="world-guide-turn" ref={index === turns.length - 1 ? lastTurn : null}>
        <h3><span>You asked</span>{turn.question}</h3>
        <div className="world-guide-answer"><p className="world-guide-byline"><span aria-hidden="true">AB</span>Portfolio guide<small>{turn.mode === 'local-ai' ? 'Local AI · public sources' : 'From the portfolio notes'}</small></p>{turn.answer.split(/\n\s*\n/).map((paragraph, i) => <p className="world-guide-paragraph" key={i}>{paragraph}</p>)}</div>
        {turn.sources.length > 0 && <nav className="world-guide-sources" aria-label="Sources for this answer">{turn.sources.map(source => <a key={source.href + source.label} href={source.href} target="_blank" rel="noopener noreferrer">{source.label}<span aria-hidden="true">↗</span><span className="world-sr-only"> (opens in a new tab)</span></a>)}</nav>}
      </article>)}</div>
      {busy && <div className="world-guide-pending" role="status"><span className="world-guide-thinking" aria-hidden="true"/><div>Finding the connections…<small>{pending}</small></div><button onClick={() => request.current?.abort('cancelled')}>Stop</button></div>}
    </div>
    <div className="world-guide-controls">
      <div className="world-guide-suggestions" aria-label="Suggested questions">{(latest ? latest.suggestions : starters).slice(0, 3).map(text => <button key={text} disabled={busy} onClick={() => void ask(text)}>{text}<span aria-hidden="true">↗</span></button>)}</div>
      <form className="world-guide-composer" onSubmit={event => { event.preventDefault(); void ask(question) }}><label htmlFor="world-guide-question">{latest ? 'Ask a follow-up question' : 'Ask about Animesh'}</label><div><textarea ref={input} id="world-guide-question" value={question} onChange={event => { setQuestion(event.target.value); setError('') }} maxLength={1200} rows={2} disabled={busy} placeholder="What would you like to know?" aria-describedby="world-guide-privacy world-guide-error" onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void ask(question) } }}/><button type="submit" disabled={busy || !question.trim()} aria-label="Send question"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg></button></div></form>
      <p className="world-guide-error" id="world-guide-error" role="alert">{error}</p>
      <p className="world-guide-privacy" id="world-guide-privacy">Public knowledge. No saved conversations.<br/>AI can make mistakes. Check the sources.</p>
    </div>
  </dialog>
}

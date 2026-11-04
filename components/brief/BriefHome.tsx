'use client'

import {useEffect, useMemo, useRef, useState} from 'react'
import {briefFromHash, briefFromRoute, briefFromText, type Briefing, type RouteName, type Row} from '../../lib/paarth/engine'
import './brief.css'

const SHOWN = 5
const MAIL = 'animeshsbasak@gmail.com'
const TIERS: [string, Row['tier']][] = [['In his work', 'work'], ['Fits', 'fit'], ['On his résumé', 'listed'], ['Worth asking', 'ask']]

function Line({row, i}: {row: Row; i: number}) {
  return <li className="line" data-tier={row.tier} style={{'--i': i} as React.CSSProperties}>
    <q className="line__ask">{row.ask.map((s, k) => s.u ? <u key={k}>{s.t}</u> : <span key={k}>{s.t}</span>)}</q>
    <div className="line__proof"><p>{row.proof}</p>{row.href && <a href={row.href}>{row.src}</a>}</div>
  </li>
}

export default function BriefHome({initial, sample}: {initial: Briefing; sample: string}) {
  const [brief, setBrief] = useState(initial)
  const [run, setRun] = useState(0)
  const [query, setQuery] = useState(sample)
  const [placeholder, setPlaceholder] = useState('Paste a job description or a project brief')
  const [invalid, setInvalid] = useState(false)
  const [status, setStatus] = useState<'answered' | 'matched' | 'empty' | 'route'>('answered')
  const [shareNote, setShareNote] = useState('')
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const section = useRef<HTMLElement>(null)
  const box = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setReady(true)
    const shared = briefFromHash(location.hash)
    if (shared) setBrief(shared)
  }, [])

  // After a run, take the visitor to the answers.
  useEffect(() => {
    if (!run || !section.current) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    section.current.scrollIntoView({behavior: reduced ? 'auto' : 'smooth', block: 'start'})
    section.current.focus({preventScroll: true})
  }, [run])

  // The work a line cites lights up with the red asterisk.
  const cited = useMemo(() => new Set(brief.rows.flatMap((r) => r.href?.startsWith('#') ? [r.href] : [])), [brief])
  const c = (href: string) => (cited.has(href) ? '' : undefined)

  function show(next: Briefing, why: typeof status) { setBrief(next); setOpen(false); setShareNote(''); setStatus(why); setRun((n) => n + 1) }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) { setInvalid(true); setStatus('empty'); box.current?.focus(); return }
    setInvalid(false)
    show(briefFromText(query), 'matched')
  }

  function route(name: RouteName) {
    if (name === 'project') { setQuery(''); setPlaceholder('What are you building, and by when?') }
    show(briefFromRoute(name), 'route')
  }

  async function share() {
    const url = `${location.href.split('#')[0]}#brief=${brief.mode}${brief.keys.length ? ':' + brief.keys.join(',') : ''}`
    try { await navigator.clipboard.writeText(url); setShareNote('Link copied. It carries the matches, not your pasted text.') }
    catch { setShareNote(`Copy this link: ${url}`) }
  }

  const tally = TIERS.map(([label, t]) => [label, brief.rows.filter((r) => r.tier === t).length] as const).filter(([, n]) => n)
  const mail = `mailto:${MAIL}?subject=${encodeURIComponent(brief.subject)}`

  return <div className="bh">
    <a className="bh-skip" href="#bh-main">Skip to the page</a>
    <header className="container nav">
      <a className="wordmark" href="#top" aria-label="Animesh Basak, home">AB</a>
      <nav aria-label="Main">
        <ul>
          <li><a href="#work">Work</a></li>
          <li><a href="#airtel">Airtel</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="/resume-public.pdf" target="_blank" rel="noopener noreferrer">Résumé</a></li>
        </ul>
      </nav>
    </header>

    <div id="bh-main">
      <section className="container hero" id="top" aria-labelledby="name">
        <div className="hero__id">
          <h1 className="name" id="name"><span>Animesh</span><span className="outline">Basak<a className="mark" href="#briefing" aria-label="Jump to the role this page answered">*</a></span></h1>
          <p className="lede">Lead Frontend Engineer at Airtel, open to roles in Delhi NCR.</p>
          <div className="actions">
            <a className="btn btn--quiet" href="/resume-public.pdf" target="_blank" rel="noopener noreferrer">Download résumé</a>
            <button className="textlink" type="button" hidden={!ready} onClick={() => route('project')}>Plan a project</button>
          </div>
        </div>

        <form className="ask" id="paarth" noValidate onSubmit={submit}>
          <label htmlFor="q">Paste a role. I’ll answer it from my work.</label>
          <textarea id="q" name="q" ref={box} rows={5} spellCheck={false} value={query} placeholder={placeholder}
            aria-describedby="q-help q-status" aria-invalid={invalid || undefined}
            onChange={(e) => { setQuery(e.target.value); if (e.target.value.trim()) setInvalid(false) }}/>
          <p className="ask__help" id="q-help">PAARTH reads only this page and my résumé.</p>
          <div className="ask__row">
            <button className="btn" type="submit">Match it to my work</button>
            <button className="textlink" type="button" hidden={!ready} onClick={() => { setQuery(''); setStatus('empty'); box.current?.focus() }}>Clear the box</button>
          </div>
          <p className="ask__status" id="q-status" aria-live="polite">
            {status === 'empty' ? (invalid ? 'Paste a job description or a project brief first.' : '')
              : <a href="#briefing">{status === 'matched' ? `${brief.rows.length} things matched. Read the answers.` : status === 'route' ? 'Read the answers.' : 'Answered below.'}</a>}
          </p>
        </form>
      </section>

      <section className="container brief" id="briefing" ref={section} aria-labelledby="brief-title" tabIndex={-1}>
        <div className="brief__head">
          <h2 id="brief-title"><span className="mark" aria-hidden="true">*</span>{brief.title}</h2>
          <dl className="tally">{tally.map(([label, n]) => <div key={label}><dt>{label}</dt><dd>{n}</dd></div>)}</dl>
        </div>
        <ol className="lines" key={`a${run}`}>
          {brief.rows.length ? brief.rows.slice(0, SHOWN).map((r, i) => <Line key={i} row={r} i={i}/>)
            : <li className="line"><p className="line__ask">Nothing in that text matched his work or a known gap. Try pasting the requirements.</p></li>}
        </ol>
        <div className="brief__foot">
          {brief.rows.length > SHOWN && <details className="more" open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
            <summary>All {brief.rows.length} lines</summary>
            {open && <ol className="lines">{brief.rows.slice(SHOWN).map((r, i) => <Line key={i} row={r} i={i}/>)}</ol>}
          </details>}
          <button className="textlink" type="button" hidden={!ready} onClick={share}>Share it</button>
          <a className="textlink" href="#work-paarth">PAARTH’s plan</a>
          <button className="textlink" type="button" hidden={!ready} onClick={() => route('engineer')}>For engineers</button>
          <p className="brief__key"><span className="mark" aria-hidden="true">*</span> marks the work these answers cite</p>
          <p className="ask__status" aria-live="polite">{shareNote}</p>
        </div>
      </section>

      <section className="container section" id="work" aria-labelledby="work-title">
        <h2 id="work-title" data-cited={c('#work')}>What I build outside Airtel</h2>
        <div className="work">
          <article className="work__paarth" id="work-paarth" data-cited={c('#work-paarth')}>
            <div className="work__text">
              <h3>PAARTH, my agent</h3>
              <p>Routes AI coding work, keeps memory, checks actions first. A small build planned your briefing.</p>
            </div>
            <figure className="run" aria-labelledby="run-cap">
              <ol>{brief.run.map((s, i) => <li key={`${run}-${i}`}><span className="run__n">{i}</span><code>{s.tool}</code><span className="run__dep">{s.dep}</span><span>{s.result}</span></li>)}</ol>
              <figcaption id="run-cap">{brief.caption}</figcaption>
            </figure>
          </article>
          <article className="work__trinetra" id="work-trinetra" data-cited={c('#work-trinetra')}>
            <div className="work__text">
              <h3>Trinetra</h3>
              <p className="work__status">Open source, in daily use</p>
              <p>Keeps my Mac awake, lid shut, only while AI agents work.</p>
              <p><a href="https://github.com/animeshbasak/trinetra" target="_blank" rel="noopener noreferrer">On GitHub</a></p>
            </div>
          </article>
          <article className="work__lakshya" id="work-lakshya">
            <figure><img src="/work/lakshya-teaser.webp" width={332} height={312} alt="Lakshya Hub scoring a résumé against a role: 67 out of 100, with keyword, structure and baseline scores." loading="lazy"/></figure>
            <div className="work__text">
              <h3>Lakshya Hub</h3>
              <p className="work__status">In development</p>
              <p>Paste a job. See your fit score, the gaps and the fixes before you apply.</p>
              <p><a href="mailto:animeshsbasak@gmail.com?subject=Lakshya%20Hub%20early%20access">Get early access</a></p>
            </div>
          </article>
          <article className="work__next" id="work-insanefit">
            <h3>insaneFit</h3>
            <p className="work__status">In design</p>
            <p>An iPhone app for training, food and progress.</p>
          </article>
        </div>
      </section>

      <section className="container section airtel" id="airtel" aria-labelledby="airtel-title">
        <div className="airtel__head">
          <div>
            <h2 id="airtel-title" data-cited={c('#airtel')}>Self-KYC at Airtel, rebuilt</h2>
            <p className="section__lede">I lead a squad of 5 to 7, owning architecture, release standards and the final production review.</p>
          </div>
          <p className="airtel__scale"><b>150M+</b><span>monthly users of the Airtel Thanks app</span></p>
        </div>
        <table className="case">
          <thead><tr><th scope="col">Project</th><th scope="col">What I did</th><th scope="col">Status</th></tr></thead>
          <tbody>
            <tr id="case-gen4" data-cited={c('#case-gen4')}><td>Self-KYC revamp, Gen4</td><td>Schema-driven UI catalog and BFF scripts</td><td>Phase 1 live</td></tr>
            <tr id="case-chat" data-cited={c('#case-chat')}><td>Conversational Self-KYC</td><td>KYC forms as a chat in React Native</td><td>Built</td></tr>
            <tr id="case-sim" data-cited={c('#case-sim')}><td>Prepaid SIM Self-KYC</td><td>The flow from purchase to activation</td><td>Shipped</td></tr>
            <tr id="case-address"><td>In-flight address change</td><td>Fix an address instead of cancelling</td><td>Built</td></tr>
            <tr id="case-wallet"><td>Advance wallet</td><td>Gauge widget, BFF mapping, error states</td><td>Ready to ship</td></tr>
          </tbody>
        </table>
      </section>

      <section className="container section" id="experience" aria-labelledby="exp-title">
        <h2 id="exp-title" data-cited={c('#experience')}>Since 2018, five teams</h2>
        <ol className="record">
          <li id="exp-airtel" className="record__early" data-cited={c('#exp-airtel')}>
            <div className="record__who"><b>Airtel Digital</b><span>Lead Engineer, 2025 to now</span></div>
            <p>Leads prepaid, postpaid, Airtel One, Black and Self-KYC journeys. <a href="#airtel">The case is above.</a></p>
          </li>
          <li id="exp-mmt" data-cited={c('#exp-mmt')}>
            <div className="record__who"><b>MakeMyTrip</b><span>Senior Software Engineer II, 2024 to 2025</span></div>
            <ul>
              <li><b>6 to 8-9</b><span>Lighthouse on the hotels PWA, 5M+ monthly sessions</span></li>
              <li><b>48 hours</b><span>to fix a defect behind 1,000+ Sentry errors</span></li>
              <li><b>30%</b><span>faster onboarding from reusable components, 90%+ coverage</span></li>
            </ul>
          </li>
          <li id="exp-paytm" data-cited={c('#exp-paytm')}>
            <div className="record__who"><b>Paytm</b><span>Software Engineer, 2021 to 2024</span></div>
            <ul>
              <li><b>3M+</b><span>merchants moved off legacy workflows to React</span></li>
              <li><b>+40%</b><span>EDC sales, helped by my Soundbox checkout work</span></li>
              <li><b>10 to 15%</b><span>merchant engagement from my analytics dashboards</span></li>
            </ul>
          </li>
          <li id="exp-sparklin" className="record__early">
            <div className="record__who"><b>Sparklin</b><span>Frontend Developer, 2021</span></div>
            <p>Angular modules for ICICI internet banking</p>
          </li>
          <li id="exp-infosys" className="record__early" data-cited={c('#exp-infosys')}>
            <div className="record__who"><b>Infosys</b><span>Systems Engineer, 2018 to 2021</span></div>
            <p>React and Angular modules for ANZ Bank</p>
          </li>
        </ol>
      </section>

      <section className="container close" id="close" aria-labelledby="close-title">
        <h2 id="close-title" data-cited={c('#close')}>Send me the role you pasted</h2>
        <div className="close__body">
          <p>Open to Lead, Staff and Senior Frontend roles in Delhi NCR. Part-time freelance too, 10 to 12 hours a week after office hours IST.</p>
          <div className="actions">
            <a className="btn" href={mail}>Email me</a>
            <a className="btn btn--quiet" href="https://www.linkedin.com/in/animeshbasak" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="btn btn--quiet" href="https://github.com/animeshbasak" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </section>
    </div>

    <footer className="container footer" id="built" data-cited={c('#built')}><span>Animesh Basak, New Delhi</span><span>Built with Next.js and React</span></footer>
  </div>
}

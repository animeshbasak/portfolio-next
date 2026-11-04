'use client'
import Link from 'next/link'
import ContextStage from './ContextStage'
import LegacyName from './LegacyName'
import {useEffect,useRef,useState} from 'react'

type Reply={answer:string;sources:{label:string;href:string}[];suggestions:string[];mode:'local-ai'|'curated';topic:string}
type Turn=Reply&{question:string;id:number}
const starters=[
 {label:'The engineer',question:'Give me a quick introduction to Animesh and his experience.'},
 {label:'The work',question:'What has Animesh built?'},
 {label:'The experience',question:'Where has Animesh worked?'},
 {label:'The way I think',question:'How does Animesh work?'},
]
function Arrow({diagonal=false}:{diagonal?:boolean}){return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">{diagonal?<path d="M6 18 18 6M6 6h12v12"/>:<path d="M12 19V5m-6 6 6-6 6 6"/>}</svg>}
export default function PersonalPortfolio(){
 const [question,setQuestion]=useState(''),[turns,setTurns]=useState<Turn[]>([]),[busy,setBusy]=useState(false),[pendingQuestion,setPendingQuestion]=useState(''),[error,setError]=useState(''),[ready,setReady]=useState(false),[copied,setCopied]=useState<number|null>(null)
 const request=useRef<AbortController|null>(null),input=useRef<HTMLTextAreaElement>(null),latest=useRef<HTMLElement>(null),feed=useRef<HTMLDivElement>(null),conversation=useRef<HTMLElement>(null),restoreKeyboardFocus=useRef(false),sequence=useRef(0)
 useEffect(()=>{setReady(true);return()=>request.current?.abort()},[])
 useEffect(()=>{
  if(!latest.current||!feed.current)return
  const top=latest.current.getBoundingClientRect().top-feed.current.getBoundingClientRect().top+feed.current.scrollTop
  feed.current.scrollTo({top:Math.max(0,top-14),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})
  if(restoreKeyboardFocus.current&&(document.activeElement===document.body||document.activeElement===input.current||(document.activeElement instanceof HTMLButtonElement&&document.activeElement.disabled)))input.current?.focus({preventScroll:true})
 },[turns.at(-1)?.id])
 async function ask(text:string){
  const clean=text.trim();if(!clean||busy||clean.length>1200)return
  restoreKeyboardFocus.current=document.activeElement?.matches(':focus-visible')??false
  const panel=conversation.current?.getBoundingClientRect()
  if(panel&&(panel.bottom<0||panel.top>window.innerHeight))conversation.current?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})
  request.current?.abort();const controller=new AbortController();request.current=controller
  const timer=window.setTimeout(()=>controller.abort('timeout'),32000)
  setBusy(true);setError('');setPendingQuestion(clean)
  try{
   const history=turns.slice(-3).flatMap(turn=>[{role:'user',content:turn.question},{role:'assistant',content:turn.answer.slice(0,1200)}])
   const response=await fetch('/api/assistant',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:clean,history}),signal:controller.signal})
   if(!response.ok)throw new Error(response.status===429?'The assistant is busy. Give it a moment, then try again.':'The assistant couldn’t answer just now. Try again, or explore the work below.')
   const result=await response.json() as Reply
   if(typeof result.answer!=='string'||typeof result.topic!=='string'||!Array.isArray(result.sources)||!Array.isArray(result.suggestions))throw new Error('The response was incomplete. Please try again.')
   if(controller.signal.aborted)return
   setTurns(previous=>[...previous,{...result,question:clean,id:++sequence.current}].slice(-12));setQuestion('');setCopied(null)
  }catch(cause){
   if(!controller.signal.aborted)setError(cause instanceof TypeError?'Couldn’t connect. Your question is still here. Try again when you’re online.':cause instanceof Error?cause.message:'Couldn’t connect. Your question is still here; please try again.')
   else if(controller.signal.reason==='timeout')setError('That took too long. Your question is still here; please try again.')
   if(controller.signal.reason!=='cleared')setQuestion(clean)
  }finally{clearTimeout(timer);if(request.current===controller){setBusy(false);setPendingQuestion('');request.current=null}}
 }
 function clear(revealIntro=false){request.current?.abort('cleared');request.current=null;setBusy(false);setPendingQuestion('');setTurns([]);setError('');setQuestion('');setCopied(null);input.current?.focus({preventScroll:true});if(revealIntro)window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
 async function copy(turn:Turn){try{await navigator.clipboard.writeText(`${turn.answer}\n\n${turn.sources.map(source=>`${source.label}: ${new URL(source.href,location.origin).href}`).join('\n')}`);setCopied(turn.id)}catch{setError('Copy isn’t available here. You can select the answer text instead.')}}
 const activeTurn=turns.at(-1)
 return <div className="personal-home">
  <div className="personal-index"><span>Independent mind. Connected thinking.</span><span>New Delhi, India <i aria-hidden="true">↗</i></span></div>
  <div className={`personal-stage ${activeTurn?'is-exploring':''}`}>
   <section className="identity-stage" id="portfolio-evidence" aria-label={activeTurn?'Portfolio evidence':'Introduction'}>
    <div className="stage-caption"><span><i aria-hidden="true"/> {activeTurn?'ANIMESH BASAK / IN FOCUS':'ENGINEER / BUILDER / ALWAYS CURIOUS'}</span>{activeTurn&&<button onClick={()=>clear(true)}>Back to the beginning ↖</button>}</div>
    <LegacyName hidden={Boolean(activeTurn)}/>
    {activeTurn?<ContextStage topic={activeTurn.topic} onAsk={text=>void ask(text)} busy={busy}/>:<>
     <div className="identity-description"><p>I turn complex problems<br/>into things that <em>just work.</em></p><span>Lead Engineer at Airtel Digital.<br/>Frontend, backend &amp; native journeys.<br/>A restless curiosity for what comes next.</span></div>
     <div className="identity-actions"><Link href="/work">Explore the work <Arrow diagonal/></Link><a href="/resume-public.pdf" target="_blank" rel="noopener noreferrer">Read my résumé <span aria-hidden="true">↗</span></a></div>
     <div className="identity-footnote"><span>Engineering since <b>2018</b></span><span>Ideas → Systems → Experiences</span></div>
    </>}
   </section>
   <section className="personal-conversation" ref={conversation} aria-labelledby="conversation-title">
    <div className="conversation-heading"><span className="assistant-symbol" aria-hidden="true">✳</span><div><h2 id="conversation-title">Animesh, in context.</h2><p>A personal AI guide to my work</p></div><span className="conversation-status" aria-label="Public portfolio knowledge"><i/>PUBLIC NOTES</span></div>
    <div className="conversation-feed" ref={feed}>
     {!activeTurn&&!busy&&<div className="conversation-welcome"><span className="panel-index">A DIFFERENT WAY IN</span><h3>Follow your<br/><em>curiosity.</em></h3><p>Ask about what I build, how I think, or where I’ve been. The portfolio unfolds around your question.</p><div className="welcome-rule" aria-hidden="true"><span/><i>↙</i></div></div>}
     {activeTurn&&<div className="conversation-toolbar"><span>Your conversation</span><button onClick={()=>clear()}>Start fresh ↺</button></div>}
     <div className="conversation-turns" aria-live="polite" aria-relevant="additions">{turns.map((turn,index)=><article className="conversation-turn" key={turn.id} ref={index===turns.length-1?latest:null}>
      <div className="visitor-question"><span>You</span><h3>{turn.question}</h3></div>
      <div className="personal-answer"><div className="answer-identity"><span className="answer-mark" aria-hidden="true">AB</span><span>Portfolio guide<small>{turn.mode==='local-ai'?'Local AI · public sources':'From the portfolio notes'}</small></span></div><div className="answer-text">{turn.answer.split(/\n\s*\n/).map((paragraph,i)=><p key={i}>{paragraph}</p>)}</div>{turn.sources.length>0&&<nav className="answer-sources" aria-label="Sources for this answer">{turn.sources.map(source=><a key={source.href+source.label} href={source.href} target="_blank" rel="noopener noreferrer" aria-label={`${source.label} (opens in a new tab)`}>{source.label} <span aria-hidden="true">↗</span></a>)}</nav>}<button className="answer-copy" onClick={()=>void copy(turn)}>{copied===turn.id?'Copied with sources':'Copy answer'}</button></div>
     </article>)}</div>
     {busy&&<div className="assistant-working" role="status"><span className="working-dot" aria-hidden="true"/><span>Finding the connections…<small>{pendingQuestion}</small></span><button onClick={()=>request.current?.abort('cancelled')}>Stop</button></div>}
    </div>
    <div className="conversation-controls">
     {activeTurn&&<a className="mobile-context-link" href="#portfolio-evidence">See the related portfolio notes ↑</a>}
     <div className={activeTurn?'personal-followups':'personal-starters'} aria-label="Suggested questions">{(activeTurn?activeTurn.suggestions.map(text=>({label:text,question:text})):starters).map((starter,i)=><button key={starter.question} disabled={!ready||busy} onClick={()=>void ask(starter.question)}>{!activeTurn&&<span className="starter-number" aria-hidden="true">0{i+1}</span>}<span>{starter.label}</span><span className="starter-arrow" aria-hidden="true">↗</span></button>)}</div>
     <form className="personal-composer" onSubmit={event=>{event.preventDefault();void ask(question)}}><label className="composer-label" htmlFor="personal-question">{activeTurn?'Ask a follow-up question':'Ask about Animesh’s work'}</label><textarea ref={input} id="personal-question" value={question} onChange={event=>{setQuestion(event.target.value);setError('')}} placeholder={activeTurn?'Go a little deeper…':'What would you like to know?'} maxLength={1200} rows={2} disabled={!ready||busy} aria-describedby="assistant-privacy assistant-error" onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.nativeEvent.isComposing){event.preventDefault();void ask(question)}}}/><button type="submit" className="composer-send" disabled={!ready||busy||!question.trim()} aria-label="Send question"><Arrow/></button></form>
     <p id="assistant-error" className="assistant-error" role="alert">{error}</p>
     <p className="assistant-privacy" id="assistant-privacy">Public knowledge. No saved conversations.<span>AI can make mistakes. Check the sources.</span></p><noscript><p className="assistant-error">The conversation needs JavaScript. Work, career and résumé links still work.</p></noscript>
    </div>
   </section>
  </div>
  <section className="personal-experience" aria-label="Career at a glance"><p>THE ROAD SO FAR</p><div><span>Infosys</span><i aria-hidden="true">↗</i><span>Sparklin</span><i aria-hidden="true">↗</i><span>Paytm</span><i aria-hidden="true">↗</i><span>MakeMyTrip</span><i aria-hidden="true">↗</i><span>Airtel Digital</span></div><Link href="/profile">Explore the journey ↗</Link></section>
  <section className="personal-selected" aria-labelledby="selected-title"><div className="selected-heading"><div><p className="personal-section-label">OUTSIDE THE DAY JOB / INDEPENDENT WORK</p><h2 id="selected-title">Always building.</h2></div><Link href="/work">The full collection ↗</Link></div><div className="selected-grid">
   <article className="selected-project"><span className="project-number">01</span><div><p className="project-category">DEVELOPER TOOLS / OPEN SOURCE</p><h3><Link href="/work/paarth">PAARTH <Arrow diagonal/></Link></h3><p>Giving AI workflows memory, direction and a human in control.</p><button disabled={!ready||busy} onClick={()=>{void ask('How does PAARTH work?')}}>Explore with AI <span aria-hidden="true">↗</span></button></div></article>
   <article className="selected-project"><span className="project-number">02</span><div><p className="project-category">CAREER TOOLS / IN DEVELOPMENT</p><h3><Link href="/work/lakshya">Lakshya Hub <Arrow diagonal/></Link></h3><p>Connecting the scattered pieces of a job search into one workflow.</p><button disabled={!ready||busy} onClick={()=>{void ask('Tell me about Lakshya')}}>Explore with AI <span aria-hidden="true">↗</span></button></div></article>
  </div></section>
  <section className="personal-invitation"><p>HAVE SOMETHING WORTH BUILDING?</p><a href="mailto:animeshsbasak@gmail.com">Let’s make it real.<Arrow diagonal/></a></section>
 </div>
}

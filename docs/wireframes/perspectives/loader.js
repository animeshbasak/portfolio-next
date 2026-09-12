import {recordStack} from './identity.js';
// An opening sequence, with content readiness reported independently.
export function createOpening(){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),main=document.querySelector('#app');
 const el=document.createElement('section');el.className='opening';el.hidden=true;el.setAttribute('aria-label','Animesh Basak portfolio opening');
 el.innerHTML=`<header class="opening-head"><span class="wordmark">ANIMESH BASAK /</span><span class="micro">THE WORKING RECORD · 2018 — PRESENT</span></header><div class="opening-composition"><div class="opening-type"><span class="micro accent">ENGINEER & INDEPENDENT BUILDER</span><h1>Behind the work,<br><em>a way of thinking.</em></h1><p>Frontend systems. Independent tools.<br>A career built through both.</p></div><div class="opening-record">${recordStack()}</div></div><footer class="opening-bottom"><span data-phase>01 / The foundations</span><div class="opening-actions"><span class="opening-ready" role="status">Loading portfolio content</span><button class="opening-skip" disabled>Enter portfolio ↗</button></div></footer>`;
 document.body.append(el);
 const phase=el.querySelector('[data-phase]'),status=el.querySelector('[role=status]'),skip=el.querySelector('button');
 let ready=false,failed=false,active=false,start=0,raf=0,timer=0,returnFocus=null;
 function hide(){if(!ready||failed||!active)return;active=false;cancelAnimationFrame(raf);clearTimeout(timer);el.classList.add('out');timer=setTimeout(()=>{el.hidden=true;main.inert=false;document.body.classList.remove('is-opening');if(returnFocus?.isConnected)returnFocus.focus();else document.querySelector('#page')?.focus({preventScroll:true})},reduce.matches?0:500)}
 function frame(now){if(!active)return;const t=(now-start)/1000;const stage=Math.min(2,Math.floor(t/.95));el.dataset.stage=String(stage);phase.textContent=['01 / The foundations','02 / The independent work','03 / Your perspective'][stage];if(t>=2.85&&ready){hide();return}if(!document.hidden)raf=requestAnimationFrame(frame)}
 function play(){if(failed)return;clearTimeout(timer);cancelAnimationFrame(raf);returnFocus=document.activeElement?.closest('.opening-replay');active=true;el.hidden=false;el.classList.remove('out');el.dataset.stage='0';main.inert=true;document.body.classList.add('is-opening');start=performance.now();skip.disabled=!ready;status.textContent=ready?'Portfolio ready':'Loading portfolio content';if(reduce.matches){if(ready)hide()}else raf=requestAnimationFrame(frame);if(ready)skip.focus({preventScroll:true})}
 skip.addEventListener('click',hide);
 reduce.addEventListener('change',()=>{if(active){cancelAnimationFrame(raf);if(reduce.matches&&ready)hide();else if(!reduce.matches)raf=requestAnimationFrame(frame)}});
 document.addEventListener('visibilitychange',()=>{if(active&&!document.hidden&&!reduce.matches){cancelAnimationFrame(raf);raf=requestAnimationFrame(frame)}});
 addEventListener('hashchange',()=>{if(active&&ready)hide()});
 return {play,ready(){ready=true;skip.disabled=false;status.textContent='Portfolio ready';if(active){skip.focus({preventScroll:true});if(reduce.matches)hide()}},fail(){failed=true;active=false;cancelAnimationFrame(raf);phase.textContent='Content could not load';status.innerHTML='<a href="design.md">Read the design or refresh to try again ↗</a>';skip.hidden=true;main.inert=false;el.querySelector('a')?.focus()}};
}

const $=s=>document.querySelector(s),reduce=matchMedia('(prefers-reduced-motion: reduce)');let shapeMix=0,shapeTarget=0;let motionPaused=false;let layer=0,spread=0,target=0,until=performance.now()+4500,path='engineering';const visited=new Set();const copy=[['Make AI workflows more deliberate.','PAARTH brings skill routing, memory, action checks and cost controls around existing AI coding tools. The intent is to make useful working practices reusable.'],['Keep the workflow inspectable.','Local files and explicit instructions provide context around the tools already in use. Routing, memory and checks become parts of a workflow that can be read and adjusted.'],['Keep human judgement in the loop.','Reusable instructions and checks can support a coding workflow. They do not guarantee correct output. Validation, review and the decision to ship still matter.']];
function pick(n){layer=n;target=n*.55;until=performance.now()+1600;$('#layer-copy').innerHTML=`<h3>${copy[n][0]}</h3><p>${copy[n][1]}</p>`;$('#visual-label').textContent=['ONE IDEA / THREE LAYERS','THE APPROACH / OPENED','THE TRADE-OFF / IN FOCUS'][n];$('#advance').textContent=n===2?'Return to purpose ↶':'Open the next layer ↗';document.querySelectorAll('[data-layer]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.layer===n));visited.add(copy[n][0]);draw(performance.now())}
document.querySelectorAll('[data-layer]').forEach(b=>b.onclick=()=>pick(+b.dataset.layer));$('#advance').onclick=()=>pick((layer+1)%3);
function perspective(p,enter){path=p;$('#path-label').textContent='YOUR PERSPECTIVE / '+p.toUpperCase();const titles={engineering:'A career built<br><em>one decision at a time.</em>',hiring:'Experience that grows<br><em>with responsibility.</em>',ai:'Grounded in engineering.<br><em>Curious about what’s next.</em>'};$('#career h2').innerHTML=titles[p];$('#guide-panel').hidden=true;$('#guide').setAttribute('aria-expanded','false');if(enter)$(p==='ai'?'#work':'#career').scrollIntoView();else $('#guide').focus();}
document.querySelectorAll('[data-path]').forEach(b=>b.onclick=()=>perspective(b.dataset.path,!!b.closest('.choices')));$('#guide').onclick=()=>{const open=$('#guide-panel').hidden;$('#guide-panel').hidden=!open;$('#guide').setAttribute('aria-expanded',open);if(open)$('#close').focus()};function close(){$('#guide-panel').hidden=true;$('#guide').setAttribute('aria-expanded','false');$('#guide').focus()}$('#close').onclick=close;document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
const canvases=['form'].map(id=>{const el=document.getElementById(id);return{el,ctx:el.getContext('2d')}});function draw(t){shapeMix=reduce.matches?shapeTarget:shapeMix+(shapeTarget-shapeMix)*.045;spread=reduce.matches?target:spread+(target-spread)*.09;canvases.forEach(({el,ctx},index)=>{const b=el.getBoundingClientRect(),w=b.width,h=b.height,d=Math.min(devicePixelRatio||1,2);if(el.width!==Math.round(w*d)||el.height!==Math.round(h*d)){el.width=Math.round(w*d);el.height=Math.round(h*d)}ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);let time=(reduce.matches||motionPaused)?1:t*.00009,r=Math.min(w,h)*.28*(1+.045*Math.sin(time*1.7));ctx.globalCompositeOperation='lighter';for(let j=0;j<54;j++){let u=j/54,band=Math.floor(j/18)-1;ctx.beginPath();for(let k=0;k<=180;k++){let a=k/180*Math.PI*2,warp=1+.07*Math.sin(a*3+u*4+time)+.025*Math.sin(a*2-time*1.3),x=Math.cos(a)*r*warp,y=Math.sin(a)*r*warp*(.45+u*.5+.08*Math.sin(time*.8)),z=Math.sin(a*2+u*3+time)*r*.2,twist=time+u*.8;let px=w/2+x*Math.cos(twist)-y*Math.sin(twist)*.5,py=h/2+x*Math.sin(twist)*.4+y*Math.cos(twist)+z+(index===1?band*spread*65:0);if(index===0){const expand=Math.sin(Math.min(1,shapeMix)*Math.PI)*.35;px+=(px-w/2)*expand;py+=(py-h/2)*expand;const split=Math.max(0,Math.min(1,shapeMix));py+=band*split*r*.65;const reform=Math.max(0,shapeMix-1);const ribbonX=w/2+Math.cos(a+u*2+time)*r*(.55+u*.2);const ribbonY=h/2+Math.sin(a)*r*.5+band*r*.52;px=px*(1-reform)+ribbonX*reform;py=py*(1-reform)+ribbonY*reform;}k?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.closePath();ctx.strokeStyle=`rgba(${110+u*55},${155+u*65},255,${.1+Math.pow(Math.sin(u*Math.PI),6)*.15})`;ctx.lineWidth=.85;ctx.stroke()}ctx.globalCompositeOperation='source-over'})}
pick(0);let last=0;function tick(t){if(!document.hidden&&!reduce.matches&&!motionPaused&&t-last>14){draw(t);paintTrail(t);positionAstral();last=t}requestAnimationFrame(tick)}requestAnimationFrame(tick);window.addEventListener('resize',()=>draw(performance.now()));reduce.addEventListener('change',()=>draw(performance.now()));const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){visited.add(e.target.id==='career'?'Career':'PAARTH');$('#trail').textContent=Array.from(visited).filter(x=>['Career','PAARTH'].includes(x)).join(' → ')||'Your exploration begins here';until=performance.now()+2500}})},{threshold:.2});obs.observe($('#career'));obs.observe($('#work'));

const entranceContent=[...document.querySelectorAll('header,.intro-label,.arrival-copy,.down,#replay,main>section:not(#arrival),footer,#guide,#guide-panel,#motion-control,#astral-context')];
let arrivalStart=0,arrivalFrame=0,arrivalTimer=0;
function finishArrival(){
 const form=$('#form'),before=form.getBoundingClientRect();
 document.body.classList.remove('is-loading');
 entranceContent.forEach(el=>el.inert=false);
 $('#load-count').hidden=true;
 positionAstral();
 if(!reduce.matches)form.animate([{transform:`translate(${before.left}px,${before.top}px) scale(1)`},{transform:form.style.transform}],{duration:950,easing:'cubic-bezier(.22,1,.36,1)'});
 draw(performance.now());
 const title=$('.arrival-copy h1');title.tabIndex=-1;title.focus({preventScroll:true});
}
function arrival(t){
 const progress=Math.min(1,Math.max(0,(t-arrivalStart)/3000));
 const eased=progress*progress*(3-2*progress);
 const n=reduce.matches?100:Math.floor(eased*100);
 $('#load-count').innerHTML=n+'<span>%</span>';
 $('#load-count').setAttribute('aria-valuenow',n);
 if(n<100)arrivalFrame=requestAnimationFrame(arrival);
 else arrivalTimer=setTimeout(finishArrival,reduce.matches?0:350);
}
function startArrival(){
 cancelAnimationFrame(arrivalFrame);clearTimeout(arrivalTimer);
 $('#guide-panel').hidden=true;$('#guide').setAttribute('aria-expanded','false');
 $('#form').style.removeProperty('position');$('#form').style.removeProperty('left');$('#form').style.removeProperty('top');$('#form').style.removeProperty('transform');
 document.body.classList.add('is-loading');entranceContent.forEach(el=>el.inert=true);
 window.scrollTo({top:0,behavior:'instant'});
 $('#load-count').hidden=false;$('#load-count').innerHTML='0<span>%</span>';
 $('#load-count').setAttribute('aria-valuenow','0');
 arrivalStart=performance.now();until=arrivalStart+5000;draw(arrivalStart);
 arrivalFrame=requestAnimationFrame(arrival);
}
$('#replay').onclick=startArrival;startArrival();

const trailCanvas=$('#pointer-trail'),trailContext=trailCanvas.getContext('2d');let trailPoints=[];
function sizeTrail(){const d=Math.min(devicePixelRatio||1,2);trailCanvas.width=Math.round(innerWidth*d);trailCanvas.height=Math.round(innerHeight*d);trailContext.setTransform(d,0,0,d,0,0)}
sizeTrail();window.addEventListener('resize',sizeTrail);
window.addEventListener('pointermove',e=>{if(reduce.matches||motionPaused||document.body.classList.contains('is-loading'))return;trailPoints.push({x:e.clientX,y:e.clientY,t:performance.now()});if(trailPoints.length>70)trailPoints.shift()},{passive:true});
window.addEventListener('pointerdown',e=>{if(!reduce.matches&&!motionPaused&&!document.body.classList.contains('is-loading'))trailPoints.push({x:e.clientX,y:e.clientY,t:performance.now()})},{passive:true});
let cometHead=null,cometTime=0;
function paintTrail(t){
 const c=trailContext;c.clearRect(0,0,innerWidth,innerHeight);
 trailPoints=trailPoints.filter(p=>t-p.t<650);
 if(!trailPoints.length){cometHead=null;cometTime=t;return}
 const aim=trailPoints[trailPoints.length-1],dt=Math.min(50,t-(cometTime||t));cometTime=t;
 if(!cometHead)cometHead={x:aim.x,y:aim.y,history:[]};
 const ease=1-Math.exp(-dt/35);
 cometHead.x+=(aim.x-cometHead.x)*ease;cometHead.y+=(aim.y-cometHead.y)*ease;
 const h=cometHead.history;
 h.push({x:cometHead.x,y:cometHead.y,t});
 while(h.length&&t-h[0].t>380)h.shift();
 const life=Math.max(0,1-(t-aim.t)/650);
 c.globalCompositeOperation='lighter';c.lineCap='round';c.lineJoin='round';
 // Layered, curved strokes taper toward the oldest point; no hard segments.
 for(let pass=0;pass<3;pass++){
  for(let i=1;i<h.length-1;i++){
   const p=h[i],prev=h[i-1],next=h[i+1],u=i/h.length;
   c.beginPath();c.moveTo((prev.x+p.x)/2,(prev.y+p.y)/2);
   c.quadraticCurveTo(p.x,p.y,(p.x+next.x)/2,(p.y+next.y)/2);
   c.lineWidth=(pass===0?12:pass===1?4:1.2)*u;
   c.strokeStyle=`rgba(${pass===2?'225,248,255':'135,188,255'},${life*u*u*(pass===0?.025:pass===1?.1:.5)})`;
   c.stroke();
  }
 }
 const x=cometHead.x,y=cometHead.y;
 const halo=c.createRadialGradient(x,y,0,x,y,18);
 halo.addColorStop(0,`rgba(214,248,255,${life*.7})`);
 halo.addColorStop(.18,`rgba(166,220,255,${life*.28})`);
 halo.addColorStop(1,'rgba(120,180,255,0)');
 c.fillStyle=halo;c.fillRect(x-18,y-18,36,36);
 c.fillStyle=`rgba(245,253,255,${life})`;c.beginPath();c.arc(x,y,1.4,0,Math.PI*2);c.fill();
 c.globalCompositeOperation='source-over';
}
$('#motion-control').onclick=()=>{motionPaused=!motionPaused;$('#motion-control').textContent=motionPaused?'Resume motion':'Pause motion';$('#motion-control').setAttribute('aria-pressed',motionPaused);trailPoints=[];cometHead=null;trailContext.clearRect(0,0,innerWidth,innerHeight)};
reduce.addEventListener('change',()=>{trailPoints=[];cometHead=null;trailContext.clearRect(0,0,innerWidth,innerHeight)});

// Chapter changes reshape the ribbons; no orbiting across the reading area.
function positionAstral(){
 const el=$('#form');
 if(document.body.classList.contains('is-loading')){shapeTarget=0;el.style.removeProperty('transform');return}
 const mobile=innerWidth<=640,w=mobile?300:420,h=mobile?300:360;
 const arrival=$('#arrival').getBoundingClientRect(),career=$('#career').getBoundingClientRect(),work=$('#work').getBoundingClientRect(),next=$('#next').getBoundingClientRect();
 const entered=career.top<innerHeight*.7;
 shapeTarget=next.top<innerHeight*.65?0:work.top<innerHeight*.65?(layer===0?1:layer===1?1.5:2):entered?1:0;
 document.body.classList.toggle('in-story',entered);
 $('#astral-context').textContent=next.top<innerHeight*.65?'CONTINUE THE CONVERSATION':work.top<innerHeight*.65?['PURPOSE / THE INTENT','APPROACH / THE STRUCTURE','TRADE-OFF / THE CHOICE'][layer]:entered?'CAREER / FOLLOW THE THREAD':'YOUR GUIDE';
 const x=entered?(mobile?innerWidth-45:innerWidth*.88):innerWidth/2;
 const cy=entered?(mobile?110:innerHeight*.4):arrival.top+(mobile?45:55)+h/2;
 const scale=entered?(mobile?.34:.85):1;
 el.style.position='fixed';el.style.left='0';el.style.top='0';
 el.style.transform=`translate(${x-w/2}px,${cy-h/2}px) scale(${scale})`;
}
window.addEventListener('scroll',positionAstral,{passive:true});
window.addEventListener('resize',positionAstral);

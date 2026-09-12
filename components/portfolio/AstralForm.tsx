'use client'
import {useEffect,useRef} from 'react'
export default function AstralForm({shape,paused,loading}:{shape:number;paused:boolean;loading:boolean}){
 const canvas=useRef<HTMLCanvasElement>(null),trail=useRef<HTMLCanvasElement>(null)
 const target=useRef(shape);target.current=shape
 const flags=useRef({paused,loading});flags.current={paused,loading}
 const wake=useRef<()=>void>(()=>{})
 useEffect(()=>{
 const el=canvas.current!,tail=trail.current!,ctx=el.getContext('2d'),tc=tail.getContext('2d');if(!ctx||!tc)return
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0,last=0,mix=0,time=0
 let points:{x:number;y:number;t:number}[]=[]
 const pointer=(e:PointerEvent)=>{if(!flags.current.paused&&!reduced.matches&&!flags.current.loading){points.push({x:e.clientX,y:e.clientY,t:performance.now()});points=points.slice(-35)}}
 const draw=(now:number)=>{
 frame=0
 const dt=Math.min(40,now-(last||now));last=now
 if(!document.hidden){
 if(!flags.current.paused&&!reduced.matches)time+=dt*.00009
 mix+=(target.current-mix)*((reduced.matches||flags.current.paused)?1:1-Math.exp(-dt/500))
 const w=420,h=360,d=Math.min(devicePixelRatio||1,2)
 if(el.width!==w*d){el.width=w*d;el.height=h*d}ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='lighter'
 const r=100*(1+.045*Math.sin(time*1.7))
 for(let j=0;j<54;j++){const u=j/54,band=Math.floor(j/18)-1;ctx.beginPath()
 for(let k=0;k<=160;k++){const a=k/160*Math.PI*2,warp=1+.07*Math.sin(a*3+u*4+time)+.025*Math.sin(a*2-time*1.3),x=Math.cos(a)*r*warp,y=Math.sin(a)*r*warp*(.45+u*.5+.08*Math.sin(time*.8)),z=Math.sin(a*2+u*3+time)*r*.2,twist=time+u*.8
 let px=w/2+x*Math.cos(twist)-y*Math.sin(twist)*.5,py=h/2+x*Math.sin(twist)*.4+y*Math.cos(twist)+z
 const expand=Math.sin(Math.min(1,mix)*Math.PI)*.35;px+=(px-w/2)*expand;py+=(py-h/2)*expand;py+=band*Math.min(1,mix)*r*.65
 const reform=Math.max(0,mix-1);px=px*(1-reform)+(w/2+Math.cos(a+u*2+time)*r*(.55+u*.2))*reform;py=py*(1-reform)+(h/2+Math.sin(a)*r*.5+band*r*.52)*reform
 k?ctx.lineTo(px,py):ctx.moveTo(px,py)}
 ctx.closePath();ctx.strokeStyle=`rgba(${110+u*55},${155+u*65},255,${.10+Math.pow(Math.sin(u*Math.PI),6)*.15})`;ctx.lineWidth=.85;ctx.stroke()}
 if(tail.width!==innerWidth*d||tail.height!==innerHeight*d){tail.width=innerWidth*d;tail.height=innerHeight*d}tc.setTransform(d,0,0,d,0,0);tc.clearRect(0,0,innerWidth,innerHeight)
 points=points.filter(p=>now-p.t<420)
 if(points.length&&!flags.current.paused&&!reduced.matches){tc.lineCap='round';for(let i=1;i<points.length;i++){const p=points[i],prev=points[i-1],next=points[Math.min(i+1,points.length-1)],alpha=(1-(now-p.t)/420)*i/points.length;tc.beginPath();tc.moveTo((prev.x+p.x)/2,(prev.y+p.y)/2);tc.quadraticCurveTo(p.x,p.y,(p.x+next.x)/2,(p.y+next.y)/2);tc.strokeStyle=`rgba(175,222,255,${alpha*.45})`;tc.lineWidth=alpha*2;tc.shadowColor='#9bbdff';tc.shadowBlur=10;tc.stroke()}const p=points[points.length-1],life=1-(now-p.t)/420;const glow=tc.createRadialGradient(p.x,p.y,0,p.x,p.y,18);glow.addColorStop(0,`rgba(235,250,255,${life})`);glow.addColorStop(.2,`rgba(155,189,255,${life*.3})`);glow.addColorStop(1,'transparent');tc.fillStyle=glow;tc.fillRect(p.x-18,p.y-18,36,36)}
 }
 if(!document.hidden&&!flags.current.paused&&!reduced.matches)frame=requestAnimationFrame(draw)
 };
 const restart=()=>{cancelAnimationFrame(frame);frame=0;last=0;points=[];if(!document.hidden)frame=requestAnimationFrame(draw)}
 wake.current=restart;restart();document.addEventListener('visibilitychange',restart);window.addEventListener('resize',restart);reduced.addEventListener('change',restart);window.addEventListener('pointermove',pointer,{passive:true});return()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',pointer);document.removeEventListener('visibilitychange',restart);window.removeEventListener('resize',restart);reduced.removeEventListener('change',restart);wake.current=()=>{}}
 },[])
 useEffect(()=>wake.current(),[shape,paused,loading])
 return <><canvas ref={canvas} className="astral-form" aria-hidden="true"/><canvas ref={trail} className="astral-trail" aria-hidden="true"/></>
}

'use client'
import {useEffect,useRef,useState} from 'react'
export default function ProjectLayers({problem,approach,tradeoff}:{problem:string;approach:string;tradeoff:string}){
 const [layer,setLayer]=useState(0),root=useRef<HTMLDivElement>(null)
 const copy=[problem,approach,tradeoff],labels=['Purpose','Approach','Trade-off']
 useEffect(()=>{const elements=root.current?.querySelectorAll('[data-project-layer]');if(!elements)return;const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){const n=Number(entry.target.getAttribute('data-project-layer'));setLayer(n);window.dispatchEvent(new CustomEvent('astral-layer',{detail:n}))}},{rootMargin:'-20% 0px -45% 0px'});elements.forEach(el=>observer.observe(el));return()=>observer.disconnect()},[])
 return <div ref={root} className="astral-inspection"><nav aria-label="Explore project layers">{labels.map((label,i)=><a href={`#project-layer-${i}`} key={label} aria-current={layer===i?'step':undefined}>{String(i+1).padStart(2,'0')} / {label}</a>)}</nav>{copy.map((text,i)=><section id={`project-layer-${i}`} data-project-layer={i} key={labels[i]}><p className="folio-eyebrow">{labels[i]} / Layer 0{i+1}</p><h2>{['What makes it worth building?','How the pieces work together.','Where the boundary belongs.'][i]}</h2><p>{text}</p></section>)}</div>
}

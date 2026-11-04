'use client'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {createContext,useContext} from 'react'
import type {CSSProperties} from 'react'
import type {Perspective} from '../../lib/portfolio/perspectives'
import '../personal/personal.css'
import '../personal/personal-theme.css'
import '../personal/theme-content.css'
import '../folio/chrome.css'
import {PortfolioTheme,ThemeControl} from '../personal/PortfolioTheme'
import {PortfolioMotion,MotionControl} from '../personal/PortfolioMotion'
// Keep the archived story's interface without loading its renderer.
const Context=createContext({perspective:'engineering' as Perspective,choose:(_p:Perspective)=>{},openGuide:()=>{}})
export const useAstral=()=>useContext(Context)

const nav=[['/work','Work'],['/profile','About'],['/blog','Notes']] as const

export default function Shell({children,identityFont='Impact, sans-serif',detailFont='monospace'}:{children:React.ReactNode;identityFont?:string;detailFont?:string}){
 const pathname=usePathname()
 const home=pathname==='/'
 return <PortfolioTheme><div className="folio personal" style={{'--identity-font':identityFont,'--detail-font':detailFont} as CSSProperties} data-page={pathname==='/'?'home':'inner'}>
 <PortfolioMotion atmosphere={!home}>
 <a href="#main-content" className="fx-skip">Skip to content</a>
 {!home&&<header className="fx-header">
  <Link href="/" className="fx-wordmark" aria-label="Animesh Basak, home">AB<span aria-hidden="true">.</span></Link>
  <nav aria-label="Main navigation" className="fx-nav">
   {nav.map(([href,label])=><Link key={href} href={href} aria-current={pathname.startsWith(href)?'page':undefined}>{label}</Link>)}
   <a href="/resume-public.pdf" target="_blank" rel="noopener noreferrer">Résumé</a>
  </nav>
  <div className="fx-controls"><ThemeControl/><MotionControl/></div>
  <a href="mailto:animeshsbasak@gmail.com" className="fx-btn fx-btn-primary fx-header-cta">Let’s talk</a>
 </header>}
 <main id="main-content" className="folio-main" tabIndex={-1}>{children}</main>
 {!home&&<footer className="fx-footer">
  <p className="fx-footer-name">Animesh Basak</p>
  <p className="fx-footer-place">Lead Frontend Engineer, New Delhi</p>
  <nav aria-label="Footer navigation" className="fx-footer-nav">
   <a href="https://github.com/animeshbasak" target="_blank" rel="noopener noreferrer">GitHub</a>
   <a href="https://www.linkedin.com/in/animeshbasak" target="_blank" rel="noopener noreferrer">LinkedIn</a>
   <a href="https://x.com/animeshsbasak" target="_blank" rel="noopener noreferrer">X</a>
   <a href="/resume-public.pdf" target="_blank" rel="noopener noreferrer">Résumé</a>
  </nav>
 </footer>}
 </PortfolioMotion>
 </div></PortfolioTheme>
}

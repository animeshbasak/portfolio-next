'use client'

import {createContext, useContext, useEffect, useState} from 'react'
import LegacyAtmosphere from './LegacyAtmosphere'
import {usePortfolioTheme} from './PortfolioTheme'

const MotionContext = createContext({ready: false, paused: false, reducedMotion: true, toggle: () => {}})
export const usePortfolioMotion = () => useContext(MotionContext)
const PAUSE_KEY = 'personal-motion-paused'

export function PortfolioMotion({children, atmosphere = true}: {children: React.ReactNode; atmosphere?: boolean}) {
  const {theme} = usePortfolioTheme()
  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(true)

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(preference.matches)
    update()
    try { setPaused(sessionStorage.getItem(PAUSE_KEY) === 'true') } catch { /* Storage is optional. */ }
    setReady(true)
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  function toggle() {
    setPaused(previous => {
      const next = !previous
      try { sessionStorage.setItem(PAUSE_KEY, String(next)) } catch { /* Keep the in-memory preference. */ }
      return next
    })
  }

  return <MotionContext.Provider value={{ready, paused, reducedMotion, toggle}}>
    {atmosphere && <LegacyAtmosphere paused={!ready || paused} reducedMotion={reducedMotion} dark={theme==='dark'}/>}
    {children}

  </MotionContext.Provider>
}


export function MotionControl() {
  const {ready, paused, reducedMotion, toggle} = usePortfolioMotion()
  return <button className="personal-motion-control" onClick={toggle} disabled={!ready || reducedMotion}
      aria-label={reducedMotion ? 'Motion off: reduced motion preference' : paused ? 'Resume background motion' : 'Pause background motion'}>
      <span aria-hidden="true">{paused || reducedMotion ? '▷' : 'Ⅱ'}</span>
      <span>{reducedMotion ? 'Motion off' : paused ? 'Resume motion' : 'Pause motion'}</span>
    </button>
}

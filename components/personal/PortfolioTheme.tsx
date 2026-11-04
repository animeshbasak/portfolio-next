'use client'

import {createContext, useContext, useEffect, useRef, useState} from 'react'
import {resolveTheme, THEME_KEY, type PortfolioThemeName} from '../../lib/personal/theme'

const ThemeContext = createContext({theme: 'light' as PortfolioThemeName, ready: false, toggle: () => {}})
export const usePortfolioTheme = () => useContext(ThemeContext)

export function PortfolioTheme({children}: {children: React.ReactNode}) {
  const [theme, setTheme] = useState<PortfolioThemeName>('light')
  const [ready, setReady] = useState(false)
  const explicit = useRef<PortfolioThemeName | null>(null)

  useEffect(() => {
    const system = matchMedia('(prefers-color-scheme: dark)')
    let saved: string | null = null
    try { saved = localStorage.getItem(THEME_KEY) } catch { /* Use system settings if storage is blocked. */ }
    explicit.current = saved === 'light' || saved === 'dark' ? saved : null
    const apply = () => {
      const next = resolveTheme(explicit.current, system.matches)
      document.documentElement.setAttribute('data-portfolio-theme', next)
      setTheme(next)
    }
    const syncStorage = (event: StorageEvent) => {
      if (event.key !== THEME_KEY && event.key !== null) return
      explicit.current = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null
      apply()
    }
    apply()
    setReady(true)
    system.addEventListener('change', apply)
    window.addEventListener('storage', syncStorage)
    return () => {
      system.removeEventListener('change', apply)
      window.removeEventListener('storage', syncStorage)
    }
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    explicit.current = next
    document.documentElement.setAttribute('data-portfolio-theme', next)
    setTheme(next)
    try { localStorage.setItem(THEME_KEY, next) } catch { /* The choice still works for this visit. */ }
  }

  return <ThemeContext.Provider value={{theme, ready, toggle}}>{children}</ThemeContext.Provider>
}

export function ThemeControl() {
  const {theme, ready, toggle} = usePortfolioTheme()
  return <button className="personal-theme-control" onClick={toggle} disabled={!ready}
    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      {theme === 'dark' ? <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></> : <path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z"/>}
    </svg>
    <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
  </button>
}

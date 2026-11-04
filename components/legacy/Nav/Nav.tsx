'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { THEME_KEY } from '../../../lib/personal/theme'
import styles from './Nav.module.css'

const NAV_ITEMS = [
  { href: '/#about', label: 'Dossier' },
  { href: '/#timeline', label: 'Log' },
  { href: '/#projects', label: 'Lab' },
  { href: '/#skills', label: 'Stack' },
  { href: '/#blog', label: 'Transmissions' },
  { href: '/#contact', label: 'Signal' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const pathname = usePathname()

  // The root layout sets data-portfolio-theme before paint (saved choice, else the system setting).
  useEffect(() => {
    const root = document.documentElement
    const sync = () => setDark(root.getAttribute('data-portfolio-theme') === 'dark')
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ['data-portfolio-theme'] })
    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    const next = dark ? 'light' : 'dark'
    document.documentElement.setAttribute('data-portfolio-theme', next)
    try { localStorage.setItem(THEME_KEY, next) } catch { /* Still works for this visit. */ }
  }

  const handleLinkClick = () => {
    setMenuOpen(false)
  }

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo} data-hover>
          AB<span className={styles['logo-dot']}>.</span>
        </Link>

        <div className={styles.links}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/#blog' && pathname?.startsWith('/blog')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.link} ${isActive ? styles.active : ''}`}
                data-hover
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className={styles.right}>
          <div className={styles.status}>
            <span className={styles.pulse} />
            <span className={styles['status-text']}>Open to Work</span>
          </div>
          <button
            type="button"
            className={styles.theme}
            onClick={toggleTheme}
            aria-pressed={dark}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            data-hover
          >
            <span aria-hidden="true" className={styles['theme-mark']} />
            {dark ? 'Light' : 'Dark'}
          </button>
        </div>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          data-hover
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={`${styles['mobile-menu']} ${menuOpen ? styles.open : ''}`}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/#blog' && pathname?.startsWith('/blog')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles['mobile-link']} ${isActive ? styles.active : ''}`}
              onClick={handleLinkClick}
              data-hover
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </>
  )
}

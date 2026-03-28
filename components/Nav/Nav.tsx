'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()

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

        <div className={styles.status}>
          <span className={styles.pulse} />
          <span className={styles['status-text']}>Open to Work</span>
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

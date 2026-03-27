'use client'

import { useState } from 'react'
import styles from './Nav.module.css'

const NAV_ITEMS = [
  { href: '#about', label: 'Dossier' },
  { href: '#timeline', label: 'Log' },
  { href: '#projects', label: 'Lab' },
  { href: '#skills', label: 'Stack' },
  { href: '#contact', label: 'Signal' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLinkClick = () => {
    setMenuOpen(false)
  }

  return (
    <>
      <nav className={styles.nav}>
        <a href="#" className={styles.logo} data-hover>
          AB<span className={styles['logo-dot']}>.</span>
        </a>

        <div className={styles.links}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.link}
              data-hover
            >
              {item.label}
            </a>
          ))}
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
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={styles['mobile-link']}
            onClick={handleLinkClick}
            data-hover
          >
            {item.label}
          </a>
        ))}
      </div>
    </>
  )
}

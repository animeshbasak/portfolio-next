'use client'

import Link from 'next/link'
import AccentPicker from '@components/Chrome/AccentPicker'
import styles from './Nav.module.css'

const NAV_ITEMS = [
  { href: '/#profile', label: 'PROFILE' },
  { href: '/#record', label: 'RECORD' },
  { href: '/#lab', label: 'LAB' },
  { href: '/#writing', label: 'WRITING' },
  { href: '/#contact', label: 'CONTACT' },
]

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/#top" className={styles.logo} data-cur="TOP">
          ANIMESH BASAK<span className={styles.dot}>.</span>
        </Link>

        <div className={styles.links}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className={styles.right}>
          <AccentPicker />
          <span className={styles.versions} title="Toggle design version">
            <Link href="/legacy" className={styles.versionLink} data-cur="LEGACY">
              LEGACY
            </Link>
            <span className={styles.versionActive}>V6</span>
          </span>
          <span className={styles.pill}>
            <span className={styles.pulse} />
            OPEN TO WORK
          </span>
        </div>
      </div>
    </nav>
  )
}

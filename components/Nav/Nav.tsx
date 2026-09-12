'use client'

import Link from 'next/link'
import AccentPicker from '@components/Chrome/AccentPicker'
import styles from './Nav.module.css'

const NAV_ITEMS = [
  { href: '/v6#profile', label: 'PROFILE' },
  { href: '/v6#record', label: 'RECORD' },
  { href: '/v6#lab', label: 'LAB' },
  { href: '/v6#writing', label: 'WRITING' },
  { href: '/v6#contact', label: 'CONTACT' },
]

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/v6#top" className={styles.logo} data-cur="TOP">
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
            <Link href="/" className={styles.versionLink}>NEW</Link><span className={styles.versionActive}>V6</span>
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

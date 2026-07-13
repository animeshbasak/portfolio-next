import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>© 2026 ANIMESH BASAK</span>
      <Link href="/" className={styles.home} data-cur="HOME">
        ANIMESHBASAK.COM
      </Link>
      <span>TYPE + NERVE</span>
    </footer>
  )
}

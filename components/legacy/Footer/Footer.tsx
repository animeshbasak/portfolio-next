import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles['footer-text']}>
        © 2026 <span className={styles.accent}>Animesh Basak</span> — All systems nominal
      </span>
      <span className={styles['footer-text']}>
        Built with <span className={styles.accent}>Next.js 15</span> · <span className={styles.accent}>Framer Motion</span> · CSS Modules
      </span>
      <a
        href="https://instagram.com/insanemesh.ai"
        target="_blank"
        rel="noopener noreferrer"
        className={styles['footer-link']}
        data-hover
      >
        insanemesh.ai
      </a>
    </footer>
  )
}

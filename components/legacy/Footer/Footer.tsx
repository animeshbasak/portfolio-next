import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles['footer-text']}>
        © 2026 <span className={styles.accent}>Animesh Basak</span> · Open to enquiries
      </span>
      <span className={styles['footer-text']}>
        <span className={styles.accent}>Frontend work</span> · <span className={styles.accent}>Independent builds</span> · Field notes
      </span>
    </footer>
  )
}

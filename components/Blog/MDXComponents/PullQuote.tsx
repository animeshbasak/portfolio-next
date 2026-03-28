import styles from './PullQuote.module.css'

export default function PullQuote({ children, attr }: { children: React.ReactNode; attr?: string }) {
  return (
    <blockquote className={styles.quoteBox}>
      <div className={styles.quoteText}>{children}</div>
      {attr && <cite className={styles.attr}>— {attr}</cite>}
    </blockquote>
  )
}

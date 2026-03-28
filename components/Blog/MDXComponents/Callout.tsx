import styles from './Callout.module.css'

export default function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.callout}>
      {children}
    </div>
  )
}

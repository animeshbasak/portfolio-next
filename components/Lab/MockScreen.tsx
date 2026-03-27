import styles from './Lab.module.css'

interface MockScreenProps {
  url: string
  children: React.ReactNode
}

export default function MockScreen({ url, children }: MockScreenProps) {
  return (
    <div className={styles.mock}>
      <div className={styles['mock-bar']}>
        <div className={styles['traffic-dots']}>
          <span className={`${styles['traffic-dot']} ${styles['dot-red']}`} />
          <span className={`${styles['traffic-dot']} ${styles['dot-amber']}`} />
          <span className={`${styles['traffic-dot']} ${styles['dot-green']}`} />
        </div>
        <div className={styles['mock-url']}>{url}</div>
      </div>
      <div className={styles['mock-body']}>
        <div className={styles['mock-scan']} />
        {children}
      </div>
    </div>
  )
}

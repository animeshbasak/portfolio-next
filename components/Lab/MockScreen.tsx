import styles from './Lab.module.css'

interface MockScreenProps {
  url: string
  favicon?: React.ReactNode
  children: React.ReactNode
}

const FAVICON_STYLE: React.CSSProperties = {
  width: '14px',
  height: '14px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '10px',
  fontWeight: 700,
  lineHeight: 1,
  borderRadius: '3px',
  overflow: 'hidden',
  marginRight: '6px',
  flexShrink: 0,
  verticalAlign: 'middle',
}

export default function MockScreen({ url, favicon, children }: MockScreenProps) {
  return (
    <div className={styles.mock}>
      <div className={styles['mock-bar']}>
        <div className={styles['traffic-dots']}>
          <span className={`${styles['traffic-dot']} ${styles['dot-red']}`} />
          <span className={`${styles['traffic-dot']} ${styles['dot-amber']}`} />
          <span className={`${styles['traffic-dot']} ${styles['dot-green']}`} />
        </div>
        <div className={styles['mock-url']}>
          {favicon && <span style={FAVICON_STYLE} aria-hidden="true">{favicon}</span>}
          {url}
        </div>
      </div>
      <div className={styles['mock-body']}>
        <div className={styles['mock-scan']} />
        {children}
      </div>
    </div>
  )
}

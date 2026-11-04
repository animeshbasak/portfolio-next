import styles from './Lab.module.css'

interface MockScreenProps {
  url: string
  favicon?: React.ReactNode
  /** A prototype video fills the screen edge to edge, without the scan line. */
  media?: boolean
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

export default function MockScreen({ url, favicon, media = false, children }: MockScreenProps) {
  return (
    <div className={`${styles.mock} ${media ? styles['mock-media'] : ''}`}>
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
      {media ? (
        children
      ) : (
        <div className={styles['mock-body']}>
          <div className={styles['mock-scan']} />
          {children}
        </div>
      )}
    </div>
  )
}

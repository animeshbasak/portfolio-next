import styles from './MetricRow.module.css'

interface Metric {
  n: string
  l: string
}

export default function MetricRow({ metrics }: { metrics: Metric[] }) {
  return (
    <div className={styles.grid}>
      {(metrics || []).map((m, i) => (
        <div key={i} className={styles.cell}>
          <div className={styles.number}>{m.n}</div>
          <div className={styles.label}>{m.l}</div>
        </div>
      ))}
    </div>
  )
}

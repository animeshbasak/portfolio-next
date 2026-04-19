import Link from 'next/link'
import type { CaseStudy as CS } from '@content/work'
import styles from './CaseStudy.module.css'

function formatName(name: string, emphasis: string) {
  if (!emphasis) return name
  const idx = name.toLowerCase().lastIndexOf(emphasis.toLowerCase())
  if (idx < 0) return name
  const before = name.slice(0, idx)
  const match = name.slice(idx, idx + emphasis.length)
  const after = name.slice(idx + emphasis.length)
  return (
    <>
      {before}
      <em>{match}</em>
      {after}
    </>
  )
}

export default function CaseStudy({ study }: { study: CS }) {
  return (
    <article id="main" className={styles.case}>
      <Link href="/#projects" className={styles.back} data-hover>
        ← RETURN TO LAB
      </Link>

      <header className={styles.header}>
        <div className={styles['meta-row']}>
          <span className={styles.id}>{study.id}</span>
          <span>·</span>
          <span>{study.year}</span>
          <span>·</span>
          <span>{study.role}</span>
          <span className={styles.status}>
            <span className={styles['status-dot']} />
            {study.status}
          </span>
        </div>

        <h1 className={styles.name}>{formatName(study.name, study.emphasis)}</h1>
        <p className={styles.tagline}>{study.tagline}</p>
      </header>

      <section className={styles.section}>
        <div className={styles['section-title']}>Problem</div>
        <ul className={styles['problem-list']}>
          {study.problem.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <div className={styles['section-title']}>Approach</div>
        <div className={styles['approach-grid']}>
          {study.approach.map((a) => (
            <div key={a.title} className={styles.block} data-hover>
              <div className={styles['block-title']}>{a.title}</div>
              <div className={styles['block-body']}>{a.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles['section-title']}>Stack</div>
        <div className={styles.stack}>
          {study.stack.map((s) => (
            <span key={s} className={styles['stack-tag']}>
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles['section-title']}>Outcome</div>
        <div className={styles['outcome-grid']}>
          {study.outcome.map((o) => (
            <div key={o.label} className={styles['outcome-cell']}>
              <div className={styles['outcome-metric']}>{o.metric}</div>
              <div className={styles['outcome-label']}>{o.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles['section-title']}>What&apos;s next</div>
        <p className={styles.closing}>{study.closing}</p>
      </section>

      <div className={styles['cta-row']}>
        {study.live && (
          <a
            href={study.live}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.cta} ${styles['cta-primary']}`}
            data-hover
          >
            VIEW LIVE ↗
          </a>
        )}
        {study.repo && (
          <a
            href={study.repo}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cta}
            data-hover
          >
            SOURCE ↗
          </a>
        )}
        <Link href="/#contact" className={styles.cta} data-hover>
          DISCUSS →
        </Link>
      </div>
    </article>
  )
}

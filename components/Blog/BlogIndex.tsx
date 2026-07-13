import Link from 'next/link'
import type { PostMeta } from '../../lib/blog'
import styles from './BlogIndex.module.css'

export default function BlogIndex({ allPosts }: { allPosts: PostMeta[] }) {
  return (
    <section id="writing" className={`sec ${styles.writing}`}>
      <div className="sec-head">
        <span className="num">(04)</span>
        <span className="title">WRITING</span>
        <span className="spacer" />
        <span className="hint">{String(allPosts.length).padStart(2, '0')} DISPATCHES</span>
      </div>

      <div className={styles.list}>
        {allPosts.map((post, i) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={styles.row}
            data-cur="READ"
          >
            <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
            <span className={styles.category}>{post.category}</span>
            <span className={styles.title}>{post.title}</span>
            <span className={styles.arrow}>↗</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { PostMeta } from '../../../lib/blog'
import styles from './Sidebar.module.css'

interface SidebarProps {
  post: PostMeta
  related: PostMeta[]
  content: string
}

interface TocItem {
  id: string
  text: string
}

export default function Sidebar({ post, related, content }: SidebarProps) {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const headings = content.match(/^##\s+(.*)/gm) || []
    const items = headings.map((h) => {
      const text = h.replace(/^##\s+/, '')
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      return { id, text }
    })
    setToc(items)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0px 0px -80% 0px' }
    )

    // Using setTimeout to guarantee elements are inserted into DOM
    setTimeout(() => {
      items.forEach((item) => {
        const el = document.getElementById(item.id)
        if (el) observer.observe(el)
      })
    }, 500)

    return () => observer.disconnect()
  }, [content])

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareText = encodeURIComponent(post.title)
  const shareUrl = encodeURIComponent(`https://animeshbasak.vercel.app/blog/${post.slug}`)

  return (
    <div className={styles.sidebar}>
      {/* ToC */}
      {toc.length > 0 && (
        <div className={styles.section}>
          <div className={styles.label}>IN THIS DISPATCH</div>
          <ul className={styles.toc}>
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`${styles.tocLink} ${activeId === item.id ? styles.active : ''}`}
                  data-hover
                >
                  <span className={styles.dot} />
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Share */}
      <div className={styles.section}>
        <div className={styles.label}>SHARE DISPATCH</div>
        <div className={styles.shareGrid}>
          <a href={`https://linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className={styles.shareBtn} data-hover>LinkedIn</a>
          <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noopener noreferrer" className={styles.shareBtn} data-hover>Twitter / X</a>
          <button onClick={copyUrl} className={styles.shareBtn} data-hover>
            {copied ? 'Copied ✓' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className={styles.section}>
          <div className={styles.label}>RELATED DISPATCHES</div>
          <div className={styles.relatedGrid}>
            {related.map(r => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className={styles.relatedCard} data-hover>
                <span className={styles.relCat}>[{r.category}]</span>
                <div className={styles.relTitle}>{r.title}</div>
                <div className={styles.relMeta}>{r.readTime} MIN READ</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

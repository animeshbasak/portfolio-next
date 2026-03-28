'use client'

import Link from 'next/link'
import { useCallback, MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from '@lib/motion'
import type { PostMeta } from '@lib/blog'
import styles from './PostCard.module.css'

interface PostCardProps {
  post: PostMeta
  index: number
  isDimmed: boolean
}

export default function PostCard({ post, index, isDimmed }: PostCardProps) {
  const handleMouseMove = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    card.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }, [])

  return (
    <motion.div variants={fadeUp} style={{ opacity: isDimmed ? 0.3 : 1, transition: 'opacity 0.2s ease' }}>
      <Link
        href={`/blog/${post.slug}`}
        className={styles.card}
        onMouseMove={handleMouseMove}
        data-hover
      >
        <span className={styles.num}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.category}>{post.category}</span>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.meta}>
          <span className={styles.date}>
            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span>·</span>
          <span>{post.readTime} MIN READ</span>
        </div>
        <span className={styles.arrow}>↗</span>
      </Link>
    </motion.div>
  )
}

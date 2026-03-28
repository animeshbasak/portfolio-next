'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { PostMeta } from '../../lib/blog'
import PostCard from './PostCard/PostCard'
import styles from './BlogIndex.module.css'

interface BlogIndexProps {
  allPosts: PostMeta[]
  featuredPost: PostMeta
}

const CATEGORIES = ['All', 'Engineering', 'AI / LLM', 'Products', 'Career']

export default function BlogIndex({ allPosts, featuredPost }: BlogIndexProps) {
  const [activeFilter, setActiveFilter] = useState('All')

  return (
    <div className={styles.container}>
      {/* Masthead */}
      <header className={styles.masthead}>
        <div className={styles.watermark}>TRANSMISSIONS</div>
        <span className={styles.tag}>[TRANSMISSION LOG]</span>
        <h1 className={styles.heading}>
          TRANS-<br />MISSIONS
        </h1>
        <p className={styles.subtext}>
          Field notes from a decade at the intersection of engineering craft,
          AI systems, and building things that survive contact with reality.
        </p>

        <div className={styles['masthead-meta']}>
          <div className={styles['dispatch-count']}>12 Dispatches · Mar 2026</div>
          <div className={styles.filters}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles['filter-chip']} ${activeFilter === cat ? styles.active : ''}`}
                onClick={() => setActiveFilter(cat)}
                data-hover
              >
                [{cat}]
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Featured Post */}
      {featuredPost && activeFilter === 'All' && (
        <section className={styles['featured-section']}>
          <div className={styles['section-label']}>FEATURED DISPATCH</div>
          <Link href={`/blog/${featuredPost.slug}`} className={styles['featured-link']} data-hover>
            <div className={styles['featured-grid']}>
              <div className={styles['featured-left']}>
                <span className={styles['f-kicker']}>{featuredPost.category} · {featuredPost.readTime} MIN READ</span>
                <h2 className={styles['f-title']}>{featuredPost.title}</h2>
                <p className={styles['f-excerpt']}>{featuredPost.excerpt}</p>
                <div className={styles['f-meta']}>
                  <span>{new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className={styles.sep}>·</span>
                  <span>{featuredPost.readTime} MIN READ</span>
                  <span className={styles.sep}>·</span>
                  <span>1,247 READS</span>
                </div>
                <div className={styles['f-cta']}>Read Dispatch ↗</div>
              </div>
              <div className={styles['visual-tile']}>
                <span className={styles['tile-num']}>01</span>
                <div className={styles['tile-category']}>{featuredPost.category}</div>
                <div className={styles['tile-rule']} />
                <div className={styles['tile-title']}>{featuredPost.title}</div>
                <div className={styles['tile-date']}>
                  {new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* All Dispatches */}
      <section className={styles['grid-section']}>
        <div className={styles['section-label']}>ALL DISPATCHES</div>
        <div className={styles['posts-grid']}>
          {allPosts.map((post, i) => {
            const isDimmed = activeFilter !== 'All' && post.category !== activeFilter
            return (
              <PostCard 
                key={post.slug} 
                post={post} 
                index={i} 
                isDimmed={isDimmed} 
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts, getPostBySlug, getRelatedPosts } from '../../../lib/blog'
import PostBody from '../../../components/Blog/PostBody/PostBody'
import Sidebar from '../../../components/Blog/Sidebar/Sidebar'
import styles from './post.module.css'

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params
  const post = getPostBySlug(p.slug)
  if (!post) return {}
  return {
    title: `${post.title} — Animesh Basak`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://animeshbasak.vercel.app/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags || [],
    }
  }
}

export default async function SinglePost({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params
  const post = getPostBySlug(p.slug)
  if (!post) notFound()

  const allPosts = getAllPosts()
  const postIndex = allPosts.findIndex(x => x.slug === p.slug)
  const prevPost = postIndex > 0 ? allPosts[postIndex - 1] : null
  const nextPost = postIndex < allPosts.length - 1 ? allPosts[postIndex + 1] : null
  const relatedPosts = getRelatedPosts(p.slug, post.category, 3)

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.watermark}>{String(postIndex + 1).padStart(2, '0')}</div>
        <Link href="/blog" className={styles.breadcrumb} data-hover>← Transmissions / {post.category}</Link>
        <div className={styles.category}>{post.category}</div>
        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.subtitle}>{post.excerpt}</p>
        
        <div className={styles['meta-row']}>
          <div className={styles.meta}>
            <span className={styles['meta-label']}>Author</span>
            <span className={styles['meta-value']}>Animesh Basak</span>
          </div>
          <div className={styles.meta}>
            <span className={styles['meta-label']}>Published</span>
            <span className={styles['meta-value']}>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className={styles.meta}>
            <span className={styles['meta-label']}>Read Time</span>
            <span className={styles['meta-value']}>{post.readTime} min</span>
          </div>
          <div className={styles.meta}>
            <span className={styles['meta-label']}>Reads</span>
            <span className={styles['meta-value']}>-</span>
          </div>
        </div>

        <div className={styles.tags}>
          {(post.tags || []).map(t => <span key={t} className={styles.tag}>[{t}]</span>)}
        </div>
      </header>

      <div className={styles.layout}>
        <article className={styles.article}>
          <PostBody content={post.content} />
        </article>

        <aside className={styles.aside}>
          <Sidebar post={post} related={relatedPosts} content={post.content} />
        </aside>
      </div>

      <footer className={styles.footer}>
        <div className={styles['footer-label']}>NEXT TRANSMISSIONS</div>
        <div className={styles['footer-grid']}>
          {prevPost ? (
            <Link href={`/blog/${prevPost.slug}`} className={styles['footer-card']} data-hover>
              <div className={styles['direction-label']}>PREVIOUS DISPATCH</div>
              <div className={styles['footer-title']}>{prevPost.title}</div>
            </Link>
          ) : <div />}
          
          {nextPost ? (
            <Link href={`/blog/${nextPost.slug}`} className={`${styles['footer-card']} ${styles['right-align']}`} data-hover>
              <div className={styles['direction-label']}>NEXT DISPATCH</div>
              <div className={styles['footer-title']}>{nextPost.title}</div>
            </Link>
          ) : <div />}
        </div>
      </footer>
    </div>
  )
}

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { Post, PostMeta } from '../blog'

/** Curated website editions. Originals remain in content/blog for the archives.
 * This reader is not an AI-context allowlist; article text stays outside guide payloads.
 */
const PUBLIC_POSTS_DIR = path.join(process.cwd(), 'content/blog-public')

export function getPublicPostBySlug(slug: string): Post | null {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null
  const filename = path.join(PUBLIC_POSTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filename)) return null
  const { data, content } = matter(fs.readFileSync(filename, 'utf8'))
  return {
    title: data.title,
    slug,
    excerpt: data.excerpt,
    category: data.category,
    date: data.date,
    readTime: Math.max(1, Math.ceil(readingTime(content).minutes)),
    featured: data.featured === true,
    tags: Array.isArray(data.tags) ? data.tags : [],
    content,
  }
}

export function getPublicPosts(): PostMeta[] {
  if (!fs.existsSync(PUBLIC_POSTS_DIR)) return []
  return fs.readdirSync(PUBLIC_POSTS_DIR)
    .filter(filename => filename.endsWith('.mdx'))
    .map(filename => getPublicPostBySlug(filename.slice(0, -4)))
    .filter((post): post is Post => post !== null)
    .map(({ content: _content, ...meta }) => meta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

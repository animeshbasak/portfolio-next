import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

export interface PostMeta {
  title: string
  slug: string
  excerpt: string
  category: string
  date: string
  readTime: number
  featured: boolean
  tags: string[]
}

export interface Post extends PostMeta {
  content: string  // raw MDX string
}

const POSTS_DIR = path.join(process.cwd(), 'content/blog')

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  const files = fs.readdirSync(POSTS_DIR)
  return files
    .filter(f => f.endsWith('.mdx'))
    .map(f => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf8')
      const { data, content } = matter(raw)
      const rt = Math.ceil(readingTime(content).minutes)
      return { ...data, slug: data.slug || f.replace('.mdx', ''), readTime: data.readTime ?? rt } as PostMeta
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const rt = Math.ceil(readingTime(content).minutes)
  return { ...data, slug, content, readTime: data.readTime ?? rt } as Post
}

export function getFeaturedPost(): PostMeta | undefined {
  return getAllPosts().find(p => p.featured)
}

export function getRelatedPosts(slug: string, category: string, limit = 3): PostMeta[] {
  return getAllPosts()
    .filter(p => p.slug !== slug && p.category === category)
    .slice(0, limit)
}

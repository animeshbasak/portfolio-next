import type { MetadataRoute } from 'next'
import { getAllPosts } from '@lib/blog'
import { getAllCaseStudySlugs } from '@content/work'

const SITE_URL = 'https://animeshbasak.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/lite`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const workRoutes: MetadataRoute.Sitemap = getAllCaseStudySlugs().map((slug) => ({
    url: `${SITE_URL}/work/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  let postRoutes: MetadataRoute.Sitemap = []
  try {
    postRoutes = getAllPosts().map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))
  } catch {
    postRoutes = []
  }

  return [...staticRoutes, ...workRoutes, ...postRoutes]
}

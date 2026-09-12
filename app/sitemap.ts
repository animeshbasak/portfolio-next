import type { MetadataRoute } from 'next'
import { getPublicPosts } from '../lib/portfolio/public-blog'
import { projects } from '../lib/portfolio/data'

const SITE_URL = 'https://animeshbasak.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublicPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...['/profile', '/work', '/studio', '/blog', '/contact', ...projects.map(project => `/work/${project.slug}`)].map(path => ({url: `${SITE_URL}${path}`, changeFrequency: 'monthly' as const, priority: 0.7})),
    ...posts,
  ]
}

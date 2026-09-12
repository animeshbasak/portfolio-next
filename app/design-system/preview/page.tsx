import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PortfolioStory from '@components/design-system/PortfolioStory'
import PortfolioContent from '@components/design-system/PortfolioContent'
import { getAllPosts } from '../../../lib/blog'

export const metadata: Metadata = {
  title: 'Built over time — Portfolio preview | Animesh Basak',
  description: 'A continuous story through career, independent projects, and writing.',
  robots: { index: false, follow: false },
  alternates: { canonical: null },
}

export default function PortfolioPreviewPage() {
  if (process.env.NODE_ENV !== 'development') notFound()
  return <PortfolioStory><PortfolioContent posts={getAllPosts()} /></PortfolioStory>
}

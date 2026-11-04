import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  distDir: process.env.PORTFOLIO_DEV === '1' ? '.next-dev' : '.next',
  // Retired 31 Oct 2026: earlier designs and notes about archived projects.
  // 4 Nov 2026: the original dossier design (was /legacy) is the homepage again.
  async redirects() {
    const retired = ['/legacy', '/v6', '/v6/:path*', '/world', '/design-system', '/design-system/:path*', '/studio']
    const notes = ['lakshya-7-source-unified-search', 'lakshya-v2-job-search-os', 'friday-phase-4-arena', 'insanemesh-ai-automation-architecture']
    return [
      ...retired.map((source) => ({ source, destination: '/', permanent: true })),
      { source: '/services', destination: '/#contact', permanent: true },
      ...notes.map((slug) => ({ source: `/blog/${slug}`, destination: '/blog', permanent: true })),
    ]
  },
}

export default nextConfig

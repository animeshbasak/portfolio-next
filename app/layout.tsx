import type { Metadata, Viewport } from 'next'
import { bebasNeue, imFell, ibmMono } from './fonts'
import CursorWrapper from '@components/Cursor/CursorWrapper'
import Nav from '@components/Nav/Nav'
import Footer from '@components/Footer/Footer'
import LenisProvider from '@components/Scene/LenisProvider'
import './globals.css'

const SITE_URL = 'https://animeshbasak.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Animesh Basak — AI Engineer & Lead Frontend',
    template: '%s — Animesh Basak',
  },
  description:
    'AI Engineer building agentic systems + Lead Frontend Engineer with 7+ years at consumer scale (150M+ MAU). Shipping FRIDAY (macOS agent), Lakshya Hub (AI job OS), SuperAgent (Claude routing), and insanemesh.ai.',
  authors: [{ name: 'Animesh Basak', url: SITE_URL }],
  creator: 'Animesh Basak',
  keywords: [
    'Animesh Basak',
    'AI Engineer',
    'Lead Frontend Engineer',
    'Agentic Systems',
    'Claude API',
    'Next.js',
    'React',
    'FRIDAY',
    'Lakshya Hub',
    'SuperAgent',
    'insanemesh.ai',
    'portfolio',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Animesh Basak — AI Engineer & Lead Frontend',
    description:
      'AI Engineer + Lead Frontend. Building FRIDAY, Lakshya Hub, SuperAgent, insanemesh.ai.',
    type: 'website',
    url: SITE_URL,
    siteName: 'Animesh Basak',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Animesh Basak — AI Engineer & Lead Frontend',
    description:
      'AI Engineer + Lead Frontend. Building FRIDAY, Lakshya Hub, SuperAgent, insanemesh.ai.',
    creator: '@animeshsbasak',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export const viewport: Viewport = {
  themeColor: '#0d0c0a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Animesh Basak',
  url: SITE_URL,
  jobTitle: 'AI Engineer & Lead Frontend Engineer',
  description:
    'AI Engineer building agentic systems + Lead Frontend Engineer with 7+ years at consumer scale.',
  sameAs: [
    'https://github.com/animeshbasak',
    'https://linkedin.com/in/animeshbasak',
    'https://x.com/animeshsbasak',
    'https://instagram.com/insanemesh.ai',
  ],
  knowsAbout: [
    'Artificial Intelligence',
    'Large Language Models',
    'Agentic Systems',
    'React',
    'Next.js',
    'TypeScript',
    'Claude API',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${imFell.variable} ${ibmMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <LenisProvider />
        <CursorWrapper />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}

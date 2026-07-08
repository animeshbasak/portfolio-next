import type { Metadata } from 'next'
import { bebasNeue, imFell, ibmMono } from './fonts'
import CursorWrapper from '@components/Cursor/CursorWrapper'
import Nav from '@components/Nav/Nav'
import Footer from '@components/Footer/Footer'
import './globals.css'

const SITE_URL = 'https://animeshbasak.com'
const TITLE =
  'Animesh Basak — Senior Frontend Engineer | React, TypeScript, React Native | Delhi NCR'
const DESCRIPTION =
  'Senior Frontend Engineer with 7+ years at Paytm, MakeMyTrip, and Airtel Digital. React, TypeScript, React Native, Next.js — building at 150M+ MAU scale with Gen AI product experience.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    url: SITE_URL,
    siteName: 'Animesh Basak',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Animesh Basak',
  jobTitle: 'Senior Frontend Engineer',
  url: SITE_URL,
  email: 'mailto:animeshsbasak@gmail.com',
  worksFor: {
    '@type': 'Organization',
    name: 'Airtel Digital',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'New Delhi',
    addressRegion: 'Delhi NCR',
    addressCountry: 'IN',
  },
  knowsAbout: [
    'React',
    'TypeScript',
    'React Native',
    'Next.js',
    'Frontend Architecture',
    'Generative AI',
    'Agentic Systems',
  ],
  sameAs: [
    'https://linkedin.com/in/animeshbasak',
    'https://github.com/animeshbasak',
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <CursorWrapper />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}

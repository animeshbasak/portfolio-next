import type { Metadata } from 'next'
import { archivo, imFell, fragmentMono } from './fonts'
import CursorWrapper from '@components/Cursor/CursorWrapper'
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
      className={`${archivo.variable} ${imFell.variable} ${fragmentMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {/* restore saved accent before paint to avoid a color flash */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var a=localStorage.getItem('v6-accent');if(a&&/^#[0-9A-Fa-f]{6}$/.test(a))document.documentElement.style.setProperty('--acc',a)}catch(e){}",
          }}
        />
        <CursorWrapper />
        {children}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { archivo, imFell, fragmentMono, folioDisplay, folioBody, folioMono } from './fonts'
import CursorWrapper from '@components/Cursor/CursorWrapper'
import './globals.css'
import {THEME_BOOTSTRAP} from '../lib/personal/theme'

const SITE_URL = 'https://animeshbasak.com'
const TITLE =
  'Animesh Basak | Lead Frontend Engineer, New Delhi'
const DESCRIPTION =
  'Animesh Basak, Lead Frontend Engineer in Delhi NCR. 8 years on React, TypeScript and React Native at Airtel, MakeMyTrip and Paytm. Open to lead frontend roles.'

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
    locale: 'en_IN',
  },
  authors: [{name: 'Animesh Basak', url: SITE_URL}],
  creator: 'Animesh Basak',
  keywords: ['Animesh Basak', 'Lead Frontend Engineer', 'React', 'TypeScript', 'React Native', 'BFF', 'Delhi NCR', 'Airtel Digital'],
  twitter: {
    card: 'summary_large_image',
    creator: '@animeshsbasak',
    title: TITLE,
    description: DESCRIPTION,
  },
}

const PERSON_ID = `${SITE_URL}/#person`
const personSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Animesh Basak',
      jobTitle: 'Lead Frontend Engineer',
      description:
        'Lead Frontend Engineer with 8 years on consumer products at Airtel Digital, MakeMyTrip and Paytm. Builds React, TypeScript and React Native front ends and the BFF layer behind them.',
      url: SITE_URL,
      image: `${SITE_URL}/opengraph-image`,
      email: 'mailto:animeshsbasak@gmail.com',
      worksFor: {'@type': 'Organization', name: 'Airtel Digital'},
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
        'Backend for Frontend (BFF)',
        'Frontend architecture',
        'Micro-frontends',
        'AI-assisted software delivery',
      ],
      sameAs: [
        'https://www.linkedin.com/in/animeshbasak/',
        'https://github.com/animeshbasak',
        'https://x.com/animeshsbasak',
      ],
    },
    {
      '@type': 'ProfilePage',
      '@id': `${SITE_URL}/#profilepage`,
      url: SITE_URL,
      name: TITLE,
      mainEntity: {'@id': PERSON_ID},
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Animesh Basak',
      author: {'@id': PERSON_ID},
    },
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
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${imFell.variable} ${fragmentMono.variable} ${folioDisplay.variable} ${folioBody.variable} ${folioMono.variable}`}
    >
      <body>
        <script dangerouslySetInnerHTML={{__html:THEME_BOOTSTRAP}} />
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

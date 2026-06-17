import type { Metadata } from 'next'
import { bebasNeue, imFell, ibmMono } from './fonts'
import CursorWrapper from '@components/Cursor/CursorWrapper'
import Nav from '@components/Nav/Nav'
import Footer from '@components/Footer/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Animesh Basak — Lead Engineer, Full-Stack & AI Systems',
  description:
    'Lead Engineer building full-stack and AI-native systems — 7+ years at consumer scale (150M+ MAU) across React/TypeScript, Spring Boot, and Python AI services. Shipping FRIDAY (macOS agent), Lakshya Hub (AI job OS), SuperAgent (Claude routing), and insanemesh.ai.',
  openGraph: {
    title: 'Animesh Basak — Lead Engineer, Full-Stack & AI Systems',
    description:
      'Lead Full-Stack Engineer + AI systems builder. Building FRIDAY, Lakshya Hub, SuperAgent, insanemesh.ai.',
    type: 'website',
    url: 'https://animeshbasak.vercel.app',
  },
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
        <CursorWrapper />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}

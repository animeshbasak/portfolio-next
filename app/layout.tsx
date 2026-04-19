import type { Metadata } from 'next'
import { bebasNeue, imFell, ibmMono } from './fonts'
import CursorWrapper from '@components/Cursor/CursorWrapper'
import Nav from '@components/Nav/Nav'
import Footer from '@components/Footer/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Animesh Basak — AI Engineer & Lead Frontend',
  description:
    'AI Engineer building agentic systems + Lead Frontend Engineer with 7+ years at consumer scale (150M+ MAU). Shipping FRIDAY (macOS agent), Lakshya Hub (AI job OS), SuperAgent (Claude routing), and insanemesh.ai.',
  openGraph: {
    title: 'Animesh Basak — AI Engineer & Lead Frontend',
    description:
      'AI Engineer + Lead Frontend. Building FRIDAY, Lakshya Hub, SuperAgent, insanemesh.ai.',
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

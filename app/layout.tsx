import type { Metadata } from 'next'
import { bebasNeue, imFell, ibmMono } from './fonts'
import CursorWrapper from '@components/Cursor/CursorWrapper'
import Nav from '@components/Nav/Nav'
import Footer from '@components/Footer/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Animesh Basak — Lead Frontend Engineer',
  description:
    'Lead Frontend Engineer with 7+ years building consumer-scale platforms at 150M+ MAU. AI-native product builder. Open to Staff, Principal, and EM roles.',
  openGraph: {
    title: 'Animesh Basak — Lead Frontend Engineer',
    description:
      'Lead Frontend Engineer with 7+ years building consumer-scale platforms at 150M+ MAU. AI-native product builder.',
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

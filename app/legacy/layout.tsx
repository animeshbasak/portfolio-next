import type { Metadata } from 'next'
import Link from 'next/link'
import { bebasNeue, ibmMono } from '../fonts'
import LegacyNav from '@components/legacy/Nav/Nav'
import LegacyFooter from '@components/legacy/Footer/Footer'

export const metadata: Metadata = {
  title: 'Animesh Basak — Portfolio (Legacy Edition)',
  robots: {
    index: false,
    follow: true,
  },
}

export default function LegacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`legacy-root ${bebasNeue.variable} ${ibmMono.variable}`}>
      <LegacyNav />
      {children}
      <LegacyFooter />
      <Link href="/" className="legacy-switch" data-cur="V6">
        <span className="legacy-switch-cell legacy-switch-active">LEGACY</span>
        <span className="legacy-switch-cell">V6 ↗</span>
      </Link>
    </div>
  )
}

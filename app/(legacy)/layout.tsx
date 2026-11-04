import { bebasNeue, ibmMono } from '../fonts'
import LegacyNav from '@components/legacy/Nav/Nav'
import LegacyFooter from '@components/legacy/Footer/Footer'

// The original dossier design, restored as the homepage on 4 Nov 2026.
export default function LegacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`legacy-root ${bebasNeue.variable} ${ibmMono.variable}`}>
      <LegacyNav />
      {children}
      <LegacyFooter />
    </div>
  )
}

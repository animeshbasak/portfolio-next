import Nav from '@components/Nav/Nav'
import Hero from '@components/Hero/Hero'
import Dossier from '@components/Dossier/Dossier'
import Timeline from '@components/Timeline/Timeline'
import Lab from '@components/Lab/Lab'
import Skills from '@components/Skills/Skills'
import Contact from '@components/Contact/Contact'
import Footer from '@components/Footer/Footer'

const TICKER_ITEMS = [
  'React', 'Next.js 15', 'TypeScript', 'Supabase', 'LLM APIs',
  'System Design', 'SSR', 'Web Vitals', 'AI Engineering',
  '150M+ Scale', 'HLD / LLD', 'GrowthBook',
]

export default function Home() {
  const tickerContent = TICKER_ITEMS.join(' ◈ ')
  const doubledTicker = `${tickerContent} ◈ ${tickerContent} ◈ `

  return (
    <>
      <Nav />
      <main>
        <Hero />

        {/* ── Ticker ── */}
        <div
          style={{
            borderTop: '1px solid var(--ink3)',
            borderBottom: '1px solid var(--ink3)',
            background: 'var(--bg2)',
            padding: '0.5rem 0',
            overflow: 'hidden',
            whiteSpace: 'nowrap' as const,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              animation: 'marquee 28s linear infinite',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.52rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              color: 'var(--ink2)',
            }}
            dangerouslySetInnerHTML={{
              __html: doubledTicker.replace(/◈/g, '<span style="color:var(--red)">◈</span>'),
            }}
          />
        </div>

        <Dossier />
        <Timeline />
        <Lab />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

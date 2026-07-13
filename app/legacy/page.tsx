import Hero from '@components/legacy/Hero/Hero'
import Dossier from '@components/legacy/Dossier/Dossier'
import Timeline from '@components/legacy/Timeline/Timeline'
import Lab from '@components/legacy/Lab/Lab'
import Skills from '@components/Skills/Skills'
import Contact from '@components/legacy/Contact/Contact'
import BlogIndex from '@components/legacy/Blog/BlogIndex'
import { getAllPosts, getFeaturedPost } from '../../lib/blog'

const TICKER_ITEMS = [
  'React', 'TypeScript', 'React Native', 'Next.js 15',
  'SSR', 'Web Vitals', '150M+ Scale',
  'Gen AI', 'Agentic UIs', 'Claude API', 'Supabase',
  'System Design', 'HLD / LLD', 'GrowthBook',
]

export default function LegacyHome() {
  const tickerContent = TICKER_ITEMS.join(' ◈ ')
  const doubledTicker = `${tickerContent} ◈ ${tickerContent} ◈ `

  const allPosts = getAllPosts()
  const featured = getFeaturedPost() || allPosts[0]
  const blogList = allPosts.filter(p => p.slug !== featured?.slug)

  return (
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

      {/* ── Portfolio Section ── */}
      <Dossier />
      <Timeline />
      <Lab />
      <Skills />

      {/* ── Blog Section (Transmissions) ── */}
      <section id="blog" style={{ borderTop: '1px solid var(--ink3)', paddingTop: '4rem' }}>
        <div className="section-label" style={{ marginBottom: '2rem' }}>
          <span className="num">04</span>
          <span>——</span>
          <span>TRANSMISSIONS</span>
          <span className="line" />
          <span className="tag">[ENCRYPTED FILES]</span>
        </div>
        <BlogIndex allPosts={blogList} featuredPost={featured} />
      </section>

      {/* ── Contact Section ── */}
      <Contact />
    </main>
  )
}

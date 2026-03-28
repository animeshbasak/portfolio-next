import Hero from '@components/Hero/Hero'
import Dossier from '@components/Dossier/Dossier'
import Timeline from '@components/Timeline/Timeline'
import Lab from '@components/Lab/Lab'
import Skills from '@components/Skills/Skills'
import Contact from '@components/Contact/Contact'
import BlogIndex from '@components/Blog/BlogIndex'
import { getAllPosts, getFeaturedPost } from '../lib/blog'

const TICKER_ITEMS = [
  'React', 'Next.js 15', 'TypeScript', 'Supabase', 'LLM APIs',
  'System Design', 'SSR', 'Web Vitals', 'AI Engineering',
  '150M+ Scale', 'HLD / LLD', 'GrowthBook',
]

export default function Home() {
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



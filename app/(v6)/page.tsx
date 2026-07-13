import Hero from '@components/Hero/Hero'
import Dossier from '@components/Dossier/Dossier'
import Timeline from '@components/Timeline/Timeline'
import Lab from '@components/Lab/Lab'
import Contact from '@components/Contact/Contact'
import BlogIndex from '@components/Blog/BlogIndex'
import Marquee from '@components/Chrome/Marquee'
import { getAllPosts } from '../../lib/blog'

const MARQUEE_SKILLS = [
  'REACT',
  'TYPESCRIPT',
  'REACT NATIVE',
  'NEXT.JS',
  'GEN AI',
  'SYSTEM DESIGN',
]

const MARQUEE_PROOF = [
  'AIRTEL',
  'MAKEMYTRIP',
  'PAYTM',
  '150M USERS',
  'NEW DELHI',
  'SHIP IT',
]

export default function Home() {
  const allPosts = getAllPosts()

  return (
    <main>
      <Hero />

      <Marquee items={MARQUEE_SKILLS} direction={1} />

      {/* legacy anchor aliases */}
      <span id="about" />
      <Dossier />

      <span id="timeline" />
      <Timeline />

      <Marquee items={MARQUEE_PROOF} direction={-1} />

      <span id="projects" />
      <Lab />

      <span id="blog" />
      <BlogIndex allPosts={allPosts} />

      <Contact />
    </main>
  )
}

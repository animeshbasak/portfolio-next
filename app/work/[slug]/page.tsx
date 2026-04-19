import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CaseStudy from '@components/Work/CaseStudy'
import { getCaseStudy, getAllCaseStudySlugs } from '@content/work'

type Params = { slug: string }

export async function generateStaticParams(): Promise<Params[]> {
  return getAllCaseStudySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) return { title: 'Not Found' }
  return {
    title: `${study.name} — Case Study`,
    description: study.tagline,
    openGraph: {
      title: `${study.name} — ${study.tagline}`,
      description: study.closing,
      type: 'article',
    },
  }
}

export default async function WorkPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) notFound()
  return <CaseStudy study={study} />
}

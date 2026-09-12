import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import DesignSystem from '@components/design-system/DesignSystem'

export const metadata: Metadata = {
  title: 'Built over time — Design system | Animesh Basak',
  description: 'A local workbench for the typography, colors, components, and motion of Built over time.',
  robots: { index: false, follow: false },
  alternates: { canonical: null },
  openGraph: {
    title: 'Built over time — Design system',
    description: 'Local design-system workbench.',
    images: [],
  },
  twitter: { title: 'Built over time — Design system', description: 'Local design-system workbench.', images: [] },
}

export default async function DesignSystemPage() {
  if (process.env.NODE_ENV !== 'development') notFound()
  const source = await readFile(join(process.cwd(), 'components/design-system/tokens.css'), 'utf8')
  const colors = Object.fromEntries([...source.matchAll(/(--folio-[\w-]+):\s*(#[a-fA-F0-9]{6});/g)].map(match => [match[1], match[2]]))
  return <DesignSystem colors={colors} />
}

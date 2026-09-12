import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import MotionLab from '@components/design-system/motion/MotionLab'

export const metadata: Metadata = {
  title: 'Inside the making — Motion study | Animesh Basak',
  description: 'A local, reversible journey through layers, structure, and particles.',
  robots: { index: false, follow: false },
  alternates: { canonical: null },
}

export default function MotionStudyPage() {
  if (process.env.NODE_ENV !== 'development') notFound()
  return <MotionLab />
}

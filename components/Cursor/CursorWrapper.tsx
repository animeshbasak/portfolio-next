'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

const Cursor = dynamic(() => import('./Cursor'), { ssr: false })

export default function CursorWrapper() {
  const pathname = usePathname()
  if (!pathname.startsWith('/v6') && !pathname.startsWith('/legacy')) return null
  return <Cursor />
}

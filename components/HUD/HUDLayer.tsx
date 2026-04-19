'use client'

import { usePathname } from 'next/navigation'
import MissionClock from './MissionClock'
import Minimap from './Minimap'
import AudioToggle from './AudioToggle'
import TARS from './TARS'

export default function HUDLayer() {
  const pathname = usePathname()
  if (pathname?.startsWith('/lite')) return null
  return (
    <>
      <MissionClock />
      <AudioToggle />
      <Minimap />
      <TARS />
    </>
  )
}

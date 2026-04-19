'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

export default function GargantuaPlaceholder() {
  const ringRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.05
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <mesh ref={ringRef}>
        <ringGeometry args={[1.2, 1.9, 128]} />
        <meshBasicMaterial color="#ff7a1a" transparent opacity={0.8} />
      </mesh>
      <mesh>
        <circleGeometry args={[1.15, 64]} />
        <meshBasicMaterial color="#050505" />
      </mesh>
    </>
  )
}

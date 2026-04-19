'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { vertexShader, fragmentShader } from './gargantua.glsl'
import { descentStore } from '@lib/descentStore'

interface Props {
  descent?: number
  tier?: number
}

export default function GargantuaHero({ descent = 0, tier = 1 }: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const { size } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uDescent: { value: descent },
      uTier: { value: tier },
    }),
    // create once; update via useEffect / useFrame below
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    if (!matRef.current) return
    matRef.current.uniforms.uResolution.value.set(size.width, size.height)
  }, [size.width, size.height])

  useEffect(() => {
    if (!matRef.current) return
    matRef.current.uniforms.uDescent.value = descent
  }, [descent])

  useEffect(() => {
    if (!matRef.current) return
    matRef.current.uniforms.uTier.value = tier
  }, [tier])

  useFrame((state) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    matRef.current.uniforms.uDescent.value = descentStore.get()
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

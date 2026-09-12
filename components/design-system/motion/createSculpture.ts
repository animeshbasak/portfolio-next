import * as THREE from 'three'
import { sceneAt, smoothRange } from './timeline'

export type SculpturePalette = { paper: string; ink: string; indigo: string; signal: string; chalk: string; line: string }

/** The scene is authored geometry; it contains no employer assets or external models. */
export function createSculpture(palette: SculpturePalette, compact: boolean, composition: 'lab' | 'story' = 'lab') {
  const scene = new THREE.Scene()
  const paperColor = new THREE.Color(palette.paper)
  const inkColor = new THREE.Color(palette.ink)
  const lightInk = new THREE.Color(palette.chalk)
  const indigo = new THREE.Color(palette.indigo)
  const signal = new THREE.Color(palette.signal)
  scene.background = composition === 'story' ? null : paperColor.clone()
  scene.add(new THREE.HemisphereLight(0xffffff, 0x818495, 2.3))
  const key = new THREE.DirectionalLight(0xffffff, 3.1)
  key.position.set(-4, 7, 8)
  scene.add(key)
  const root = new THREE.Group()
  scene.add(root)
  const camera = new THREE.PerspectiveCamera(38, 1, 0.06, 100)
  const paperGeometry = new THREE.BoxGeometry(3.6, 4.6, 0.028)
  const papers: THREE.Group[] = []
  const paperMaterials: THREE.MeshStandardMaterial[] = []
  const markMaterials: THREE.LineBasicMaterial[] = []

  function line(points: number[][], material: THREE.LineBasicMaterial) {
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p[0], p[1], p[2] ?? 0.02))), material)
  }
  function boxLine(x: number, y: number, w: number, h: number, material: THREE.LineBasicMaterial) {
    return line([[x, y], [x + w, y], [x + w, y - h], [x, y - h], [x, y]], material)
  }

  for (let i = 0; i < 6; i++) {
    const group = new THREE.Group()
    const material = new THREE.MeshStandardMaterial({ color: palette.chalk, roughness: 0.9, metalness: 0, transparent: true, depthWrite: true })
    const marks = new THREE.LineBasicMaterial({ color: i === 3 ? palette.signal : palette.indigo, transparent: true, opacity: 0.8 })
    const muted = new THREE.LineBasicMaterial({ color: palette.line, transparent: true, opacity: 0.7 })
    paperMaterials.push(material)
    markMaterials.push(marks, muted)
    group.add(new THREE.Mesh(paperGeometry, material))
    group.add(boxLine(-1.63, 2.13, 3.26, 4.26, muted))
    group.add(line([[-1.35, 1.82], [-0.95, 1.82]], marks))
    group.add(line([[0.75, 1.82], [1.35, 1.82]], muted))
    for (let n = 0; n < 3; n++) group.add(line([[-1.3, -1.46 - n * 0.16], [n === 2 ? 0.3 : 1.3, -1.46 - n * 0.16]], muted))
    if (i % 3 === 0) {
      for (let j = 0; j < 3; j++) {
        const pts = Array.from({ length: 90 }, (_, n) => {
          const t = n / 89 * Math.PI * 2
          return [Math.cos(t) * (0.56 + j * 0.23), Math.sin(t) * (0.56 + j * 0.23), 0.021]
        })
        group.add(line(pts, marks))
      }
      group.add(line([[-1.24, 0], [1.24, 0]], muted))
    } else if (i % 3 === 1) {
      for (let n = 0; n < 5; n++) group.add(boxLine(-1.05, 1.03 - n * 0.43, n === 0 ? 2.1 : 1.1 + n * 0.2, 0.3, marks))
    } else {
      for (let n = 0; n < 4; n++) group.add(boxLine(-1.08 + (n % 2) * 1.3, 0.88 - Math.floor(n / 2) * 1.24, 0.83, 0.68, marks))
      group.add(line([[-0.25, 0.54], [0.22, 0.54]], marks))
      group.add(line([[-0.65, 0.2], [-0.65, -0.36]], marks))
      group.add(line([[0.62, 0.2], [0.62, -0.36]], marks))
    }
    papers.push(group)
    root.add(group)
  }

  // Each surface breaks into a fixed 24 × 32 field before becoming points.
  const tileMaterial = new THREE.MeshStandardMaterial({ color: palette.chalk, roughness: 0.7, transparent: true })
  const tileGeometry = new THREE.BoxGeometry(3.6 / 24 * 0.86, 4.6 / 32 * 0.86, 0.025)
  const tiles = new THREE.InstancedMesh(tileGeometry, tileMaterial, 24 * 32)
  tiles.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  tiles.frustumCulled = false
  root.add(tiles)
  const dummy = new THREE.Object3D()

  const count = compact ? 6000 : 16000
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sheet = new Float32Array(count * 3)
  const knot = new Float32Array(count * 3)
  const tunnel = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  let seed = 30721
  const random = () => { seed = (Math.imul(1664525, seed) + 1013904223) >>> 0; return seed / 4294967296 }
  const color = new THREE.Color()
  for (let i = 0; i < count; i++) {
    const u = random() * Math.PI * 2
    const v = random() * Math.PI * 2
    const r = Math.sqrt(random()) * 0.32
    const ring = 1.65 + 0.55 * Math.cos(3 * u)
    const j = i * 3
    sheet[j] = (random() - 0.5) * 3.6
    sheet[j + 1] = (random() - 0.5) * 4.6
    sheet[j + 2] = (random() - 0.5) * 0.06
    knot[j] = Math.cos(2 * u) * (ring + r * Math.cos(v))
    knot[j + 1] = Math.sin(2 * u) * (ring + r * Math.cos(v))
    knot[j + 2] = Math.sin(3 * u) * 0.85 + r * Math.sin(v)
    const z = random() * 20 - 15
    const turn = u + z * 0.44
    const radius = 0.85 + random() * 2.5 + Math.sin(z * 0.7) * 0.22
    tunnel[j] = Math.cos(turn) * radius
    tunnel[j + 1] = Math.sin(turn) * radius
    tunnel[j + 2] = z
    seeds[i] = random()
    color.copy(i % 19 === 0 ? signal : i % 4 === 0 ? lightInk : indigo)
    if (i % 19 !== 0) color.lerp(lightInk, 0.2 + seeds[i] * 0.4)
    colors[j] = color.r; colors[j + 1] = color.g; colors[j + 2] = color.b
  }
  const pointGeometry = new THREE.BufferGeometry()
  pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage))
  pointGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  // A tiny authored disc texture avoids square point sprites; no custom shader.
  const discCanvas = document.createElement('canvas')
  discCanvas.width = discCanvas.height = 32
  const ctx = discCanvas.getContext('2d')!
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(16, 16, 14, 0, Math.PI * 2); ctx.fill()
  const disc = new THREE.CanvasTexture(discCanvas)
  const pointMaterial = new THREE.PointsMaterial({ size: 0.023, map: disc, vertexColors: true, transparent: true, alphaTest: 0.1, depthWrite: false, sizeAttenuation: true })
  const points = new THREE.Points(pointGeometry, pointMaterial)
  points.frustumCulled = false
  root.add(points)

  // A continuous indigo filament survives every change in scale.
  const filamentGeometry = new THREE.BufferGeometry()
  const filamentPositions = new Float32Array(181 * 3)
  filamentGeometry.setAttribute('position', new THREE.BufferAttribute(filamentPositions, 3).setUsage(THREE.DynamicDrawUsage))
  const filamentMaterial = new THREE.LineBasicMaterial({ color: palette.indigo, transparent: true, opacity: 0.7 })
  const filament = new THREE.Line(filamentGeometry, filamentMaterial)
  filament.frustumCulled = false
  root.add(filament)

  function update(progress: number, pointerX = 0, pointerY = 0) {
    const state = sceneAt(progress)
    const { depth, separation, focus, fragment, field, immersion } = state
    const deep = smoothRange(0.58, 0.83, depth)
    if (scene.background instanceof THREE.Color) scene.background.copy(paperColor).lerp(inkColor, deep)
    root.position.set((compact || composition === 'story' ? 0 : 2.45) * (1 - focus), compact && composition === 'lab' ? -0.4 * (1 - focus) : 0, 0)
    root.rotation.set(0.21 * (1 - focus) + pointerY * 0.025 * (1 - immersion), -0.48 * (1 - focus) + field * 0.3 + pointerX * 0.035 * (1 - immersion), -0.1 * (1 - focus))
    const cameraZ = 14 + separation * 2.5 * (1 - focus) - focus * 3.5 - field * 3.6 - immersion * 5.4
    camera.position.set(0, 0, cameraZ + (compact || composition === 'story' ? 3.3 * (1 - field) : 0) + (composition === 'story' ? 2 * field * (1 - immersion) : 0))
    if (composition === 'story' && compact) camera.position.z *= 0.8
    camera.lookAt(0, 0, -immersion * 4)

    for (let i = 0; i < 6; i++) {
      const selected = i === 2
      const fadeOthers = selected ? 1 : 1 - smoothRange(0.34, 0.60, depth)
      const opacity = fadeOthers * (1 - smoothRange(0.44, 0.59, depth))
      papers[i].visible = opacity > 0.002
      papers[i].position.set((i - 2) * separation * 0.78 * (1 - focus), (i - 2) * separation * 0.22, (2 - i) * (0.085 + separation * 1.15))
      papers[i].rotation.set(0, (i - 2) * separation * 0.027, (i - 2) * separation * 0.018)
      paperMaterials[i].opacity = opacity
      paperMaterials[i].depthWrite = opacity > 0.98
      markMaterials[i * 2].opacity = opacity * 0.8
      markMaterials[i * 2 + 1].opacity = opacity * 0.7
    }

    tiles.visible = fragment > 0 && field < 0.999
    tileMaterial.opacity = smoothRange(0.43, 0.51, depth) * (1 - smoothRange(0.63, 0.79, depth))
    if (tiles.visible) {
      for (let i = 0; i < 768; i++) {
        const x = ((i % 24) / 23 - 0.5) * 3.6
        const y = (Math.floor(i / 24) / 31 - 0.5) * 4.6
        const wave = Math.sin(x * 2.1 + y * 1.7)
        dummy.position.set(x * (1 + fragment * 0.4), y * (1 + fragment * 0.4), wave * fragment * 0.7)
        dummy.rotation.set(fragment * wave * 0.36, fragment * Math.cos(i) * 0.5, fragment * Math.sin(i * 2) * 0.2)
        dummy.scale.setScalar(1 - field * 0.7)
        dummy.updateMatrix(); tiles.setMatrixAt(i, dummy.matrix)
      }
      tiles.instanceMatrix.needsUpdate = true
    }

    points.visible = depth > 0.46
    pointMaterial.opacity = smoothRange(0.46, 0.65, depth)
    pointMaterial.size = composition === 'story' ? (compact ? 0.034 : 0.032) : compact ? 0.028 : 0.022
    if (points.visible) {
      for (let i = 0; i < count; i++) {
        const j = i * 3
        const morph = smoothRange(seeds[i] * 0.24, 0.74 + seeds[i] * 0.26, field)
        for (let axis = 0; axis < 3; axis++) {
          const shaped = sheet[j + axis] + (knot[j + axis] - sheet[j + axis]) * morph
          positions[j + axis] = shaped + (tunnel[j + axis] - shaped) * immersion
        }
      }
      pointGeometry.attributes.position.needsUpdate = true
    }

    for (let n = 0; n <= 180; n++) {
      const t = n / 180
      const u = t * Math.PI * 2
      const ring = 1.65 + 0.55 * Math.cos(3 * u)
      const sheetX = (t - 0.5) * 5.1
      const sheetY = Math.sin(t * Math.PI * 3) * 0.8
      const knotX = Math.cos(2 * u) * ring
      const knotY = Math.sin(2 * u) * ring
      const knotZ = Math.sin(3 * u) * 0.85
      const z = 3 - t * 18
      const tunnelX = Math.cos(u + z * 0.44) * 1.3
      const tunnelY = Math.sin(u + z * 0.44) * 1.3
      const j = n * 3
      filamentPositions[j] = THREE.MathUtils.lerp(THREE.MathUtils.lerp(sheetX, knotX, field), tunnelX, immersion)
      filamentPositions[j + 1] = THREE.MathUtils.lerp(THREE.MathUtils.lerp(sheetY, knotY, field), tunnelY, immersion)
      filamentPositions[j + 2] = THREE.MathUtils.lerp(THREE.MathUtils.lerp(2.2 * (1 - focus), knotZ, field), z, immersion)
    }
    filamentGeometry.attributes.position.needsUpdate = true
    filamentMaterial.color.copy(indigo).lerp(lightInk, deep * 0.45)
    filamentMaterial.opacity = 0.64 - immersion * 0.3
    return state
  }

  function dispose() {
    const geometries = new Set<THREE.BufferGeometry>()
    const materials = new Set<THREE.Material>()
    scene.traverse(object => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
        geometries.add(object.geometry)
        const material = object.material
        if (Array.isArray(material)) material.forEach(m => materials.add(m)); else materials.add(material)
      }
    })
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); disc.dispose()
  }
  return { scene, camera, update, dispose, particleCount: count }
}

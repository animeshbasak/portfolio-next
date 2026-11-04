import * as THREE from 'three'
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js'

// One original architectural letter, seen from five angles in one continuous space.
// All artwork is procedural; no reference-site models, textures or source are reused.
export function createWorld(renderer: THREE.WebGLRenderer, compact: boolean) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(37, 1, .1, 100)
  const geometries = new Set<THREE.BufferGeometry>()
  const materials = new Set<THREE.Material>()
  const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Object3D = scene) => {
    geometries.add(geometry); materials.add(material)
    const object = new THREE.Mesh(geometry, material)
    object.castShadow = true; object.receiveShadow = true; parent.add(object)
    return object
  }
  const generator = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const environment = generator.fromScene(room, .05)
  scene.environment = environment.texture
  room.dispose(); generator.dispose()

  const porcelain = new THREE.MeshPhysicalMaterial({color: '#c6c5bc', roughness: .34, metalness: .24, clearcoat: .75, clearcoatRoughness: .23})
  const edge = new THREE.MeshPhysicalMaterial({color: '#737b77', roughness: .3, metalness: .7, clearcoat: .6})
  const inlay = new THREE.MeshStandardMaterial({color: '#94394b', roughness: .32, metalness: .65, emissive: '#3d111c', emissiveIntensity: .12})
  const floor = new THREE.MeshStandardMaterial({color: '#c9c9c0', roughness: .88, metalness: .06})

  const hemisphere = new THREE.HemisphereLight('#f6f1e5', '#53574e', 1.1)
  scene.add(hemisphere)
  const key = new THREE.DirectionalLight('#fff8e8', 4.4)
  key.position.set(-8, 15, 9); key.castShadow = true
  key.shadow.mapSize.set(compact ? 1024 : 2048, compact ? 1024 : 2048)
  Object.assign(key.shadow.camera, {left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 45})
  key.shadow.normalBias = .035; key.shadow.bias = -.0001
  key.target.position.set(0, 2.6, 0); scene.add(key, key.target)
  const rim = new THREE.DirectionalLight('#e0e9ee', 2.7)
  rim.position.set(4, 8, -6); scene.add(rim)
  const fill = new THREE.DirectionalLight('#b9c7c6', .6)
  fill.position.set(8, 3, 10); scene.add(fill)

  const ground = mesh(new THREE.PlaneGeometry(160, 160), floor)
  ground.rotation.x = -Math.PI / 2; ground.position.y = -.065; ground.castShadow = false

  const identity = new THREE.Group(); scene.add(identity)
  const outline = new THREE.Shape()
  outline.moveTo(-2.8, 0); outline.lineTo(-.76, 7.05); outline.lineTo(.76, 7.05)
  outline.lineTo(2.8, 0); outline.lineTo(1.39, 0); outline.lineTo(.8, 1.93)
  outline.lineTo(-.8, 1.93); outline.lineTo(-1.39, 0); outline.closePath()
  const opening = new THREE.Path()
  opening.moveTo(-.51, 3.27); opening.lineTo(.51, 3.27); opening.lineTo(0, 5.25); opening.closePath()
  outline.holes.push(opening)
  // Five structural layers echo a career built across five organisations.
  // The seams are geometry, so the depth remains visible without continuous animation.
  const slab = new THREE.ExtrudeGeometry(outline, {depth: .24, bevelEnabled: true, bevelSegments: 3, bevelSize: .045, bevelThickness: .025, steps: 1, curveSegments: 4})
  const layers: THREE.Mesh[] = []
  for (let i = 0; i < 5; i++) {
    const layer = mesh(slab, i === 1 ? edge : porcelain, identity)
    layer.position.z = -.84 + i * .39
    layers.push(layer)
  }
  const seam = new THREE.ExtrudeGeometry(outline, {depth: .045, bevelEnabled: false, steps: 1, curveSegments: 4})
  const redSeam = mesh(seam, inlay, identity)
  redSeam.position.z = .30
  identity.rotation.y = -.12

  const fog = new THREE.FogExp2('#dedfd7', .024)
  scene.fog = fog; scene.background = new THREE.Color('#dedfd7')
  const positions = [
    new THREE.Vector3(9, 5.8, 17.3),
    new THREE.Vector3(10.6, 5.4, 16.4),
    new THREE.Vector3(12.2, 5.5, 15.5),
    new THREE.Vector3(10.2, 6.4, 17),
    new THREE.Vector3(8.5, 5.8, 18.2),
  ]
  const targets = [
    new THREE.Vector3(-4.8, 3.1, 0),
    new THREE.Vector3(-5.2, 3.1, 0),
    new THREE.Vector3(-5.6, 3, 0),
    new THREE.Vector3(-5.1, 3, 0),
    new THREE.Vector3(-4.8, 3.1, 0),
  ]
  const viewTarget = new THREE.Vector3()
  let previousDark: boolean | null = null
  function palette(dark: boolean) {
    if (previousDark === dark) return
    previousDark = dark
    const background = dark ? '#141b1c' : '#dedfd7'
    ;(scene.background as THREE.Color).set(background); fog.color.set(background)
    porcelain.color.set(dark ? '#99a7a5' : '#8b928e')
    edge.color.set(dark ? '#435a5b' : '#6e7977')
    floor.color.set(dark ? '#192326' : '#c9c9c0')
    inlay.color.set(dark ? '#9b4e60' : '#94394b')
    hemisphere.color.set(dark ? '#c5d7de' : '#f6f1e5')
    hemisphere.groundColor.set(dark ? '#111a1c' : '#53574e')
    hemisphere.intensity = dark ? .6 : .95
    key.color.set(dark ? '#d9e5ec' : '#fff8e8'); key.intensity = dark ? 3.8 : 4.1
    rim.color.set(dark ? '#abc9d0' : '#e0e9ee'); rim.intensity = dark ? 3.2 : 2.2
    fill.intensity = dark ? .8 : .6
    scene.environmentIntensity = dark ? .38 : .52
    renderer.toneMappingExposure = dark ? .94 : .88
  }
  function update(progress: number, _elapsed: number, mobile: boolean, pointerX: number, pointerY: number) {
    const bounded = THREE.MathUtils.clamp(progress, 0, 4)
    const index = Math.min(3, Math.floor(bounded))
    const amount = THREE.MathUtils.smoothstep(bounded - index, 0, 1)
    const openings = [0, .25, .38, .16, 0]
    const openness = THREE.MathUtils.lerp(openings[index], openings[index + 1], amount)
    const scales = [1, .84, .84, .86, 1]
    identity.scale.setScalar(THREE.MathUtils.lerp(scales[index], scales[index + 1], amount))
    layers.forEach((layer, layerIndex) => { layer.position.z = (layerIndex - 2) * (.39 + openness) })
    redSeam.position.z = (.39 + openness) * .5
    camera.position.lerpVectors(positions[index], positions[index + 1], amount)
    viewTarget.lerpVectors(targets[index], targets[index + 1], amount)
    if (mobile) {
      camera.position.set(8 + bounded * .3, 5.5, 17)
      viewTarget.set(-1.8, 3.5, 0)
    }
    camera.position.x += pointerX * .16; camera.position.y += pointerY * .10
    camera.lookAt(viewTarget)
    camera.fov = mobile ? 40 : 37
    camera.updateProjectionMatrix()
  }
  return {scene, camera, palette, update, dispose() {
    geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose())
    environment.dispose(); key.shadow.dispose(); scene.clear()
  }}
}

import test from 'node:test'
import assert from 'node:assert/strict'
import { sceneAt, smoothRange, chapterAt } from '../components/design-system/motion/timeline.ts'

test('the loop closes with exactly the same scene state', () => {
  assert.deepEqual(sceneAt(0), sceneAt(1))
})

test('inward and outward travel reconstruct the same depth state', () => {
  for (let i = 0; i <= 100; i++) {
    const rawDepth = i / 100
    const inward = sceneAt(rawDepth * 0.64)
    const outward = sceneAt(0.64 + (1 - rawDepth) * 0.36)
    for (const key of Object.keys(inward)) assert.ok(Math.abs(inward[key] - outward[key]) < 1e-12, key)
  }
})

test('the deepest point reaches particles and immersion', () => {
  const state = sceneAt(0.64)
  assert.equal(state.depth, 1)
  assert.equal(state.field, 1)
  assert.equal(state.immersion, 1)
})

test('every scene value is finite and bounded, including invalid scroll input', () => {
  for (const p of [NaN, Infinity, -Infinity, -1, 2, ...Array.from({ length: 1001 }, (_, i) => i / 1000)]) {
    for (const value of Object.values(sceneAt(p))) assert.ok(Number.isFinite(value) && value >= 0 && value <= 1)
  }
})

test('sampling in a different order produces an identical state', () => {
  const before = sceneAt(0.44)
  sceneAt(0.1); sceneAt(0.95); sceneAt(0.64)
  assert.deepEqual(sceneAt(0.44), before)
})

test('chapter and easing boundaries remain defined', () => {
  assert.equal(chapterAt(0), 0)
  assert.equal(chapterAt(1), 5)
  assert.equal(smoothRange(0.2, 0.8, 0), 0)
  assert.equal(smoothRange(0.2, 0.8, 1), 1)
})

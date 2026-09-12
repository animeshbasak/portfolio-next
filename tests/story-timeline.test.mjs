import test from 'node:test'
import assert from 'node:assert/strict'
import { storyProgressAt } from '../components/design-system/motion/timeline.ts'
const anchors = [{top:0,progress:0},{top:1000,progress:0.2},{top:2000,progress:0.64},{top:4000,progress:1}]
test('each real content anchor selects its authored scene', () => {
  for (const anchor of anchors) assert.equal(storyProgressAt(anchor.top, anchors), anchor.progress)
})
test('different section heights determine pace without changing scene endpoints', () => {
  assert.equal(storyProgressAt(1500, anchors), 0.42000000000000004)
  const resized = anchors.map(a => ({...a,top:a.top*2}))
  assert.equal(storyProgressAt(3000,resized), storyProgressAt(1500,anchors))
})
test('reverse scrolling retraces the same content states', () => {
  const positions = [0,500,1400,2300,4000]
  const forward = positions.map(p => storyProgressAt(p,anchors))
  assert.deepEqual(positions.reverse().map(p => storyProgressAt(p,anchors)).reverse(),forward)
})
test('empty and out-of-range documents have bounded results', () => {
  assert.equal(storyProgressAt(100,[]),0)
  assert.equal(storyProgressAt(-100,anchors),0)
  assert.equal(storyProgressAt(5000,anchors),1)
})

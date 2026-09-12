export function clamp01(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0
}

export function smoothRange(start: number, end: number, value: number) {
  const t = clamp01((value - start) / (end - start))
  return t * t * (3 - 2 * t)
}

/** A closed, reversible journey. No elapsed time or accumulated simulation state. */
export function sceneAt(progress: number) {
  const p = clamp01(progress)
  const rawDepth = p <= 0.64 ? p / 0.64 : (1 - p) / 0.36
  const depth = smoothRange(0, 1, rawDepth)
  return {
    depth,
    separation: smoothRange(0.025, 0.32, depth),
    focus: smoothRange(0.26, 0.57, depth),
    fragment: smoothRange(0.42, 0.65, depth),
    field: smoothRange(0.56, 0.85, depth),
    immersion: smoothRange(0.85, 1, depth),
  }
}

export const chapters = [
  { at: 0, label: 'Surface', title: 'There is always\nmore beneath.', body: 'An idea becomes an interface. Scroll to look inside.', scale: '01:01' },
  { at: 0.19, label: 'Layers', title: 'Give every layer\nroom to speak.', body: 'One object. Six perspectives. The space between them is part of the story.', scale: '01:06' },
  { at: 0.34, label: 'Structure', title: 'The smaller things\nhold it together.', body: 'Go past the surface. Find the relationships that make it work.', scale: '01:768' },
  { at: 0.50, label: 'Particles', title: 'Follow a thought\nall the way in.', body: 'The structure becomes a field. The same thread is still here.', scale: '01:∞' },
  { at: 0.64, label: 'Within', title: 'A world inside\na single detail.', body: 'Keep scrolling to bring it back. Reverse at any moment to retrace your path.', scale: '∞:01' },
  { at: 1, label: 'Rebuilt', title: 'Back to the whole.\nWith a different eye.', body: 'Every fragment returns to its place. The next journey begins here.', scale: '01:01' },
] as const

export function chapterAt(progress: number) {
  const p = clamp01(progress)
  if (p >= 0.93) return 5
  if (p >= 0.59 && p < 0.72) return 4
  const d = sceneAt(p).depth
  if (d >= 0.75) return 3
  if (d >= 0.45) return 2
  if (d >= 0.13) return 1
  return 0
}


export type StoryAnchor = { top: number; progress: number }

/** Content positions, not an artificial hero runway, determine each scene. */
export function storyProgressAt(position: number, anchors: readonly StoryAnchor[]) {
  if (!anchors.length) return 0
  if (position <= anchors[0].top) return clamp01(anchors[0].progress)
  for (let i = 1; i < anchors.length; i++) {
    if (position <= anchors[i].top) {
      const from = anchors[i - 1], to = anchors[i]
      const fraction = clamp01((position - from.top) / Math.max(1, to.top - from.top))
      return clamp01(from.progress + (to.progress - from.progress) * fraction)
    }
  }
  return clamp01(anchors[anchors.length - 1].progress)
}

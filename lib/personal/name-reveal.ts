// The legacy reveal: 400ms lead-in, 90ms letter stagger, then the second row.
export const NAME_ROWS = ['ANIMESH', 'BASAK'] as const
export const NAME_REVEAL_DURATION = 2620
export type NamePhase = 'hidden' | 'scrambling' | 'flash' | 'done'
export function namePhase(row: number, index: number, elapsed: number): NamePhase {
  const age = elapsed - (row === 0 ? 400 : 1660) - index * 90
  if (age < 0) return 'hidden'
  if (age < 400) return 'scrambling'
  if (age < 580) return 'flash'
  return 'done'
}

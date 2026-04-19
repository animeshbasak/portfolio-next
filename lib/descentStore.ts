type Listener = (v: number) => void

let current = 0
const listeners = new Set<Listener>()

export const descentStore = {
  get: () => current,
  set: (v: number) => {
    const clamped = Math.max(0, Math.min(1, v))
    if (clamped === current) return
    current = clamped
    listeners.forEach((l) => l(clamped))
  },
  subscribe: (l: Listener) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

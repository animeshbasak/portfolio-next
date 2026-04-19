'use client'

type Listener = (muted: boolean) => void

class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private osc1: OscillatorNode | null = null
  private osc2: OscillatorNode | null = null
  private lfo: OscillatorNode | null = null
  private lfoGain: GainNode | null = null
  private filter: BiquadFilterNode | null = null
  private started = false
  private muted = true
  private listeners: Set<Listener> = new Set()

  private init() {
    if (this.ctx) return
    const Ctx =
      (window.AudioContext as typeof AudioContext) ||
      ((window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext as typeof AudioContext)
    if (!Ctx) return
    this.ctx = new Ctx()

    this.master = this.ctx.createGain()
    this.master.gain.value = 0

    this.filter = this.ctx.createBiquadFilter()
    this.filter.type = 'lowpass'
    this.filter.frequency.value = 420
    this.filter.Q.value = 3

    this.osc1 = this.ctx.createOscillator()
    this.osc1.type = 'sawtooth'
    this.osc1.frequency.value = 55

    this.osc2 = this.ctx.createOscillator()
    this.osc2.type = 'sine'
    this.osc2.frequency.value = 82.5

    this.lfo = this.ctx.createOscillator()
    this.lfo.frequency.value = 0.12
    this.lfoGain = this.ctx.createGain()
    this.lfoGain.gain.value = 0.012

    this.lfo.connect(this.lfoGain)
    this.lfoGain.connect(this.master.gain)

    this.osc1.connect(this.filter)
    this.osc2.connect(this.filter)
    this.filter.connect(this.master)
    this.master.connect(this.ctx.destination)

    this.osc1.start()
    this.osc2.start()
    this.lfo.start()
    this.started = true
  }

  async toggle() {
    this.init()
    if (!this.ctx || !this.master) return
    if (this.ctx.state === 'suspended') await this.ctx.resume()

    this.muted = !this.muted
    const target = this.muted ? 0 : 0.055
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    this.master.gain.linearRampToValueAtTime(target, now + 1.2)

    this.listeners.forEach((l) => l(this.muted))
  }

  stinger(freq = 880, duration = 0.12) {
    if (!this.ctx || !this.started || this.muted) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0, this.ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + duration)
  }

  isMuted() {
    return this.muted
  }

  subscribe(l: Listener) {
    this.listeners.add(l)
    return () => this.listeners.delete(l)
  }
}

export const audioEngine = typeof window !== 'undefined' ? new AudioEngine() : null

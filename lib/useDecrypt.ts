'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%'
const CYCLES = 10
const CYCLE_INTERVAL = 40

interface DecryptOptions {
  text: string
  delay: number
  letterStagger: number
}

export function useDecrypt({ text, delay, letterStagger }: DecryptOptions) {
  const [displayLetters, setDisplayLetters] = useState<string[]>(
    text.split('').map(() => ' ')
  )
  const [phases, setPhases] = useState<('hidden' | 'scrambling' | 'flash' | 'done')[]>(
    text.split('').map(() => 'hidden')
  )
  const [isComplete, setIsComplete] = useState(false)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([])

  const start = useCallback(() => {
    const letters = text.split('')

    letters.forEach((letter, i) => {
      const startTime = delay + i * letterStagger

      // Start scrambling
      const t1 = setTimeout(() => {
        setPhases((prev) => {
          const next = [...prev]
          next[i] = 'scrambling'
          return next
        })

        let count = 0
        const interval = setInterval(() => {
          setDisplayLetters((prev) => {
            const next = [...prev]
            next[i] = CHARS[Math.floor(Math.random() * CHARS.length)]
            return next
          })
          count++
          if (count >= CYCLES) {
            clearInterval(interval)

            // Flash red → lock
            setDisplayLetters((prev) => {
              const next = [...prev]
              next[i] = letter
              return next
            })
            setPhases((prev) => {
              const next = [...prev]
              next[i] = 'flash'
              return next
            })

            const t3 = setTimeout(() => {
              setPhases((prev) => {
                const next = [...prev]
                next[i] = 'done'
                return next
              })
            }, 180)
            timeoutsRef.current.push(t3)
          }
        }, CYCLE_INTERVAL)
        intervalsRef.current.push(interval)
      }, startTime)
      timeoutsRef.current.push(t1)
    })

    // Set complete after all letters finish
    const totalTime = delay + (letters.length - 1) * letterStagger + CYCLES * CYCLE_INTERVAL + 200
    const t4 = setTimeout(() => {
      setIsComplete(true)
    }, totalTime)
    timeoutsRef.current.push(t4)
  }, [text, delay, letterStagger])

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout)
      intervalsRef.current.forEach(clearInterval)
    }
  }, [])

  return { displayLetters, phases, isComplete, start }
}

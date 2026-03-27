'use client'

import { useEffect, useRef } from 'react'
import styles from './Cursor.module.css'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top = `${e.clientY}px`
      }
    }

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.08
      ring.current.y += (mouse.current.y - ring.current.y) * 0.08

      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`
        ringRef.current.style.top = `${ring.current.y}px`
      }

      requestAnimationFrame(animate)
    }

    // Hover detection
    const addHov = () => document.body.classList.add('hov')
    const removeHov = () => document.body.classList.remove('hov')

    const attachHoverListeners = () => {
      const elements = document.querySelectorAll('a, button, [data-hover]')
      elements.forEach((el) => {
        el.addEventListener('mouseenter', addHov)
        el.addEventListener('mouseleave', removeHov)
      })
      return elements
    }

    window.addEventListener('mousemove', handleMouseMove)
    const raf = requestAnimationFrame(animate)

    // Attach hover listeners with a slight delay and MutationObserver for dynamic content
    let elements: NodeListOf<Element>
    const timeout = setTimeout(() => {
      elements = attachHoverListeners()
    }, 500)

    const observer = new MutationObserver(() => {
      if (elements) {
        elements.forEach((el) => {
          el.removeEventListener('mouseenter', addHov)
          el.removeEventListener('mouseleave', removeHov)
        })
      }
      elements = attachHoverListeners()
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(raf)
      clearTimeout(timeout)
      observer.disconnect()
      if (elements) {
        elements.forEach((el) => {
          el.removeEventListener('mouseenter', addHov)
          el.removeEventListener('mouseleave', removeHov)
        })
      }
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className={styles['cursor-dot']} />
      <div ref={ringRef} className={styles['cursor-ring']} />
    </>
  )
}

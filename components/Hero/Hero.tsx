'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, fadeIn } from '@lib/motion'
import ParticlesCanvas from './ParticlesCanvas'
import DecryptName from './DecryptName'
import styles from './Hero.module.css'

const STATS = [
  { number: '150M+', label: 'Users at scale' },
  { number: '7+', label: 'Years active' },
  { number: '3', label: 'Live AI products' },
  { number: '5', label: 'Platforms built' },
]

export default function Hero() {
  const [decryptStatus, setDecryptStatus] = useState<'decrypting' | 'decrypted'>('decrypting')
  const [dots, setDots] = useState('')
  const [showRole, setShowRole] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showLower, setShowLower] = useState(false)
  const [clock, setClock] = useState('')

  // Animated dots
  useEffect(() => {
    if (decryptStatus === 'decrypted') return
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'))
    }, 400)
    return () => clearInterval(interval)
  }, [decryptStatus])

  // Live clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      setClock(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }
    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleDecryptComplete = useCallback(() => {
    setDecryptStatus('decrypted')
    setTimeout(() => setShowRole(true), 200)
    setTimeout(() => setShowStats(true), 400)
    setTimeout(() => setShowLower(true), 600)
  }, [])

  return (
    <section className={styles.hero}>
      <ParticlesCanvas />

      {/* Scan Sweep */}
      <div className={styles['scan-sweep']} />

      {/* HUD Corners */}
      <div className={styles['hud-corners']}>
        <div className={`${styles.corner} ${styles['corner-tl']}`} />
        <div className={`${styles.corner} ${styles['corner-tr']}`} />
        <div className={`${styles.corner} ${styles['corner-bl']}`} />
        <div className={`${styles.corner} ${styles['corner-br']}`} />
      </div>

      {/* Decorative Floating Theme Particles */}
      <div className={styles['decor-particles']} aria-hidden="true">
        <span className={styles['decor-plus']} style={{ top: '15%', left: '8%' }}>+</span>
        <span className={styles['decor-plus']} style={{ top: '70%', left: '4%' }}>+</span>
        <span className={styles['decor-plus']} style={{ top: '25%', right: '12%' }}>+</span>
        <span className={styles['decor-plus']} style={{ top: '65%', right: '7%' }}>+</span>
        <span className={styles['decor-dot']} style={{ top: '45%', right: '22%' }}>●</span>
        <span className={styles['decor-dot']} style={{ top: '85%', left: '18%' }}>●</span>
        <span className={styles['decor-dot']} style={{ top: '12%', right: '35%' }}>●</span>
        <div className={styles['decor-cross']} style={{ top: '55%', left: '15%' }} />
      </div>

      {/* HUD Info */}
      <div className={styles['hud-info']}>
        <div>28°36′N 77°12′E</div>
        <div>NEW DELHI, INDIA</div>
        <div>{clock} IST</div>
      </div>

      {/* Hero Content */}
      <div className={styles.content}>
        {/* File Row */}
        <div className={styles['file-row']}>
          <span className={styles['classified-tag']}>CLASSIFIED</span>
          <span className={styles['file-id']}>FILE_ID: AB-ENG-2026-001</span>
          <span className={styles['file-divider']} />
          <span
            className={`${styles['file-status']} ${decryptStatus === 'decrypted' ? styles.decrypted : ''}`}
          >
            {decryptStatus === 'decrypted' ? 'DECRYPTED ✓' : `DECRYPTING${dots}`}
          </span>
        </div>

        {/* Decrypt Name */}
        <DecryptName onComplete={handleDecryptComplete} />

        {/* Role Line */}
        {showRole && (
          <motion.div
            className={styles['role-line']}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            Lead Frontend Engineer
            <span className={styles['role-sep']}>◈</span>
            7+ Years
            <span className={styles['role-sep']}>◈</span>
            150M+ Scale
            <span className={styles['role-sep']}>◈</span>
            AI Native
          </motion.div>
        )}

        {/* Stats Row */}
        {showStats && (
          <motion.div
            className={styles['stats-row']}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className={styles['stat-cell']} data-hover>
                <div className={styles['stat-number']}>{stat.number}</div>
                <div className={styles['stat-label']}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Hero Lower */}
        {showLower && (
          <motion.div
            className={styles['hero-lower']}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <div className={styles['cta-group']}>
              <a href="#projects" className="btn-red" data-hover>
                Access Lab
              </a>
              <a
                href="/Animesh_Basak_Resume_2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
                data-hover
              >
                View Resume ↗
              </a>
            </div>

            <div className={styles['social-strip']}>
              <a
                href="https://github.com/animeshbasak"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['social-link']}
                data-hover
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/animeshbasak"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['social-link']}
                data-hover
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
              <a
                href="https://x.com/animeshsbasak"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['social-link']}
                data-hover
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X
              </a>
              <a
                href="https://instagram.com/insanemesh.ai"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['social-link']}
                data-hover
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                insanemesh
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

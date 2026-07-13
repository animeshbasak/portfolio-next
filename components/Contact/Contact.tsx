'use client'

import { useEffect, useState } from 'react'
import styles from './Contact.module.css'

const CHANNELS = [
  { k: 'EMAIL', v: 'animeshsbasak@gmail.com', url: 'mailto:animeshsbasak@gmail.com' },
  { k: 'LINKEDIN', v: 'in/animeshbasak', url: 'https://linkedin.com/in/animeshbasak' },
  { k: 'GITHUB', v: 'animeshbasak', url: 'https://github.com/animeshbasak' },
  { k: 'WHATSAPP', v: '+91 99713 40719', url: 'https://wa.me/919971340719' },
  { k: 'X / TWITTER', v: 'animeshsbasak', url: 'https://x.com/animeshsbasak' },
  { k: 'INSTAGRAM', v: 'insanemesh.ai', url: 'https://instagram.com/insanemesh.ai' },
]

export default function Contact() {
  const [clock, setClock] = useState('--:--:--')

  useEffect(() => {
    const tick = () => {
      try {
        setClock(
          new Date().toLocaleTimeString('en-GB', {
            timeZone: 'Asia/Kolkata',
            hour12: false,
          })
        )
      } catch {
        /* keep placeholder */
      }
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={styles.headNum}>(05)</span>
          <span className={styles.headTitle}>CONTACT</span>
          <span className={styles.spacer} />
          <span className={styles.headHint}>
            <span className={styles.pulse} />
            REPLIES WITHIN 24H
          </span>
        </div>

        <a href="mailto:animeshsbasak@gmail.com" data-cur="EMAIL" className={styles.big}>
          <span className={styles.bigLine}>LET&apos;S</span>
          <span className={styles.bigLine}>
            TALK<span className={styles.bigDot}>.</span>
          </span>
        </a>

        <div className={styles.ctaRow}>
          <p className={styles.pitch}>
            Open to <strong>Senior / Lead / Staff</strong> frontend roles — IC or IC +
            tech-lead. Remote India or Delhi NCR. Real scale or real AI preferred; both
            is the dream.
          </p>
          <div className={styles.ctas}>
            <a
              href="mailto:animeshsbasak@gmail.com"
              data-cur="SEND"
              className={styles.ctaSolid}
            >
              EMAIL ME ↗
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              data-cur="PDF"
              className={styles.ctaGhost}
            >
              RESUME ↗
            </a>
          </div>
        </div>

        <div className={styles.channels}>
          {CHANNELS.map((ch) => (
            <a
              key={ch.k}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cur="OPEN"
              className={styles.channel}
            >
              <span className={styles.channelKey}>{ch.k}</span>
              <span className={styles.channelValue}>{ch.v} ↗</span>
            </a>
          ))}
        </div>

        <div className={styles.footerStrip}>
          <span>© 2026 ANIMESH BASAK</span>
          <span>
            <span suppressHydrationWarning>{clock}</span> IST — NEW DELHI
          </span>
          <span>DESIGNED IN THE BROWSER, SHIPPED WITHOUT EXCUSES</span>
        </div>
      </div>
    </section>
  )
}

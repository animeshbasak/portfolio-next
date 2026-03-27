'use client'

import { motion } from 'framer-motion'
import { fadeUp } from '@lib/motion'
import ContactForm from './ContactForm'
import styles from './Contact.module.css'

const SOCIAL_LINKS = [
  { index: '01', label: 'Email', value: 'animeshsbasak@gmail.com', href: 'mailto:animeshsbasak@gmail.com' },
  { index: '02', label: 'WhatsApp', value: 'wa.me/919971340719', href: 'https://wa.me/919971340719' },
  { index: '03', label: 'LinkedIn', value: 'linkedin.com/in/animesh-basak', href: 'https://linkedin.com/in/animesh-basak' },
  { index: '04', label: 'GitHub', value: 'github.com/animeshbasak-14', href: 'https://github.com/animeshbasak-14' },
  { index: '05', label: 'Twitter', value: 'twitter.com/animeshbasak', href: 'https://twitter.com/animeshbasak' },
  { index: '06', label: 'Instagram', value: 'instagram.com/insanemesh.ai', href: 'https://instagram.com/insanemesh.ai' },
]

export default function Contact() {
  return (
    <section id="contact" className={styles.contact}>
      <div className="section-label">
        <span className="num">04</span>
        <span>——</span>
        <span>OPEN CHANNEL</span>
        <span className="line" />
        <span className="tag">[ENCRYPTED]</span>
      </div>

      <motion.div
        className={styles.outer}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className={styles['pseudo-label']}>
          TRANSMISSION OPEN // AWAITING SIGNAL
        </div>

        <div className={styles.grid}>
          {/* ── Left Column ── */}
          <div className={styles.left}>
            <div className={styles.tag}>TRANSMISSION OPEN</div>

            <div className={styles.heading}>
              LET&apos;S BUILD<br />
              SOMETHING<br />
              THAT BREAKS<br />
              THE SCALE.
            </div>

            <div className={styles.subtext}>
              Open to <strong>Staff / Principal / Engineering Manager</strong> roles. Remote India or Delhi NCR. If you&apos;re building at real scale with real craft — this channel is open.
            </div>

            <div className={styles['cta-row']}>
              <a href="#contact-form" className="btn-red" data-hover>
                Transmit Message
              </a>
              <a
                href="/Animesh_Basak_Resume_2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
                data-hover
              >
                Download Resume ↗
              </a>
            </div>

            <div className={styles['social-list']}>
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['social-item']}
                  data-hover
                >
                  <span className={styles['social-index']}>[{link.index}]</span>
                  <span className={styles['social-label']}>{link.label}</span>
                  <span className={styles['social-value']}>{link.value}</span>
                  <span className={styles['social-arrow']}>→</span>
                </a>
              ))}
            </div>
          </div>

          {/* ── Right Column: Form ── */}
          <ContactForm />
        </div>
      </motion.div>
    </section>
  )
}

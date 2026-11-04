'use client'

import { motion } from 'framer-motion'
import { fadeUp } from '@lib/motion'
import ContactForm from './ContactForm'
import styles from './Contact.module.css'

const SOCIAL_LINKS = [
  { index: '01', label: 'Email', value: 'animeshsbasak@gmail.com', href: 'mailto:animeshsbasak@gmail.com' },
  { index: '02', label: 'WhatsApp', value: 'wa.me/919971340719', href: 'https://wa.me/919971340719' },
  { index: '03', label: 'LinkedIn', value: 'linkedin.com/in/animeshbasak', href: 'https://linkedin.com/in/animeshbasak' },
  { index: '04', label: 'GitHub', value: 'github.com/animeshbasak', href: 'https://github.com/animeshbasak' },
  { index: '05', label: 'X', value: 'x.com/animeshsbasak', href: 'https://x.com/animeshsbasak' },
]

export default function Contact() {
  return (
    <section id="contact" className={styles.contact}>
      <div className="section-label">
        <span className="num">04</span>
        <span>——</span>
        <span>OPEN CHANNEL</span>
        <span className="line" />
        <span className="tag">[OPEN LINE]</span>
      </div>

      <motion.div
        className={styles.outer}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className={styles['pseudo-label']}>
          CHANNEL OPEN // ROLES AND PROJECTS
        </div>

        <div className={styles.grid}>
          {/* ── Left Column ── */}
          <div className={styles.left}>
            <div className={styles.tag}>CHANNEL IS OPEN</div>

            <div className={styles.heading}>
              HAVE A<br />
              FRONTEND ROLE<br />
              OR A PROJECT<br />
              IN MIND?
            </div>

            <div className={styles.subtext}>
              Open to <strong>Lead, Staff or Senior Frontend</strong> roles, as an IC or an IC plus tech lead, in Delhi NCR or remote within India. Tell me about your product, the team and the frontend work you need someone to own.
              <br /><br />
              <strong>Remote, part-time freelance:</strong> an audit and rescue, one focused feature, or components your team reuses. 10 to 12 hours a week after office hours IST. A short call, an agreed scope and quote, weekly checkpoints, then handover.
            </div>

            <div className={styles['cta-row']}>
              <a href="#contact-form" className="btn-red" data-hover>
                Send a Message
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
                data-hover
              >
                Download Résumé ↗
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

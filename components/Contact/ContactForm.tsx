'use client'

import { useState, useCallback } from 'react'
import type { ContactFormData, ContactFormState } from '../../types/contact'
import styles from './Contact.module.css'

const OPPORTUNITY_TYPES = [
  'Full-time Role',
  'Contract / Freelance',
  'Collaboration',
  'Just saying hi',
]

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
    opportunityType: '',
  })

  const [state, setState] = useState<ContactFormState>({
    status: 'idle',
    errors: {},
  })

  const validate = useCallback((): boolean => {
    const errors: Partial<Record<keyof ContactFormData, string>> = {}

    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email format'
    }
    if (!formData.message.trim()) errors.message = 'Message is required'
    if (!formData.opportunityType) errors.opportunityType = 'Select an opportunity type'

    setState((prev) => ({ ...prev, errors }))
    return Object.keys(errors).length === 0
  }, [formData])

  const handleWhatsApp = useCallback(() => {
    if (!validate()) return

    const text = `Hi Animesh,

*Name:* ${formData.name}
*Email:* ${formData.email}
*Opportunity:* ${formData.opportunityType}

*Message:*
${formData.message}`

    const url = `https://wa.me/919971340719?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')

    setState({ status: 'success', errors: {} })

    setTimeout(() => {
      setFormData({ name: '', email: '', message: '', opportunityType: '' })
      setState({ status: 'idle', errors: {} })
    }, 4000)
  }, [formData, validate])

  const handleChange = useCallback(
    (field: keyof ContactFormData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }))
        if (state.errors[field]) {
          setState((prev) => {
            const errors = { ...prev.errors }
            delete errors[field]
            return { ...prev, errors }
          })
        }
      },
    [state.errors]
  )

  const getButtonText = () => {
    switch (state.status) {
      case 'success':
        return 'REDIRECTED TO WHATSAPP ✓'
      default:
        return 'SEND VIA WHATSAPP'
    }
  }

  const getButtonClass = () => {
    const classes = [styles['submit-btn'], styles['whatsapp-btn']]
    if (state.status === 'success') classes.push(styles.success)
    return classes.join(' ')
  }

  return (
    <div className={styles.right}>
      <div className={styles['form-group']}>
        <label className={styles.label}>Name</label>
        <input
          type="text"
          className={`${styles.input} ${state.errors.name ? styles.error : ''}`}
          value={formData.name}
          onChange={handleChange('name')}
          placeholder="Your name"
        />
        {state.errors.name && <div className={styles['error-text']}>{state.errors.name}</div>}
      </div>

      <div className={styles['form-group']}>
        <label className={styles.label}>Email</label>
        <input
          type="email"
          className={`${styles.input} ${state.errors.email ? styles.error : ''}`}
          value={formData.email}
          onChange={handleChange('email')}
          placeholder="your@email.com"
        />
        {state.errors.email && <div className={styles['error-text']}>{state.errors.email}</div>}
      </div>

      <div className={styles['form-group']}>
        <label className={styles.label}>Message</label>
        <textarea
          className={`${styles.textarea} ${state.errors.message ? styles.error : ''}`}
          value={formData.message}
          onChange={handleChange('message')}
          rows={5}
          placeholder="Your message..."
        />
        {state.errors.message && (
          <div className={styles['error-text']}>{state.errors.message}</div>
        )}
      </div>

      <div className={styles['form-group']}>
        <label className={styles.label}>Opportunity Type</label>
        <select
          className={`${styles.select} ${state.errors.opportunityType ? styles.error : ''}`}
          value={formData.opportunityType}
          onChange={handleChange('opportunityType')}
        >
          <option value="" disabled>
            — Select opportunity type —
          </option>
          {OPPORTUNITY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {state.errors.opportunityType && (
          <div className={styles['error-text']}>{state.errors.opportunityType}</div>
        )}
      </div>

      <button
        className={getButtonClass()}
        onClick={handleWhatsApp}
        disabled={state.status === 'loading' || state.status === 'success'}
        data-hover
      >
        {getButtonText()}
      </button>
    </div>
  )
}

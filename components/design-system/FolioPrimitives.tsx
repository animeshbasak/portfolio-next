'use client'

import { useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react'
import styles from './primitives.module.css'

export type IconName = 'arrow' | 'down' | 'copy' | 'check' | 'plus' | 'play' | 'close' | 'branch'

const iconPaths: Record<IconName, ReactNode> = {
  arrow: <><path d="M5 12h14M12 5l7 7-7 7" /></>,
  down: <><path d="M12 4v12m-5-5 5 5 5-5M5 19h14" /></>,
  copy: <><rect x="8" y="8" width="11" height="12" rx="2" /><path d="M15 8V4H4v12h4" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  plus: <path d="M5 12h14M12 5v14" />,
  play: <path d="m8 5 11 7-11 7Z" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  branch: <><path d="M7 5v14m0-7c0-5 10 1 10-7" /><circle cx="7" cy="4" r="2" /><circle cx="7" cy="20" r="2" /><circle cx="17" cy="4" r="2" /></>,
}

export function FolioIcon({ name, className }: { name: IconName; className?: string }) {
  return <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>
}

export function FolioButton({
  variant = 'primary', icon, children, className = '', type = 'button', ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'quiet'
  icon?: IconName
}) {
  return <button type={type} className={[styles.button, styles[variant], className].join(' ')} {...props}>
    {children}{icon && <FolioIcon name={icon} />}
  </button>
}

export function FolioBadge({ tone = 'neutral', children }: { tone?: 'neutral' | 'accent' | 'success' | 'warning'; children: ReactNode }) {
  return <span className={[styles.badge, styles[tone]].join(' ')}><span className={styles.badgeDot} aria-hidden="true" />{children}</span>
}

export function FolioSwitch({ checked, onChange, label, disabled = false }: {
  checked: boolean; onChange: (value: boolean) => void; label: string; disabled?: boolean
}) {
  return <button type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={() => onChange(!checked)} className={styles.switch}>
    <span className={styles.switchTrack}><span className={styles.switchThumb} /></span><span>{label}</span>
  </button>
}

export function FolioField({ label, hint, error, id, className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & {
  label: string; hint?: string; error?: string
}) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const helpId = fieldId + '-help'
  return <div className={[styles.field, className].join(' ')}>
    <label htmlFor={fieldId}>{label}</label>
    <input id={fieldId} aria-invalid={error ? true : undefined} aria-describedby={error || hint ? helpId : undefined} {...props} />
    {(error || hint) && <p id={helpId} className={error ? styles.error : styles.hint}>{error || hint}</p>}
  </div>
}

export function FolioChoices<T extends string>({ label, options, value, onChange }: {
  label: string; options: readonly { value: T; label: string }[]; value: T; onChange: (value: T) => void
}) {
  return <div className={styles.choices} role="group" aria-label={label}>
    {options.map(option => <button key={option.value} type="button" aria-pressed={option.value === value} onClick={() => onChange(option.value)}>{option.label}</button>)}
  </div>
}

export function FolioSectionHeading({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return <div className={styles.sectionHeading}>
    <div><span className={styles.sectionNumber}>{number}</span><h2>{title}</h2></div>
    <p>{children}</p>
  </div>
}

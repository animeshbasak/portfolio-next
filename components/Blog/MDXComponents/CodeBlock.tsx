import React from 'react'
import styles from './CodeBlock.module.css'

export default function CodeBlock({ children }: { children: React.ReactNode }) {
  let content = ''
  
  if (React.isValidElement(children)) {
    content = (children.props as any).children || ''
  } else if (typeof children === 'string') {
    content = children
  }

  let html = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  html = html.replace(/(\/\/.*)/g, '<span class="cm">$1</span>')
  html = html.replace(/\b(function|return|const|let|var|if|else|import|from|async|await|default|export)\b/g, '<span class="ck">$1</span>')
  
  return (
    <pre className={styles.pre} dangerouslySetInnerHTML={{ __html: html }} />
  )
}

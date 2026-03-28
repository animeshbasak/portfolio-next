import { MDXRemote } from 'next-mdx-remote/rsc'
import Callout from '../MDXComponents/Callout'
import PullQuote from '../MDXComponents/PullQuote'
import CodeBlock from '../MDXComponents/CodeBlock'
import MetricRow from '../MDXComponents/MetricRow'
import styles from './PostBody.module.css'

const components = {
  h2: ({ children }: any) => {
    const text = children.toString()
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    return <h2 id={id} className={styles.h2}>{children}</h2>
  },
  h3: ({ children }: any) => <h3 className={styles.h3}>{children}</h3>,
  p: ({ children }: any) => <p className={styles.p}>{children}</p>,
  a: ({ children, href }: any) => <a href={href} className={styles.a} target="_blank" rel="noopener noreferrer">{children}</a>,
  strong: ({ children }: any) => <strong className={styles.strong}>{children}</strong>,
  em: ({ children }: any) => <em className={styles.em}>{children}</em>,
  pre: CodeBlock,
  Callout,
  PullQuote,
  MetricRow,
  CodeBlock,
}

export default function PostBody({ content }: { content: string }) {
  return (
    <div className={styles.body}>
      <MDXRemote source={content} components={components} />
    </div>
  )
}

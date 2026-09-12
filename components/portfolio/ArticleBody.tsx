import Link from 'next/link'
import {MDXRemote} from 'next-mdx-remote/rsc'
import type {ComponentProps,ReactNode} from 'react'
const components={
 a:({href='',children,...props}:ComponentProps<'a'>)=>href.startsWith('/')?<Link href={href}>{children}</Link>:<a href={href} target="_blank" rel="noreferrer" {...props}>{children}</a>,
 Callout:({children}:{children:ReactNode})=><aside className="folio-panel">{children}</aside>,
 PullQuote:({children,attr}:{children:ReactNode;attr?:string})=><blockquote>{children}{attr&&<cite>{attr}</cite>}</blockquote>,
}
export default function ArticleBody({content}:{content:string}){return <MDXRemote source={content} components={components}/>}

import {notFound} from 'next/navigation'
import {ArticlePage} from '../../../../components/portfolio/ContentPages'
import ArticleBody from '../../../../components/portfolio/ArticleBody'
import {getPublicPosts,getPublicPostBySlug} from '../../../../lib/portfolio/public-blog'
export function generateStaticParams(){return getPublicPosts().map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const p=getPublicPostBySlug((await params).slug);return{alternates:{canonical:`/blog/${p?.slug}`},title:`${p?.title??'Article'} — Animesh Basak`,description:p?.excerpt}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const post=getPublicPostBySlug((await params).slug);if(!post)notFound();return <ArticlePage post={post}><ArticleBody content={post.content}/></ArticlePage>}

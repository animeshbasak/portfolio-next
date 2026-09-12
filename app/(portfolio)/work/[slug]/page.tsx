import {redirect} from 'next/navigation'
import {ProjectPage} from '../../../../components/portfolio/ContentPages'
import {projects} from '../../../../lib/portfolio/data'
export function generateStaticParams(){return projects.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const{slug}=await params;return{alternates:{canonical:`/work/${slug}`},title:`${projects.find(p=>p.slug===slug)?.name??'Project'} — Animesh Basak`}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(slug==='tools')redirect('/work');return <ProjectPage slug={slug}/>}

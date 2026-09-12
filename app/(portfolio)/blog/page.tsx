import {WritingPage} from '../../../components/portfolio/ContentPages'
import {getPublicPosts} from '../../../lib/portfolio/public-blog'
export const metadata={alternates:{canonical:'/blog'},title:'Writing — Animesh Basak'}
export default function Page(){return <WritingPage posts={getPublicPosts()}/>}

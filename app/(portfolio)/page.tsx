import HomeStory from '../../components/portfolio/HomeStory'
import {getPublicPosts} from '../../lib/portfolio/public-blog'
export default function Home(){return <HomeStory posts={getPublicPosts()}/>}

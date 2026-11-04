import Shell from '../../components/portfolio/Shell'
import { bebasNeue, ibmMono } from '../fonts'
import '../../components/portfolio/portfolio.css'
export default function PortfolioLayout({children}:{children:React.ReactNode}){return <Shell identityFont={bebasNeue.style.fontFamily} detailFont={ibmMono.style.fontFamily}>{children}</Shell>}

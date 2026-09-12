import { Instrument_Serif } from 'next/font/google'
import '../../components/design-system/tokens.css'
import './scope.css'

const editorial = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-editorial',
})

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return <div className={editorial.variable}>{children}</div>
}

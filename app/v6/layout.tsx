import Nav from '@components/Nav/Nav'
import Preloader from '@components/Chrome/Preloader'

export const metadata={title:'V6 archive — Animesh Basak',robots:{index:false,follow:true}}

export default function V6Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Preloader />
      <Nav />
      {children}
    </>
  )
}

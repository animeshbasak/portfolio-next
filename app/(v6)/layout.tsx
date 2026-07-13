import Nav from '@components/Nav/Nav'
import Preloader from '@components/Chrome/Preloader'

export default function V6Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Preloader />
      <Nav />
      {children}
    </>
  )
}

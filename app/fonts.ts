import {
  Archivo,
  Fragment_Mono,
  IM_Fell_English,
  Bebas_Neue,
  IBM_Plex_Mono,
} from 'next/font/google'

export const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-display',
})

export const fragmentMono = Fragment_Mono({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-mono',
})

export const imFell = IM_Fell_English({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
})

/* legacy (/legacy route only) — same var names, scoped by the wrapper class */
export const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

export const ibmMono = IBM_Plex_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
})

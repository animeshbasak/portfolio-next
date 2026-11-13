import {ImageResponse} from 'next/og'
import {readFile} from 'node:fs/promises'
import {join} from 'node:path'

export const alt = 'Animesh Basak, Lead Frontend Engineer. 8 years shipping. Delhi NCR, India.'
export const size = {width: 1200, height: 630}
export const contentType = 'image/png'

const BG = '#f0ece4'
const INK = '#0d0c0a'
const INK2 = '#6b675e'
const LINE = '#cfc9bd'
const RED = '#c8102e'

export default async function OpengraphImage() {
  const dir = join(process.cwd(), 'assets/og')
  const [bebas, mono, monoBold] = await Promise.all([
    readFile(join(dir, 'BebasNeue.woff')),
    readFile(join(dir, 'PlexMono-400.woff')),
    readFile(join(dir, 'PlexMono-600.woff')),
  ])

  const stat = (n: string, label: string, red = false) => (
    <div style={{display: 'flex', flexDirection: 'column', marginBottom: 22}}>
      <span style={{fontFamily: 'Bebas', fontSize: 64, lineHeight: 1, color: red ? RED : INK}}>{n}</span>
      <span style={{fontSize: 14, letterSpacing: 3, color: INK2, marginTop: 4}}>{label}</span>
    </div>
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BG,
          color: INK,
          padding: '48px 64px',
          fontFamily: 'Plex',
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${LINE}`, paddingBottom: 18, fontSize: 15, letterSpacing: 3}}>
          <span style={{color: INK2}}>PERSONNEL FILE · AB-2018-12</span>
          <span style={{display: 'flex', alignItems: 'center', fontWeight: 600}}>
            <span style={{width: 12, height: 12, background: RED, marginRight: 12}} />
            OPEN TO LEAD FRONTEND ROLES
          </span>
        </div>

        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <span style={{fontFamily: 'Bebas', fontSize: 160, lineHeight: 0.92, letterSpacing: -1}}>ANIMESH</span>
            <span style={{fontFamily: 'Bebas', fontSize: 160, lineHeight: 0.92, letterSpacing: -1}}>BASAK</span>
            <span style={{width: 120, height: 6, background: RED, marginTop: 18, marginBottom: 18}} />
            <span style={{fontSize: 24, fontWeight: 600, letterSpacing: 4}}>LEAD FRONTEND ENGINEER</span>
            <span style={{fontSize: 19, color: INK2, marginTop: 8}}>React · TypeScript · React Native · BFF · AI-native delivery</span>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', borderLeft: `1px solid ${LINE}`, paddingLeft: 36}}>
            {stat('8', 'YEARS SHIPPING', true)}
            {stat('150M+', 'MONTHLY USERS · AIRTEL')}
            {stat('5–7', 'ENGINEERS LED')}
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${LINE}`, paddingTop: 18, fontSize: 15, letterSpacing: 3, color: INK2}}>
          <span>DELHI NCR, INDIA</span>
          <span>ANIMESHBASAK.COM</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {name: 'Bebas', data: bebas, weight: 400, style: 'normal'},
        {name: 'Plex', data: mono, weight: 400, style: 'normal'},
        {name: 'Plex', data: monoBold, weight: 600, style: 'normal'},
      ],
    },
  )
}

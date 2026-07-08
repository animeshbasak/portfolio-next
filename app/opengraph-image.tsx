import { ImageResponse } from 'next/og'

export const alt =
  'Animesh Basak — Senior Frontend Engineer | React, TypeScript, React Native'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#f0ece4',
          color: '#0d0c0a',
          padding: '64px 72px',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 22,
            letterSpacing: '0.15em',
            color: 'rgba(13, 12, 10, 0.55)',
          }}
        >
          <span>FILE_ID: AB-ENG-2026-001</span>
          <span
            style={{
              background: '#c8102e',
              color: '#f0ece4',
              padding: '6px 18px',
              letterSpacing: '0.2em',
            }}
          >
            DECRYPTED
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 110,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            ANIMESH BASAK
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 38,
              color: '#c8102e',
              letterSpacing: '0.06em',
            }}
          >
            Senior Frontend Engineer
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 26,
              color: 'rgba(13, 12, 10, 0.55)',
              letterSpacing: '0.04em',
            }}
          >
            React · TypeScript · React Native · Next.js — 150M+ MAU · Gen AI
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 22,
            letterSpacing: '0.12em',
            color: 'rgba(13, 12, 10, 0.55)',
            borderTop: '2px solid rgba(13, 12, 10, 0.14)',
            paddingTop: 24,
          }}
        >
          <span>animeshbasak.com</span>
          <span>PAYTM · MAKEMYTRIP · AIRTEL DIGITAL</span>
        </div>
      </div>
    ),
    { ...size }
  )
}

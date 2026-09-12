'use client'

import type { CSSProperties } from 'react'
import { FolioIcon, FolioSectionHeading } from './FolioPrimitives'
import styles from './catalog.module.css'

const palette = [
  { name: 'Paper', token: '--folio-paper-100', role: 'The canvas', dark: false },
  { name: 'Ink', token: '--folio-ink-950', role: 'Words & structure', dark: true },
  { name: 'Indigo', token: '--folio-indigo-600', role: 'An invitation to act', dark: true },
  { name: 'Chalk', token: '--folio-paper-50', role: 'A layer of depth', dark: false },
  { name: 'Vermilion', token: '--folio-vermilion-400', role: 'A little punctuation', dark: false },
  { name: 'Sage', token: '--folio-sage-700', role: 'Positive feedback', dark: true },
]

export function Foundations({ colors, onCopy }: { colors: Record<string, string>; onCopy: (value: string, label: string) => void }) {
  return <section id="foundations" className={styles.section}>
    <FolioSectionHeading number="01" title="A considered palette.">Quiet by default. Distinctive where it matters.</FolioSectionHeading>
    <div className={styles.palette}>
      {palette.map(color => <button
        key={color.name}
        type="button"
        className={styles.swatch}
        onClick={() => onCopy(colors[color.token], color.name)}
        aria-label={'Copy ' + color.name + ' color ' + colors[color.token]}
      >
        <span className={styles.swatchColor} style={{ '--swatch-color': 'var(' + color.token + ')' } as CSSProperties} data-dark={color.dark}>
          <span className={styles.swatchGlyph}>{color.name === 'Vermilion' ? '•' : 'Aa'}</span>
          <FolioIcon name="copy" />
        </span>
        <span className={styles.swatchLabel}><strong>{color.name}</strong><span>{colors[color.token]?.toUpperCase()}</span></span>
        <span className={styles.swatchRole}>{color.role}</span>
      </button>)}
    </div>
    <div className={styles.foundationNote}><span className={styles.smallLabel}>THE BALANCE</span><p>Paper gives the story room. Ink makes it legible. Indigo guides the next move.</p><span>Click a swatch to copy</span></div>
    <div className={styles.measureGrid}>
      <div className={styles.measurePanel}>
        <div className={styles.panelHeading}><h3>Room to breathe</h3><span>4 px foundation</span></div>
        <div className={styles.spacingScale}>
          {[{ n: 4, token: 1 }, { n: 8, token: 2 }, { n: 12, token: 3 }, { n: 16, token: 4 }, { n: 24, token: 6 }, { n: 32, token: 8 }, { n: 48, token: 12 }, { n: 64, token: 16 }].map(space => <div key={space.n}><span style={{ width: 'var(--folio-space-' + space.token + ')' }} /><span>{space.n}</span></div>)}
        </div>
        <p className={styles.annotation}>A small, repeatable scale. Space follows the relationship between things.</p>
      </div>
      <div className={styles.measurePanel}>
        <div className={styles.panelHeading}><h3>Soft edges. Clear intent.</h3><span>Shape language</span></div>
        <div className={styles.radiusScale}>
          <div><span className={styles.radiusSmall} /><span>4 / precise</span></div>
          <div><span className={styles.radiusMedium} /><span>12 / containing</span></div>
          <div><span className={styles.radiusPill} /><span>full / inviting</span></div>
        </div>
      </div>
    </div>
  </section>
}

export function Typography() {
  return <section id="typography" className={styles.section}>
    <FolioSectionHeading number="02" title="Two voices. One story.">Expressive in the headlines. Effortless in the details.</FolioSectionHeading>
    <div className={styles.typeGrid}>
      <article className={styles.editorialSpecimen}>
        <div className={styles.panelHeading}><h3>Instrument Serif</h3><span>THE HUMAN SIDE</span></div>
        <p className={styles.serifAlphabet}>Aa<span>&</span></p>
        <p className={styles.typeQuote}>Stay curious.<br /><em>Build with care.</em></p>
        <div className={styles.specimenFoot}><span>Regular / Italic</span><span>Headlines & moments</span></div>
      </article>
      <article className={styles.interfaceSpecimen}>
        <div className={styles.panelHeading}><h3>Archivo</h3><span>THE ENGINEERING SIDE</span></div>
        <p className={styles.sansAlphabet}>Aa<span>0123</span></p>
        <p className={styles.interfaceQuote}>Good interfaces make<br />the next step feel obvious.</p>
        <p className={styles.annotation}>Clear labels. Useful feedback. A comfortable reading rhythm. Every small detail earns its place.</p>
        <div className={styles.specimenFoot}><span>Regular / Medium / Semibold</span><span>Everything in between</span></div>
      </article>
    </div>
    <div className={styles.typeScale} aria-label="Typography scale">
      <div><span>DISPLAY</span><p className={styles.scaleDisplay}>Built over time.</p><span>60–108 / serif</span></div>
      <div><span>SECTION</span><p className={styles.scaleHeading}>The art of getting better.</p><span>32–48 / serif</span></div>
      <div><span>BODY</span><p className={styles.scaleBody}>An engineer’s journey through interfaces, systems, and what comes next.</p><span>15 / 1.65</span></div>
      <div><span>LABEL</span><p className={styles.smallLabel}>CURIOSITY COMPOUNDS</p><span>11 / +0.14 em</span></div>
    </div>
  </section>
}

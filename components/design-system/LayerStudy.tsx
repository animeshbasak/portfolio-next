'use client'

import type { CSSProperties } from 'react'
import styles from './catalog.module.css'

const marks = [
  <><circle cx="48" cy="88" r="5" fill="currentColor" /><path d="M58 88c30-24 35 24 61 0" /></>,
  <><rect x="37" y="57" width="77" height="63" rx="3" /><path d="M37 72h77m-65-8h2m5 0h2m5 0h2M47 84h25m-25 10h53m-53 10h39" /></>,
  <><rect x="38" y="52" width="29" height="29" rx="2" /><rect x="83" y="52" width="29" height="29" rx="2" /><rect x="38" y="96" width="29" height="29" rx="2" /><rect x="83" y="96" width="29" height="29" rx="2" /><path d="M67 66h16M53 81v15m44-15v15m-30 15h16" /></>,
  <><path d="M43 86h27m0 0c23 0 0-31 29-31m-29 31c23 0 0 31 29 31" /><circle cx="41" cy="86" r="5" /><circle cx="105" cy="55" r="5" /><circle cx="105" cy="117" r="5" /></>,
  <><path d="M38 105c28 0 4-40 37-40s10 42 34 17m-27-37 4 9 10 2-8 6 1 10-8-6-9 4 3-10-6-7 10-1Z" /></>,
]

export default function LayerStudy({ spread = 1, branched = false }: { spread?: number; branched?: boolean }) {
  return <div className={styles.layerStudy} aria-hidden="true" style={{ '--layer-spread': spread } as CSSProperties} data-branched={branched}>
    <div className={styles.layerGround} />
    <svg className={styles.thread} viewBox="0 0 600 350" fill="none">
      <path d="M50 305C110 295 85 205 172 222S239 133 306 169 366 130 403 100 445 123 488 51" />
      {branched && <path className={styles.branchThread} d="M306 169c50 52 101 21 142 59s60 19 82 7" />}
      <circle cx="50" cy="305" r="4" /><circle cx="488" cy="51" r="4" />
    </svg>
    {marks.map((mark, i) => <div className={styles.studyLeaf} key={i} style={{ '--leaf-index': i } as CSSProperties}>
      <span className={styles.leafIndex}>0{i + 1}</span>
      <svg viewBox="0 0 150 180" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">{mark}</svg>
      <span className={styles.leafLine} /><span className={styles.leafLineShort} />
      <span className={styles.leafFoot}>{['BEGIN', 'CLARIFY', 'CONNECT', 'CONSIDER', 'EXPLORE'][i]}</span>
    </div>)}
  </div>
}

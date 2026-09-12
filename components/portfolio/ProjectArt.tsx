import type { ProjectSlug } from '../../lib/portfolio/data'

/** Original schematic artwork; intentionally does not imitate a product screenshot. */
export function ProjectArt({ variant, className }: { variant: ProjectSlug; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 720 530" fill="none" role="img" aria-label={variant === 'lakshya' ? 'Original schematic: three connected surfaces for discovery, fit and tracking' : variant === 'paarth' ? 'Original schematic: an explicit agent cycle around a verification step' : 'Original schematic: two workflows connecting an idea with an inspectable result'}>
      <path d="M20 402 360 210 700 402 360 594Z" fill="#D4E0E5" fillOpacity=".45" />
      <g stroke="#A4BAC6" strokeWidth="1">
        <path d="M20 390 360 198 700 390M70 420 410 228M120 450 460 258M170 480 510 288M650 420 310 228M600 450 260 258M550 480 210 288" opacity=".5" />
        <path d="M50 46H150M50 46V116M670 484H570M670 484V414" />
      </g>
      {variant === 'lakshya' ? <>
        <g stroke="#8CA5B3" strokeWidth="1.5" strokeLinejoin="round">
          <path d="M112 313 357 171 608 313 362 456Z" fill="#B9CDD7" fillOpacity=".5" />
          <path d="M112 253 357 111 608 253 362 396Z" fill="#DCE8ED" fillOpacity=".85" />
          <path d="M112 193 357 51 608 193 362 336Z" fill="#F6FAFB" fillOpacity=".9" />
          <path d="M112 193V313M608 193V313M362 336V456" strokeDasharray="4 7" />
          <path d="M178 185 342 90 412 130 249 225Z" fill="#DFE9ED" />
          <path d="M274 239 438 145 541 204 377 298Z" fill="#E7EEF1" />
          <path d="M209 184 339 109M224 194 354 119M306 235 441 157M322 245 457 167M338 255 473 177" />
        </g>
        <path d="m199 330 97-56 66 38v80l141-82" stroke="#AF4526" strokeWidth="4" strokeLinejoin="round" />
        <circle cx="199" cy="330" r="6" fill="#AF4526" /><circle cx="503" cy="310" r="6" fill="#AF4526" />
      </> : variant === 'paarth' ? <>
        <g stroke="#8CA5B3" strokeWidth="1.5">
          <ellipse cx="360" cy="284" rx="222" ry="124" />
          <ellipse cx="360" cy="284" rx="154" ry="86" strokeDasharray="4 8" />
          <path d="M360 89V157M581 284H641M360 410V470M139 284H79" />
          <path d="m276 281 84-49 84 49-84 49Z" fill="#F6FAFB" /><path d="m276 281 84 49 84-49v40l-84 49-84-49Z" fill="#C7D8E1" />
          {[[360,160],[566,250],[487,385],[230,385],[153,250]].map(([x,y],i) => <g key={x}><path d={`M${x-35} ${y}l35-20 35 20-35 20Z`} fill={i === 4 ? '#AF4526' : '#EFF5F7'} /><path d={`M${x-35} ${y}v20l35 20 35-20v-20l-35 20Z`} fill={i === 4 ? '#C26F53' : '#C3D5DF'} /></g>)}
        </g>
        <path d="M360 160c123 0 222 56 222 124 0 36-28 69-72 91" stroke="#AF4526" strokeWidth="3" strokeDasharray="5 6" />
        <path d="m505 364 4 14 15-2" stroke="#AF4526" strokeWidth="3" />
        <path d="m340 284 14 10 30-21" stroke="#AF4526" strokeWidth="4" />
      </> : <>
        <g stroke="#8CA5B3" strokeWidth="1.5" strokeLinejoin="round">
          <path d="M101 240 261 148 421 240 261 333Z" fill="#F1F6F8" /><path d="m101 240 160 93 160-93v28l-160 93-160-93Z" fill="#C8D9E2" />
          <path d="M301 351 461 259 621 351 461 444Z" fill="#EEF5F7" /><path d="m301 351 160 93 160-93v28l-160 93-160-93Z" fill="#C2D5DF" />
          <path d="m171 239 90-52 88 52-88 52Z" fill="#DAE6EB" /><path d="m371 350 90-52 88 52-88 52Z" fill="#DAE6EB" />
          <path d="m171 239 90 2 88-2M261 187v104M371 350l90 2 88-2M461 298v104" strokeDasharray="4 5" />
        </g>
        <path d="M147 119 261 185v56l100 56 100-58V129" stroke="#AF4526" strokeWidth="4" strokeLinejoin="round" />
        <path d="M361 297v57l100 58 108-63" stroke="#AF4526" strokeWidth="4" strokeLinejoin="round" />
        <circle cx="147" cy="119" r="6" fill="#AF4526" /><circle cx="461" cy="129" r="6" fill="#AF4526" /><circle cx="569" cy="349" r="6" fill="#AF4526" />
      </>}
      <g fill="#526875" fontSize="11" fontFamily="monospace" letterSpacing="2"><text x="52" y="465">{variant === 'lakshya' ? 'DISCOVER / CONSIDER / TRACK' : variant === 'paarth' ? 'PERCEIVE / ACT / VERIFY' : 'ROUTE / RECALL / CREATE'}</text></g>
    </svg>
  )
}

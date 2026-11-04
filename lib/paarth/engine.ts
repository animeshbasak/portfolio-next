/**
 * PAARTH, small build: plan → pick tools → run them → write a cited briefing.
 * The JARVIS (HuggingGPT) loop, run by rules. No model, no network.
 * Evidence comes only from the public résumé and the Airtel write-up he approved (31 Oct 2026).
 * Owner rules: nothing half-built is cited; insaneFit is never evidence.
 */
export type Tier = 'work' | 'fit' | 'listed' | 'ask'
export type Seg = { t: string; u?: boolean }
export type Row = { key?: string; ask: Seg[]; proof: string; href?: string; src?: string; tier: Tier }
export type Step = { tool: string; result: string; dep: string }
export type Briefing = { title: string; rows: Row[]; run: Step[]; caption: string; mode: string; keys: string[]; subject: string }
type Hit = { i: number; len: number; text: string; m: RegExpExecArray }
type Skill = { id: string; re: RegExp; tier: Tier; proof: string; href: string; src: string }

export const SKILLS: Skill[] = [
  { id: 'rn', re: /\breact[\s-]?native\b/gi, tier: 'work', proof: 'Airtel’s chat-based Self-KYC, in React Native.', href: '#case-chat', src: 'Airtel case' },
  { id: 'react', re: /\b(?:react(?:\.?js)?(?![\s-]?native)|typescript|javascript)\b/gi, tier: 'work', proof: 'Leads React and TypeScript architecture at Airtel.', href: '/resume-public.pdf', src: 'Résumé' },
  { id: 'next', re: /\bnext\.?js\b/gi, tier: 'work', proof: 'Builds this site with Next.js and React.', href: '#built', src: 'This site' },
  { id: 'angular', re: /\bangular\b/gi, tier: 'work', proof: 'Built Angular modules for ANZ Bank at Infosys.', href: '#exp-infosys', src: 'Infosys' },
  { id: 'perf', re: /\b(?:core web vitals|web vitals|lighthouse|lcp|page speed|web performance|performance|ssr|server[- ]side rendering)\b/gi, tier: 'work', proof: 'Took MakeMyTrip Lighthouse from 6 to 8-9.', href: '#exp-mmt', src: 'MakeMyTrip' },
  { id: 'pwa', re: /\b(?:pwa|progressive web apps?|mobile web)\b/gi, tier: 'work', proof: 'Tuned the MakeMyTrip hotels PWA and desktop web.', href: '/resume-public.pdf', src: 'Résumé' },
  { id: 'mfe', re: /\b(?:micro[- ]?frontends?|module federation|monorepos?)\b/gi, tier: 'work', proof: 'Worked in micro-frontends and Module Federation at Paytm and MakeMyTrip.', href: '/resume-public.pdf', src: 'Résumé' },
  { id: 'sdui', re: /\b(?:server[- ]driven|schema[- ]driven|config(?:uration)?[- ]driven)\b/gi, tier: 'work', proof: 'Built a schema-driven UI catalog for Airtel’s Gen4 Self-KYC.', href: '#case-gen4', src: 'Airtel case' },
  { id: 'ds', re: /\b(?:design systems?|component librar(?:y|ies)|ui kits?|reusable components?)\b/gi, tier: 'work', proof: 'Reusable components cut onboarding 30% at MakeMyTrip.', href: '/resume-public.pdf', src: 'Résumé' },
  { id: 'lead', re: /\b(?:lead and mentor|mentor(?:ing|s)?|tech lead|team lead|lead (?:a |the )?(?:small )?(?:team|squad)|manage (?:a )?team)\b/gi, tier: 'work', proof: 'Leads a squad of 5 to 7.', href: '#airtel', src: 'Airtel' },
  { id: 'arch', re: /\b(?:system design|frontend architecture|architecture|hld|lld|technical design)\b/gi, tier: 'work', proof: 'Writes HLD and LLD with architect sign-off at Airtel.', href: '#airtel', src: 'Airtel' },
  { id: 'test', re: /\b(?:unit tests?|testing|jest|vitest|react testing library|test coverage|tdd)\b/gi, tier: 'work', proof: 'Held 90%+ coverage with Vitest, Jest and RTL at MakeMyTrip.', href: '/resume-public.pdf', src: 'Résumé' },
  { id: 'monitor', re: /\b(?:sentry|monitoring|observability|error tracking|debugging)\b/gi, tier: 'work', proof: 'Fixed a defect behind 1,000+ Sentry errors within 48 hours.', href: '/resume-public.pdf', src: 'Résumé' },
  { id: 'cicd', re: /\b(?:ci\/cd|continuous (?:integration|delivery)|jenkins|github actions|pipelines?)\b/gi, tier: 'work', proof: 'Owns Jenkins CI/CD for his Airtel squad.', href: '/resume-public.pdf', src: 'Résumé' },
  { id: 'flags', re: /\b(?:a\/b tests?|experimentation|experiments|feature flags?|growthbook|rollouts?)\b/gi, tier: 'work', proof: 'Runs GrowthBook experiments and rollouts at Airtel.', href: '/resume-public.pdf', src: 'Résumé' },
  { id: 'backend', re: /\b(?:node(?:\.js)?|spring boot|java|rest(?:ful)? apis?|backend|bff)\b/gi, tier: 'work', proof: 'Shipped Spring Boot REST services and BFF scripts at Airtel.', href: '/resume-public.pdf', src: 'Résumé' },
  { id: 'ai', re: /\b(?:ai|llms?|genai|generative ai|ai agents?|agentic)\b/gi, tier: 'work', proof: 'Built PAARTH, the agent that wrote this briefing.', href: '#work-paarth', src: 'PAARTH' },
  { id: 'macos', re: /\b(?:swift(?:ui)?|macos|mac os)\b/gi, tier: 'work', proof: 'Built Trinetra, an open-source macOS app in Swift.', href: '#work-trinetra', src: 'Trinetra' },
  { id: 'pay', re: /\b(?:payments?|checkout|fintech|upi)\b/gi, tier: 'work', proof: 'Optimised Soundbox checkout, part of a 40% lift in EDC sales.', href: '#exp-paytm', src: 'Paytm' },
  { id: 'bank', re: /\b(?:banking|banks?)\b/gi, tier: 'work', proof: 'Built internet banking modules for ANZ and ICICI.', href: '#exp-infosys', src: 'Infosys' },
  { id: 'kyc', re: /\b(?:kyc|onboarding flows?|identity verification|telecom)\b/gi, tier: 'work', proof: 'Leads Airtel’s Self-KYC across prepaid, postpaid and eSIM.', href: '#case-gen4', src: 'Airtel case' },
  { id: 'analytics', re: /\b(?:analytics|dashboards?)\b/gi, tier: 'work', proof: 'Paytm analytics dashboards lifted merchant engagement 10 to 15%.', href: '/resume-public.pdf', src: 'Résumé' },
  { id: 'state', re: /\b(?:redux|zustand|state management)\b/gi, tier: 'listed', proof: 'Listed on his résumé; no case on this page.', href: '/resume-public.pdf', src: 'Résumé' },
  { id: 'a11y', re: /\b(?:accessibility|accessible|a11y|wcag)\b/gi, tier: 'listed', proof: 'Listed on his résumé; no case on this page.', href: '/resume-public.pdf', src: 'Résumé' },
  { id: 'docker', re: /\b(?:docker|containers?)\b/gi, tier: 'listed', proof: 'Listed on his résumé; no case on this page.', href: '/resume-public.pdf', src: 'Résumé' },
];
export const LABELS: Record<string, string> = { rn: 'React Native', react: 'React and TypeScript', next: 'Next.js', angular: 'Angular', perf: 'Web performance', pwa: 'Progressive web apps', mfe: 'Micro-frontends', sdui: 'Schema-driven UI', ds: 'Component libraries', lead: 'Leading a team', arch: 'Architecture', test: 'Testing', monitor: 'Monitoring', cicd: 'CI/CD', flags: 'Experimentation', backend: 'Backend and BFF', ai: 'AI products', macos: 'Swift and macOS', pay: 'Payments', bank: 'Banking', kyc: 'KYC and onboarding', analytics: 'Analytics', state: 'State management', a11y: 'Accessibility', docker: 'Docker' };
const GAPS = /\b(?:graphql|apollo|vue(?:\.js)?|nuxt|svelte|solid\.?js|flutter|kotlin|aws|gcp|azure|kubernetes|k8s|python|golang|rust|electron|three\.js|webgl|d3(?:\.js)?)\b/gi;
const NCR = /\b(?:new delhi|delhi|ncr|gurugram|gurgaon|noida|faridabad|ghaziabad)\b/gi;
const ELSEWHERE = /\b(?:bangalore|bengaluru|mumbai|pune|hyderabad|chennai|kolkata|ahmedabad|london|singapore|dubai|berlin|new york|san francisco)\b/gi;
const REMOTE = /\bremote\b/gi;
const YEARS = /\b(\d{1,2})\s*\+?\s*(?:years|yrs)\b/gi;
const PROJECT_KINDS = [
    { id: 'audit', re: /\b(?:audit|slow|speed up|bugs?|broken|fix(?:es|ing)?|lighthouse)\b/gi, proof: 'Sounds like an audit and rescue. He took MakeMyTrip hotels from Lighthouse 6 to 8-9.', href: '#exp-mmt', src: 'MakeMyTrip' },
    { id: 'feature', re: /\b(?:build|new features?|screens?|mvp|landing page|from scratch)\b/gi, proof: 'Sounds like a focused feature. He shipped Airtel’s prepaid SIM Self-KYC end to end.', href: '#case-sim', src: 'Airtel case' },
    { id: 'comp', re: /\b(?:design system|components?|ui kit|component library)\b/gi, proof: 'Sounds like reusable components. His cut onboarding 30% at MakeMyTrip.', href: '#exp-mmt', src: 'MakeMyTrip' },
  ];
const CAPACITY_RISK = /\b(?:full[- ]time|40 ?(?:hours|hrs)|9 ?to ?5|on[- ]?site|in[- ]office|immediately|asap|urgent(?:ly)?|daily stand-?ups?)\b/gi;
const SPAN = /\b(\d{1,2})\s*(weeks?|months?)\b/gi;
const HIRING_SIGNS = /\b(?:years|experience|responsibilit\w*|requirements|qualifications|we(?:'re| are) looking|you(?:'ll| will)|role|candidates?|hiring|job)\b/gi;
const PROJECT_SIGNS = /\b(?:freelance|freelancer|contract|budget|my app|our app|my website|our website|project|deadline|quote|need someone|looking for a developer|part[- ]time)\b/gi;

export const SAMPLE = 'Senior Frontend Engineer, Example Co., Gurugram\n6+ years with React and TypeScript.\nOwn Core Web Vitals. React Native is a plus.\nLead a small team. GraphQL APIs.'

const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())

function findAll(re: RegExp, text: string): Hit[] {
  re.lastIndex = 0; const out: Hit[] = []; let m: RegExpExecArray | null
  while ((m = re.exec(text))) { out.push({ i: m.index, len: m[0].length, text: m[0], m }); if (!m[0].length) re.lastIndex++ }
  return out
}

function sentenceStart(text: string, i: number) {
  const c = [0]; const nl = text.lastIndexOf('\n', i), dot = text.lastIndexOf('. ', i), semi = text.lastIndexOf('; ', i), par = text.lastIndexOf('(', i)
  if (nl >= 0) c.push(nl + 1); if (dot >= 0) c.push(dot + 2); if (semi >= 0) c.push(semi + 2); if (par >= 0) c.push(par + 1)
  return Math.max(...c)
}
function sentenceEnd(text: string, i: number) { let e = text.length; for (const sep of ['\n', '. ', '; ', ')']) { const k = text.indexOf(sep, i); if (k !== -1 && k < e) e = k } return e }

const STOP = /^(?:we|you|are|will|have|is|the|a|an|and|with|for|of|to|in|our|your)$/i

/** A short window of the visitor's own words, every matched term marked. */
export function fragment(text: string, input: Hit[]): Seg[] {
  const hits = [...input].sort((a, b) => a.i - b.i)
  const first = hits[0], last = hits[hits.length - 1]
  const s = sentenceStart(text, first.i), e = sentenceEnd(text, last.i + last.len)
  const before = text.slice(s, first.i).trim().split(/\s+/).filter(Boolean).slice(-2)
  while (before.length && STOP.test(before[0])) before.shift()
  const tailWords = text.slice(last.i + last.len, e).split(/\s+/).filter(Boolean).slice(0, 3)
  while (tailWords.length && STOP.test(tailWords[tailWords.length - 1].replace(/[.,;:]+$/, ''))) tailWords.pop()
  const after = tailWords.join(' ').replace(/[.,;:(]+$/, '')
  const segs: Seg[] = []
  if (before.length) segs.push({ t: before.join(' ') + ' ' })
  let cur = first.i
  for (const h of hits) { if (h.i < cur) continue; if (h.i > cur) segs.push({ t: text.slice(cur, h.i) }); segs.push({ t: h.text, u: true }); cur = h.i + h.len }
  const glue = after && !/^[,.;:)]/.test(text.slice(last.i + last.len).trim()) ? ' ' : ''
  if (after) segs.push({ t: glue + after })
  return segs
}

type Draft = Omit<Row, 'key'> & { key: string; at: number }

function plan(text: string, mode: 'hiring' | 'project') {
  const rows: Draft[] = []; const seen = new Set<string>()
  const add = (row: Draft) => { if (seen.has(row.key)) return; seen.add(row.key); rows.push(row) }
  const constraints: string[] = []

  if (mode === 'project') {
    for (const k of PROJECT_KINDS) { const h = findAll(k.re, text)[0]; if (h && k.id === 'audit') seen.add('perf'); if (h) add({ key: k.id, at: h.i, ask: fragment(text, [h]), proof: k.proof, href: k.href, src: k.src, tier: 'work' }) }
    const risk = findAll(CAPACITY_RISK, text)[0]
    if (risk) { add({ key: 'cap', at: risk.i, ask: fragment(text, [risk]), proof: 'He works part-time and remote, 10 to 12 hours a week. This may not fit.', href: '#close', src: 'Availability', tier: 'ask' }); constraints.push(risk.text) }
    const span = findAll(SPAN, text)[0]
    if (span) {
      const n = Number(span.m[1]); const weeks = /month/i.test(span.m[2]) ? n * 4 : n
      add({ key: 'span', at: span.i, ask: fragment(text, [span]), proof: `About ${weeks * 10} to ${weeks * 12} hours of his time at 10 to 12 hours a week.`, href: '#close', src: 'Availability', tier: 'fit' })
      constraints.push(span.text)
    }
    if (!risk) add({ key: 'time', at: 1e9, ask: [{ t: 'How much of his time' }], proof: 'Part-time and remote: 10 to 12 hours a week after office hours IST.', href: '#close', src: 'Availability', tier: 'fit' })
  }

  type Group = { proof: string; href?: string; src?: string; tier: Tier; hits: Hit[]; keys: string[] }
  const grouped = new Map<string, Group>()
  const group = (kind: string, h: Hit, keyPart: string, base: Omit<Group, 'hits' | 'keys'>) => { const k = kind + ':' + sentenceStart(text, h.i); const g = grouped.get(k) || { ...base, hits: [], keys: [] }; g.hits.push(h); g.keys.push(keyPart); grouped.set(k, g) }
  for (const s of SKILLS) {
    if (seen.has(s.id)) continue
    const h = findAll(s.re, text)[0]; if (!h) continue
    if (s.tier === 'listed') group('listed', h, s.id, { proof: s.proof, href: s.href, src: s.src, tier: 'listed' })
    else add({ key: s.id, at: h.i, ask: fragment(text, [h]), proof: s.proof, href: s.href, src: s.src, tier: s.tier })
  }
  const gapSeen = new Set<string>()
  for (const h of findAll(GAPS, text)) { const t = h.text.toLowerCase(); if (gapSeen.has(t)) continue; gapSeen.add(t); group('gap', h, 'gap-' + t, { proof: 'Not on his résumé or this page.', tier: 'ask' }) }
  for (const g of grouped.values()) add({ key: g.keys.join('+'), at: g.hits[0].i, ask: fragment(text, g.hits), proof: g.proof, href: g.href, src: g.src, tier: g.tier })

  if (mode !== 'project') {
    const y = findAll(YEARS, text)[0]
    if (y) {
      const n = Number(y.m[1])
      add({ key: 'years', at: y.i, ask: fragment(text, [y]), proof: n <= 7 ? '7.5+ years, since December 2018.' : `He has 7.5+ years; this asks for ${n}.`, href: '#experience', src: 'Experience', tier: n <= 7 ? 'work' : 'ask' })
      constraints.push(y.text)
    }
    const ncr = findAll(NCR, text)[0]; const far = findAll(ELSEWHERE, text)[0]; const rem = findAll(REMOTE, text)[0]
    if (ncr) { add({ key: 'place', at: ncr.i, ask: fragment(text, [ncr]), proof: `${ncr.text[0].toUpperCase() + ncr.text.slice(1)} is in Delhi NCR, where he lives.`, href: '#close', src: 'Availability', tier: 'fit' }); constraints.push(ncr.text) }
    else if (far) { add({ key: 'place', at: far.i, ask: fragment(text, [far]), proof: 'He is looking at roles in Delhi NCR.', href: '#close', src: 'Availability', tier: 'ask' }); constraints.push(far.text) }
    else if (rem) { add({ key: 'place', at: rem.i, ask: fragment(text, [rem]), proof: 'He lives in New Delhi. Ask him about remote.', href: '#close', src: 'Availability', tier: 'ask' }); constraints.push(rem.text) }
  }

  const ORDER: Record<Tier, number> = { work: 0, fit: 1, listed: 2, ask: 3 }
  rows.sort((a, b) => ORDER[a.tier] - ORDER[b.tier] || a.at - b.at)
  return { rows: rows.map(({ at: _at, ...r }) => r), lines: text.split('\n').filter((l) => l.trim()).length, constraints }
}

const ms = (t: number) => (t < 1 ? 'under 1 ms' : `${Math.round(t)} ms`)

export function detectMode(text: string): 'hiring' | 'project' {
  return findAll(PROJECT_SIGNS, text).length > findAll(HIRING_SIGNS, text).length ? 'project' : 'hiring'
}

/** Steps 0 to 4 for pasted text. */
export function briefFromText(raw: string, forced?: 'hiring' | 'project'): Briefing {
  const text = raw.trim().slice(0, 8000)
  const mode = forced ?? detectMode(text)
  const t0 = now(); const res = plan(text, mode); const total = now() - t0
  const n = (t: Tier) => res.rows.filter((r) => r.tier === t).length
  const project = mode === 'project'
  const firstLine = text.split('\n').find((l) => l.trim()) || ''
  return {
    title: project ? 'Your project, answered line by line' : 'Your role, answered line by line',
    rows: res.rows,
    run: [
      { tool: 'input.read', result: `${res.lines} lines`, dep: 'starts here' },
      { tool: 'fit.extract', result: `${res.rows.length} requirements`, dep: 'after step 0' },
      { tool: 'fit.match', result: `${n('work')} in his work${n('ask') ? `, ${n('ask')} to ask` : ''}`, dep: 'after step 1' },
      { tool: 'fit.constraints', result: res.constraints.join(', ') || 'none stated', dep: 'after step 0' },
      { tool: 'brief.write', result: `${res.rows.length} lines`, dep: 'after 2 and 3' },
    ],
    caption: `Rules only, ${ms(total)}; your text stays on this page.`,
    mode, keys: res.rows.map((r) => r.key || ''),
    subject: project ? 'A project for you' : `A role for you: ${firstLine.slice(0, 80)}`,
  }
}

type RouteRow = { ask: string; proof: string; href?: string; src?: string; tier: Tier }
const ROUTES: Record<'hiring' | 'engineer' | 'project', { title: string; source: string; rows: RouteRow[] }> = {
  hiring: { title: 'What a hiring team asks first', source: 'No role pasted, so PAARTH answered the usual questions.', rows: [
    { ask: 'What does he do now', proof: 'Lead Engineer at Airtel Digital, leading a squad of 5 to 7.', href: '#airtel', src: 'Airtel', tier: 'work' },
    { ask: 'At what scale', proof: 'Journeys on the Airtel Thanks app, used by 150M+ people a month.', href: '#airtel', src: 'Airtel case', tier: 'work' },
    { ask: 'Proof of craft', proof: 'Took MakeMyTrip Lighthouse from 6 to 8-9.', href: '#exp-mmt', src: 'MakeMyTrip', tier: 'work' },
    { ask: 'How long', proof: '7.5+ years, since December 2018.', href: '#experience', src: 'Experience', tier: 'work' },
    { ask: 'Where', proof: 'New Delhi, open to roles in Delhi NCR.', href: '#close', src: 'Availability', tier: 'fit' },
  ] },
  engineer: { title: 'Answers for a fellow engineer', source: 'The questions engineers ask him most, answered from the work.', rows: [
    { ask: 'How is the Self-KYC UI built', proof: 'A schema-driven UI catalog and BFF scripts.', href: '#case-gen4', src: 'Airtel case', tier: 'work' },
    { ask: 'What does PAARTH do', proof: 'Routes AI coding work, keeps memory, checks actions, guards cost.', href: '#work-paarth', src: 'PAARTH', tier: 'work' },
    { ask: 'A performance win', proof: 'SSR and critical-path work: Lighthouse 6 to 8-9.', href: '#exp-mmt', src: 'MakeMyTrip', tier: 'work' },
    { ask: 'How he tests', proof: '90%+ coverage with Vitest, Jest and RTL.', href: '/resume-public.pdf', src: 'Résumé', tier: 'work' },
  ] },
  project: { title: 'How a project with him runs', source: 'Paste your brief above and PAARTH matches it more closely.', rows: [
    { ask: 'What kind of work', proof: 'An audit and rescue, one focused feature, or components your team reuses.', href: '#close', src: 'Availability', tier: 'fit' },
    { ask: 'How much of his time', proof: 'Part-time and remote: 10 to 12 hours a week after office hours IST.', href: '#close', src: 'Availability', tier: 'fit' },
    { ask: 'How it runs', proof: 'A short call, an agreed scope and quote, weekly checkpoints, then handover.', href: '#close', src: 'Availability', tier: 'fit' },
    { ask: 'Proof he ships', proof: 'Airtel’s prepaid SIM Self-KYC, from purchase to activation.', href: '#case-sim', src: 'Airtel case', tier: 'work' },
  ] },
};

export type RouteName = keyof typeof ROUTES
const ROUTE_LABEL: Record<RouteName, string> = { engineer: 'a fellow engineer', project: 'planning a project', hiring: 'hiring, no role' }

/** Fixed answers for visitors with nothing to paste. */
export function briefFromRoute(name: RouteName): Briefing {
  const r = ROUTES[name]; const t0 = now()
  const rows: Row[] = r.rows.map((x) => ({ ...x, ask: [{ t: x.ask }] }))
  return {
    title: r.title, rows,
    run: [
      { tool: 'route.pick', result: ROUTE_LABEL[name], dep: 'starts here' },
      { tool: 'brief.questions', result: `${rows.length} questions`, dep: 'after step 0' },
      { tool: 'fit.match', result: `${rows.filter((x) => x.href).length} with a source`, dep: 'after step 1' },
      { tool: 'brief.write', result: `${rows.length} lines`, dep: 'after step 2' },
    ],
    caption: `Answered by rules in ${ms(now() - t0)}. No language model ran.`,
    mode: name, keys: [], subject: name === 'project' ? 'A project for you' : 'A role for you',
  }
}

const GAP_LABEL: Record<string, string> = { graphql: 'GraphQL', apollo: 'Apollo', vue: 'Vue', 'vue.js': 'Vue', nuxt: 'Nuxt', svelte: 'Svelte', flutter: 'Flutter', kotlin: 'Kotlin', aws: 'AWS', gcp: 'GCP', azure: 'Azure', kubernetes: 'Kubernetes', k8s: 'Kubernetes', python: 'Python', golang: 'Go', rust: 'Rust', electron: 'Electron', 'three.js': 'Three.js', webgl: 'WebGL', d3: 'D3' }

/** A shared link carries matched keys, never the pasted text. */
export function briefFromHash(hash: string): Briefing | null {
  if (!hash.startsWith('#brief=')) return null
  const [mode, keys = ''] = decodeURIComponent(hash).slice(7).split(':')
  if (!keys && mode in ROUTES) return briefFromRoute(mode as RouteName)
  const rows: Row[] = keys.split(/[,+]/).flatMap((k): Row[] => {
    if (k.startsWith('gap-')) return [{ key: k, ask: [{ t: GAP_LABEL[k.slice(4)] || k.slice(4) }], proof: 'Not on his résumé or this page.', tier: 'ask' }]
    const s = SKILLS.find((x) => x.id === k)
    return s ? [{ key: k, ask: [{ t: LABELS[k] || k }], proof: s.proof, href: s.href, src: s.src, tier: s.tier }] : []
  })
  if (!rows.length) return null
  return { title: 'A briefing someone shared with you', rows, run: [{ tool: 'link.read', result: `${rows.length} matches`, dep: 'starts here' }, { tool: 'brief.write', result: `${rows.length} lines`, dep: 'after step 0' }], caption: 'Rebuilt from the link by rules. The original text never travels.', mode: 'shared', keys: rows.map((r) => r.key || ''), subject: 'A role for you' }
}

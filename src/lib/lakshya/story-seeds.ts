export const ANIMESH_STORIES = [
  {
    company: 'MakeMyTrip',
    title: 'Crushed 1000+ Production Errors in 48 Hours',
    situation:
      'Hotels booking platform had 1000+ recurring Sentry errors degrading UX',
    task: 'Identify root cause and eliminate without disrupting live booking',
    action:
      'Audited Sentry patterns, traced to shared component, fixed with backward-compatible patch, added regression tests',
    result:
      'Resolved 1000+ errors within 48 hours, significantly improving platform stability',
    tags: ['debugging', 'performance', 'stability', 'speed'],
  },
  {
    company: 'MakeMyTrip',
    title: 'Lighthouse Score 6 to 9 on Hotels Funnel',
    situation:
      'SSR Hotels funnel had poor Lighthouse scores (~6) hurting SEO and Core Web Vitals',
    task: 'Improve performance without redesigning the product',
    action:
      'Profiled rendering pipeline, optimized SSR flow, fixed LCP bottlenecks, code splitting, critical path improvements',
    result:
      'Average Lighthouse from ~6 to 8-9. Measurable SEO and UX improvement.',
    tags: ['performance', 'SSR', 'web vitals', 'SEO'],
  },
  {
    company: 'Paytm',
    title: 'Soundbox Revamp — 40% Sales Increase',
    situation:
      'Soundbox purchase journey had UX friction causing merchant checkout drop-offs',
    task: 'Revamp end-to-end purchase journey to reduce friction and improve conversion',
    action:
      'Simplified UX flow, optimized checkout steps, collaborated with design and backend',
    result: '40% increase in EDC device sales, confirmed by business team',
    tags: ['product', 'conversion', 'UX', 'fintech'],
  },
  {
    company: 'Paytm',
    title: 'Legacy Platform to Modern React Architecture',
    situation: '~3M active merchants on legacy platform with poor maintainability',
    task: 'Lead migration to modern React without disrupting merchant operations',
    action:
      'Architected new React structure, migrated flows incrementally, established patterns',
    result:
      'Lighthouse from ~6 to 8-9, significantly better maintainability and developer velocity',
    tags: ['architecture', 'migration', 'scale', 'leadership'],
  },
  {
    company: 'Airtel',
    title: 'Tech Lead: Acquisition Architecture for 150M MAU',
    situation:
      'Airtel Thanks App MWeb/DWeb needed scalable architecture for acquisition and SKYC journeys',
    task: 'Own end-to-end architecture, code review gate, and delivery for 5-7 engineer team',
    action:
      'Designed HLD/LLD with Architect sign-off, integrated PageSpace, set up GrowthBook, Jenkins CI/CD, Kibana observability',
    result:
      'Stable architecture serving 150M MAU across prepaid, postpaid, Airtel One, Airtel Black, SKYC flows',
    tags: ['leadership', 'architecture', 'scale', 'telecom'],
  },
  {
    company: 'MakeMyTrip',
    title: 'Component Architecture — 30% Faster Onboarding',
    situation: 'New engineers onboarded slowly due to inconsistent UI patterns',
    task: 'Design modular reusable component architecture to standardize patterns',
    action:
      'Built component library with clear APIs, wrote documentation, standardized naming',
    result: '~30% reduction in developer onboarding time per team lead feedback',
    tags: ['architecture', 'DX', 'mentoring', 'documentation'],
  },
];

export type CaseStudy = {
  slug: string
  id: string
  name: string
  emphasis: string
  tagline: string
  status: string
  statusTone: 'live' | 'building' | 'evolving'
  live?: string
  repo?: string
  role: string
  year: string
  stack: string[]
  problem: string[]
  approach: { title: string; body: string }[]
  outcome: { metric: string; label: string }[]
  closing: string
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'friday',
    id: 'EXP-002',
    name: 'FRIDAY',
    emphasis: '',
    tagline: 'Local-first personal AI agent for macOS.',
    status: 'BUILDING · PHASE 2',
    statusTone: 'building',
    role: 'Solo build — architecture, code, evals',
    year: '2026',
    stack: ['Python', 'Ollama', 'Qwen3', 'SQLite', 'Telegram', 'CLI', 'Whisper'],
    problem: [
      'Cloud agents leak. Every prompt, every file, every context — shipped somewhere else.',
      'Assistants are dumb by default: no memory, no governance, no safety rails for a tool that shells out commands.',
      'I wanted a Jarvis — one that actually lived on my machine, knew my projects, and would refuse to do something stupid.',
    ],
    approach: [
      {
        title: 'Governor',
        body: 'Three execution tiers — Light (local + cheap), Build (local reasoning + tools), Heavy (full orchestration + web + code). Picked by classifier per-prompt, not per-model.',
      },
      {
        title: 'Memory Graph',
        body: 'SQLite-backed episodic store. 1,247 nodes after 2 weeks of use. Wings → Rooms → Drawers hierarchy (people → topics → verbatim). Indexed + recalled via semantic search.',
      },
      {
        title: 'Safety Layer',
        body: 'Every destructive tool call goes through a shadow simulator first. Agent cannot touch the real filesystem without shadow-passing. Blast-radius scored before execution.',
      },
      {
        title: 'Interfaces',
        body: 'Telegram (on-the-go), CLI (terminal power), voice via Whisper. Zero web UI — that would defeat the point.',
      },
    ],
    outcome: [
      { metric: '1,247', label: 'memory nodes indexed' },
      { metric: '48GB', label: 'runs on M5 Pro local' },
      { metric: '0', label: 'prompts leaked to cloud' },
    ],
    closing:
      'Phase 2 adds gateway + prompt builder for multi-model routing. Phase 3 will port the memory layer to a portable Rust binary so FRIDAY can live on any UNIX-flavored machine.',
  },
  {
    slug: 'lakshya-hub',
    id: 'EXP-001',
    name: 'Lakshya Hub',
    emphasis: 'Hub',
    tagline: 'Unified AI Job Search OS.',
    status: 'LIVE · BUILDING',
    statusTone: 'building',
    live: 'https://lakshyahub.vercel.app',
    role: 'Product + Full stack',
    year: '2025 – 2026',
    stack: ['Next.js 15', 'Zustand', 'Supabase SSR', 'Claude API', 'Tailwind'],
    problem: [
      'Job search tooling is fractured: resume builder in one tab, tracker in another, cover-letter gen in a third.',
      'My own earlier projects (insaneResumake + Lakshya V1) were the same disease.',
      'Needed one product that handled the whole loop — find, apply, track, iterate.',
    ],
    approach: [
      {
        title: 'Kanban Board',
        body: 'Supabase-backed application pipeline with drag-sort status transitions. Real-time sync across tabs. 12 applications tracked per user on average.',
      },
      {
        title: 'AI Resume Builder',
        body: 'Harvard-template resume with ATS-score feedback (94/100 target). Bullet rewriter uses Claude to compress weak bullets. 8-of-10 rewrites accepted on first pass.',
      },
      {
        title: 'Recruiter Heatmap',
        body: 'Anonymized activity from all users — when recruiters at Company X reach out, when they respond, how long. Opt-in, aggregated.',
      },
    ],
    outcome: [
      { metric: '94/100', label: 'target ATS score' },
      { metric: '12', label: 'avg applications tracked' },
      { metric: '1', label: 'replacing 3 earlier tools' },
    ],
    closing:
      'Next: public leaderboard (opt-in) — who got interviews, where, with what resume. Remove the information asymmetry.',
  },
  {
    slug: 'superagent',
    id: 'EXP-003',
    name: 'SuperAgent',
    emphasis: 'Agent',
    tagline: 'Personal Claude routing brain.',
    status: 'EVOLVING DAILY',
    statusTone: 'evolving',
    repo: 'https://github.com/animeshbasak/SuperAgent',
    role: 'Architecture + every skill',
    year: '2025 – present',
    stack: ['Claude Code', 'Skills', 'Subagents', 'MCP', 'Bash', 'Python'],
    problem: [
      'Claude Code is powerful, but you still pick the workflow by hand. Brainstorm? Debug? TDD? The right skill depends on the prompt.',
      'Picking wrong means bad output. Picking right every time takes discipline nobody has.',
      'I wanted routing: give it the prompt, let it score against every skill, invoke the chain.',
    ],
    approach: [
      {
        title: '/superagent Router',
        body: 'Slash command reads user intent, scores against 47 skills by signal (keywords, file context, session state). Top-scored chain dispatched automatically.',
      },
      {
        title: 'Graphify + MemPalace',
        body: '71.5× token reduction per query on codebase nav (graphify). 96.6% retrieval accuracy on cross-session memory (mempalace). Both built in to every session.',
      },
      {
        title: 'Auto-Calibration',
        body: 'Token-saved tracker runs after every tool call. Compression ratio measured per-project. Stats exposed in /token-stats.',
      },
      {
        title: 'Open Install',
        body: 'One bash command installs the full stack — 4 plugins + 2 Python tools + hook config. Working on publishing as a canonical distribution.',
      },
    ],
    outcome: [
      { metric: '47', label: 'skills auto-routed' },
      { metric: '71.5×', label: 'token reduction (graphify)' },
      { metric: '96.6%', label: 'memory retrieval accuracy' },
    ],
    closing:
      'The system improves itself: every correction I feed back becomes a saved memory, every new skill auto-registers. By next quarter I want it to suggest new skills based on repeat patterns it detects.',
  },
  {
    slug: 'insanemesh-ai',
    id: 'EXP-004',
    name: 'insanemesh.ai',
    emphasis: 'mesh',
    tagline: 'Zero-touch AI content pipeline.',
    status: 'LIVE · ZERO-TOUCH',
    statusTone: 'live',
    live: 'https://instagram.com/insanemesh.ai',
    role: 'Architecture + all automation',
    year: '2025 – present',
    stack: ['Gemini Flash', 'Groq Llama 3.3', 'Puppeteer', 'Telegram', 'Meta API'],
    problem: [
      'I wanted to prove an AI content pipeline could run with zero human input daily — not assisted, fully automated.',
      'Most "AI content" tools still need a human for every step. Concept, caption, asset, post.',
      'If AI can really do end-to-end, it should be able to run a public Instagram account for 90 days without me.',
    ],
    approach: [
      {
        title: '7 PM IST Trigger',
        body: 'Cron fires daily. Gemini Flash generates concept → Groq Llama 3.3 writes caption → Puppeteer renders tile → Telegram pings me (approval optional, not required) → Meta API posts.',
      },
      {
        title: 'Style Lock',
        body: 'System prompt fixes voice, tone, palette. Concepts rotate through themed axes (AI news, build log, humor, technical) without repeating in a 7-day window.',
      },
      {
        title: 'Public Build Log',
        body: 'Feed serves double as a live demo. Every miss, every repeat, every unhinged output is public. 90-day visible track record.',
      },
    ],
    outcome: [
      { metric: '42', label: 'consecutive days live' },
      { metric: '0', label: 'manual posts required' },
      { metric: '~$0.08', label: 'cost per post (all APIs)' },
    ],
    closing:
      'Next: add auto-engagement layer — reply to comments using same pipeline, respect guardrails. The end-state is a fully agentic social presence that never pretends to be human.',
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug)
}

export function getAllCaseStudySlugs(): string[] {
  return CASE_STUDIES.map((c) => c.slug)
}

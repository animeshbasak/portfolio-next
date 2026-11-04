/** Reviewed public portfolio content. */
// Already published in the profile, contact and homepage; shared with the public assistant.
export const biography = {
  location: 'New Delhi, India',
  education: 'B.Tech in Computer Science and Engineering, Inderprastha Engineering College, Delhi NCR (2014–2018).',
  resume: '/resume-public.pdf',
} as const
export const career = [
  {
    "id": "airtel-digital",
    "company": "Airtel Digital",
    "role": "Lead Engineer",
    "dates": "Jun 2025 — Present",
    "theme": "Connecting the experience across the stack.",
    "narrative": "As Lead Engineer at Airtel Digital, I combine hands-on frontend work with team leadership. I help set the technical direction, review the work and make sure it is ready for release. I care about clear decisions, components people can reuse and a team that understands what it is building. Frontend is my main focus, with delivery also taking me across backend and React Native.",
    "responsibilities": [
      "Own technical design and delivery across frontend, backend and native customer journeys.",
      "Build reusable components, schema-driven interfaces and shared platform utilities.",
      "Connect interface behaviour with API contracts, service orchestration and application state.",
      "Write HLD/LLD and implementation handoffs covering validation, empty states, failures and regression risk.",
      "Guide implementation, review and delivery coordination, using AI-assisted workflows with explicit context and verification."
    ],
    "focus": [
      "React",
      "TypeScript",
      "React Native",
      "HLD/LLD",
      "Engineering quality"
    ]
  },
  {
    "id": "makemytrip",
    "company": "MakeMyTrip",
    "role": "Senior Software Engineer II",
    "dates": "Jul 2024 — May 2025",
    "theme": "Making the experience faster—and more dependable.",
    "narrative": "At MakeMyTrip, my focus was performance and reliability on the travel booking web experience. When someone is choosing a trip, the interface needs to respond well and behave as expected. I worked on the frontend with that in mind: paying attention to the experience people have while moving towards a booking.",
    "responsibilities": [
      "Improve server rendering, loading behaviour and the critical rendering path.",
      "Build reusable components and maintain a clear frontend structure.",
      "Investigate production errors and strengthen regression coverage with automated tests."
    ],
    "focus": [
      "Web performance",
      "SSR",
      "Component architecture",
      "Automated testing"
    ]
  },
  {
    "id": "paytm",
    "company": "Paytm",
    "role": "Software Engineer",
    "dates": "Oct 2021 — Jun 2024",
    "theme": "Evolving established products without losing their users.",
    "narrative": "At Paytm, I helped modernise merchant interfaces with React and built analytics dashboards. The work centred on tools people used to run their businesses, where clear information and familiar workflows matter. During my time there, I contributed to a 40% increase in EDC device sales.",
    "responsibilities": [
      "Lead migration work from legacy frontend workflows to React.",
      "Refine purchase journeys and the structure of merchant interfaces.",
      "Build analytics dashboards and collaborate across engineering and product."
    ],
    "focus": [
      "React",
      "Frontend modernisation",
      "Merchant experiences",
      "Analytics"
    ]
  },
  {
    "id": "sparklin",
    "company": "Sparklin",
    "role": "Frontend Developer",
    "dates": "Jan 2021 — Oct 2021",
    "theme": "Bringing care to everyday interactions.",
    "narrative": "At Sparklin, I built banking interfaces in Angular, with a focus on usability and accessibility. In banking, small points of confusion can make everyday tasks harder than they need to be. I paid attention to how people found their way through the interface and whether they could use it comfortably.",
    "responsibilities": [
      "Develop modular Angular interface components.",
      "Refine workflow usability and accessibility.",
      "Improve interface structure and initial loading behaviour."
    ],
    "focus": [
      "Angular",
      "Accessibility",
      "Usability"
    ]
  },
  {
    "id": "infosys",
    "company": "Infosys",
    "role": "Systems Engineer",
    "dates": "Dec 2018 — Jan 2021",
    "theme": "Building the interface—and checking that it holds up.",
    "narrative": "I started at Infosys, building React and Angular interfaces for banking software and helping check that they worked as expected. That combination shaped how I approach frontend work: pay attention to what people see, then check the behaviour behind it.",
    "responsibilities": [
      "Build React interface modules and reusable components.",
      "Validate API behaviour with Postman.",
      "Automate regression checks with WebDriverIO."
    ],
    "focus": [
      "React",
      "API validation",
      "Postman",
      "WebDriverIO",
      "Regression testing"
    ]
  }
] as const
export const practice = [
  {
    "name": "Frontend systems",
    "items": [
      "React",
      "TypeScript",
      "Shared platforms",
      "Reusable components",
      "Schema-driven UI"
    ]
  },
  {
    "name": "Architecture & quality",
    "items": [
      "Technical design",
      "Web performance",
      "Accessibility",
      "Automated testing",
      "Code review"
    ]
  },
  {
    "name": "Backend & native delivery",
    "items": [
      "API and service integration",
      "Service orchestration",
      "Data contracts",
      "React Native",
      "AI-assisted development"
    ]
  },
  {
    "name": "Independent AI tools",
    "items": [
      "Workflow routing",
      "Memory",
      "Model integration",
      "Human review"
    ]
  }
] as const
export type ProjectSlug = "lakshya" | "paarth" | "friday" | "trader" | "insanemesh" | "tools" | "trinetra"
/**
 * Every project record, kept for history. Owner rule (31 Oct 2026): the public site shows only
 * finished or live work. Lakshya Hub returns when it is fixed; FRIDAY, PAARTH-TRADER and
 * insanemesh.ai are archived. insaneFit appears only as one high-level line on the homepage.
 */
const allProjects = [
  {
    "slug": "lakshya",
    "number": "01",
    "name": "Lakshya Hub",
    "line": "One connected job-search workspace.",
    "description": "An AI-assisted job-search workspace combining discovery, résumé preparation and application tracking. I’m bringing previously separate résumé tooling into the same product.",
    "tags": [
      "Next.js",
      "TypeScript",
      "Supabase",
      "AI-assisted workflows"
    ],
    "href": "https://getlakshya.animeshbasak.com/",
    "action": "Explore the product",
    "post": "lakshya-7-source-unified-search",
    "problem": "A job search is a sequence of connected decisions, but the work often lives in separate places: a résumé, a list of openings and a record of applications. Moving between them makes it harder to keep context and decide what deserves attention next.",
    "approach": "I’m connecting search adapters, persistent application data and résumé preparation in one workspace. A shared, canonical résumé state keeps editing and downstream views aligned.",
    "tradeoff": "When multiple copies of résumé data produced inconsistent behaviour, I prioritised a canonical-state refactor over another symptom-level patch.",
    "limitations": "In active development. The live product and dated build notes may represent different stages.",
    "artifact": "The public product is linked below. The diagram on this page is an original illustration of the workflow, not a product screenshot or a measured result.",
    "question": "How do you keep a connected workflow working from the same source of truth?",
    "stages": [
      "Discover opportunities",
      "Consider the fit",
      "Track the next step"
    ],
    "status": "ACTIVE DEVELOPMENT"
  },
  {
    "slug": "paarth",
    "number": "02",
    "name": "PAARTH",
    "line": "A working method for AI-assisted coding.",
    "description": "PAARTH, formerly SuperAgent, is an open-source layer I built around AI coding tools: workflow routing, persistent memory, action checks and cost controls.",
    "tags": [
      "AI workflows",
      "Skill routing",
      "Memory",
      "Model orchestration"
    ],
    "href": "https://github.com/animeshbasak/Paarth",
    "action": "Explore the repository",
    "post": "superagent-cost-aware-routing",
    "problem": "Coding assistants can lose project context between sessions, repeat setup and apply inconsistent workflows across tools.",
    "approach": "I built a reusable layer around existing coding assistants, connecting task routing, project memory, action checks and budget visibility through inspectable local files.",
    "tradeoff": "Keeping the system as a layer lets it work with existing tools. The integration must respect each tool’s capabilities rather than assume every platform supports the same hooks.",
    "limitations": "Public open-source project under active development. The repository documents current capabilities and platform differences.",
    "artifact": "Conceptual workflow. Earlier writing uses the former name, SuperAgent.",
    "question": "How do you make AI-assisted engineering more consistent across tools?",
    "stages": [
      "Choose a workflow",
      "Recover context",
      "Check the action"
    ],
    "status": "PUBLIC OPEN SOURCE"
  },
  {
    "slug": "friday",
    "number": "03",
    "name": "FRIDAY",
    "line": "A personal agent, built around local constraints.",
    "description": "A local-first personal agent in Python, exploring how orchestration, memory and review can work within the limits of a personal machine.",
    "tags": [
      "Python",
      "Local-first",
      "Orchestration",
      "Memory"
    ],
    "problem": "A personal agent needs to preserve context and use tools without assuming unlimited compute or uninterrupted access to hosted models.",
    "approach": "I’m building the orchestration, memory and control layers, with different execution modes for different levels of work.",
    "tradeoff": "Local resource limits shape the architecture: tasks should receive an appropriate amount of compute, with checks around tool use.",
    "limitations": "In development. Core systems are implemented; further integration and evaluation remain ongoing.",
    "artifact": "Conceptual workflow based on my project account.",
    "question": "How much machinery does this task actually need?",
    "stages": [
      "Understand the task",
      "Allocate the work",
      "Review the result"
    ],
    "href": "/blog/friday-phase-4-arena",
    "action": "Read the build note",
    "post": "friday-phase-4-arena",
    "status": "IN DEVELOPMENT"
  },
  {
    "slug": "trader",
    "number": "04",
    "name": "PAARTH-TRADER",
    "line": "Research first. Paper trading only.",
    "description": "A local-first trading research system I’m developing: a desk of Claude skills that scan, plan, size, risk-check and replay each trade, with paper books judged against a go/no-go scorecard set before any result.",
    "tags": [
      "Python",
      "Research tooling",
      "Paper trading",
      "Evaluation"
    ],
    "problem": "A convincing trading demonstration is not evidence that a strategy is ready for real capital. Research needs repeatable comparisons and explicit limits.",
    "approach": "I’m building an experimental workflow around candidate comparison, readiness checks and staged evaluation in simulated trading.",
    "tradeoff": "Progression depends on evidence from evaluation. The system remains a research project using paper trading, rather than a live-money product.",
    "limitations": "Paper-trading research only. No live-money operation or investment-performance claim.",
    "artifact": "Conceptual workflow based on my project account.",
    "question": "What evidence should be required before an experiment advances?",
    "stages": [
      "Define the experiment",
      "Compare candidates",
      "Evaluate readiness"
    ],
    "href": null,
    "action": null,
    "post": null,
    "status": "PAPER-TRADING RESEARCH"
  },
  {
    "slug": "insanemesh",
    "number": "05",
    "name": "insanemesh.ai",
    "line": "From an idea to a reviewable draft.",
    "description": "An independent content automation workflow I built to connect drafting, asset creation and human review.",
    "tags": [
      "Automation",
      "AI workflows",
      "Human review"
    ],
    "href": "/blog/insanemesh-ai-automation-architecture",
    "action": "Read the build note",
    "post": "insanemesh-ai-automation-architecture",
    "problem": "Generating a draft is only one part of publishing. Repeated handoffs make a content workflow difficult to follow and maintain.",
    "approach": "I separated idea development, asset creation and review into distinct stages, with a human decision before publication.",
    "tradeoff": "Automating preparation saves repeated work. Keeping publication behind review preserves an intentional decision about what leaves the system.",
    "limitations": "Documented in a dated public build note. The article describes the workflow at that point in its development.",
    "artifact": "Conceptual workflow based on the public build note.",
    "question": "Where should automation hand the decision back?",
    "stages": [
      "Develop the idea",
      "Prepare the draft",
      "Review before publishing"
    ],
    "status": "DOCUMENTED BUILD"
  },
  {
    "slug": "trinetra",
    "number": "06",
    "name": "Trinetra",
    "line": "Keeps a Mac awake while its agents work.",
    "description": "An open-source macOS menu bar app I built so remote-controlled coding agents keep running with the lid closed, then let the Mac sleep when the work is done.",
    "tags": [
      "Swift",
      "macOS",
      "Power management",
      "AI agents"
    ],
    "href": "https://trinetra.animeshbasak.com",
    "action": "Visit the site",
    "post": null,
    "problem": "Remote control lets you drive a coding agent from your phone, but only while the computer stays awake. Closing the lid or a long pause between prompts puts the Mac to sleep and the session stops.",
    "approach": "I track agent activity through Claude Code, Codex, Gemini CLI and Cursor hooks, decide the power state in one pure, tested function, and keep the privileged part to a tiny helper that can only switch lid sleep on or off.",
    "tradeoff": "Keeping a closed laptop awake costs battery and heat, so the battery floor and the automatic revert are mandatory rather than settings.",
    "limitations": "Early v0.1, built from source with a personal signing team; a notarized download is on the roadmap. A system monitor and health alerts are the first switch-on modules of a wider Mac toolkit.",
    "artifact": "The project site has a HyperFrames demo and setup guide; the repository has the design documents, source and tests.",
    "question": "How do you hold a machine awake only as long as the work needs it?",
    "stages": [
      "Notice the work",
      "Hold the Mac awake",
      "Let it sleep again"
    ],
    "status": "PUBLIC OPEN SOURCE"
  }
] as const
const PUBLIC = new Set<string>(['paarth', 'trinetra'])
export const projects = allProjects.filter((p) => PUBLIC.has(p.slug))
export const archivedProjects = allProjects.filter((p) => !PUBLIC.has(p.slug))
export const contactLinks = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/animeshbasak' },
  { name: 'GitHub', href: 'https://github.com/animeshbasak' },
  { name: 'WhatsApp', href: 'https://wa.me/919971340719' },
  { name: 'X', href: 'https://x.com/animeshsbasak' },
  { name: 'Instagram', href: 'https://instagram.com/insanemesh.ai' },
] as const

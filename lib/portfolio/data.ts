/** Reviewed public portfolio content. */
export const career = [
  {
    "id": "airtel-digital",
    "company": "Airtel Digital",
    "role": "Lead Engineer",
    "dates": "Jun 2025 — Present",
    "theme": "Technical direction, with hands-on delivery.",
    "narrative": "At Airtel Digital, I work on shared frontend platforms and reusable UI capabilities across web and mobile. My responsibilities span technical design, implementation, code review and release readiness. Alongside my frontend focus, I use AI-assisted development to contribute to backend integration and React Native experiences.",
    "responsibilities": [
      "Shape frontend architecture and translate requirements into technical designs.",
      "Develop reusable components and schema-driven UI capabilities within shared platforms.",
      "Use AI-assisted development for scoped backend integration and React Native contributions.",
      "Guide implementation, code review and release readiness."
    ],
    "focus": [
      "React",
      "TypeScript",
      "Shared frontend platforms",
      "Schema-driven UI",
      "AI-assisted backend & React Native contributions"
    ]
  },
  {
    "id": "makemytrip",
    "company": "MakeMyTrip",
    "role": "Senior Software Engineer II",
    "dates": "Jul 2024 — May 2025",
    "theme": "Making the experience faster—and more dependable.",
    "narrative": "I worked on consumer travel experiences across web interfaces, with a focus on rendering performance, reusable frontend structure and production reliability. The role combined performance investigation with component development and automated testing, connecting how the interface was built with how reliably it behaved for users.",
    "responsibilities": [
      "Improve server rendering, loading behaviour and the critical rendering path.",
      "Build reusable components and maintain a clear frontend structure.",
      "Investigate production errors and strengthen regression coverage with automated tests."
    ],
    "focus": [
      "SSR",
      "Web performance",
      "Component architecture",
      "Vitest",
      "Jest",
      "React Testing Library"
    ]
  },
  {
    "id": "paytm",
    "company": "Paytm",
    "role": "Software Engineer",
    "dates": "Oct 2021 — Jun 2024",
    "theme": "Evolving established products without losing their users.",
    "narrative": "I worked on modernising merchant-facing interfaces, moving established workflows toward React and refining the journeys people used to complete transactions. Alongside the interface work, I built analytics dashboards and supported product decisions with clearer visibility into how those journeys were being used.",
    "responsibilities": [
      "Lead migration work from legacy frontend workflows to React.",
      "Refine purchase journeys and the structure of merchant interfaces.",
      "Build analytics dashboards and collaborate across engineering and product."
    ],
    "focus": [
      "React",
      "Frontend modernisation",
      "Merchant experiences",
      "Analytics",
      "Product collaboration"
    ]
  },
  {
    "id": "sparklin",
    "company": "Sparklin",
    "role": "Frontend Developer",
    "dates": "Jan 2021 — Oct 2021",
    "theme": "Bringing care to everyday interactions.",
    "narrative": "I built modular frontend interfaces for banking workflows, where clear navigation and dependable behaviour matter to everyday tasks. My focus was on Angular UI development, component structure and usability, with attention to accessibility and how the experience performed when it first loaded.",
    "responsibilities": [
      "Develop modular Angular interface components.",
      "Refine workflow usability and accessibility.",
      "Improve interface structure and initial loading behaviour."
    ],
    "focus": [
      "Angular",
      "Modular UI",
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
    "narrative": "My career began with frontend development and quality engineering for banking software. I worked on React modules alongside API validation and regression automation, combining interface implementation with checks on the services and behaviours it depended on.",
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
    "name": "Backend & React Native contributions",
    "items": [
      "AI-assisted development",
      "API integration",
      "Data contracts",
      "React Native experiences"
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
export type ProjectSlug = "lakshya" | "paarth" | "friday" | "trader" | "insanemesh" | "tools"
export const projects = [
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
    "description": "A local-first trading research system I’m developing to compare strategies and model choices through controlled paper-trading experiments.",
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
  }
] as const
export const contactLinks = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/animeshbasak' },
  { name: 'GitHub', href: 'https://github.com/animeshbasak' },
  { name: 'WhatsApp', href: 'https://wa.me/919971340719' },
  { name: 'X', href: 'https://x.com/animeshsbasak' },
  { name: 'Instagram', href: 'https://instagram.com/insanemesh.ai' },
] as const

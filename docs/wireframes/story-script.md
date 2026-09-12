# Through the layers — portfolio storyboard

Design proposal 01 · 12 September 2026 · Awaiting design review, not approved for implementation.

Open the connected wireframes at http://localhost:3010/#/concept. The revised mobile prototype is at http://localhost:3010/#/mobile/home. The artifact lives in `docs/wireframes/`; it does not modify the portfolio application. Start its local viewer with `python3 -m http.server 3010 --bind 127.0.0.1 --directory docs/wireframes` from the repository root. The existing development portfolio remains on port 3001.

## The story

**What you see is an interface. What makes it work is underneath.** The site introduces Animesh through a visible assembly of layers. Opening that assembly reveals a factual career record, independently owned work, a decision the visitor can challenge, authored Writing, and an invitation to collaborate. The story moves from identity to evidence to participation, then returns to the person.

“Through the layers” is the working creative direction, not a new product brand that must be plastered over every page. Animesh’s name is the main identity. This is a present-day editorial view of his work, not a claim that he held particular beliefs or learned a specific lesson at a named employer. Career chronology and the conceptual layers are separate.

The reference is [Tomotsugu Oyamada’s portfolio](https://to-portfolio.com/about). Its relevant qualities are a shared spatial atmosphere, frosted content surfaces, technical linework, varied compositions and deliberate scene handoffs. The [local reference study](../research/2026-09-12-to-portfolio-study.md) records observations and verified technical clues. We do not reuse its globe, orbital cube core, artwork, source code, copy, sound ritual or reconstruction loop. The open interface assembly and the requirement-controlled fork are our subject-specific design.

## Concepts considered

**A — Through the layers, recommended.** An open assembly gives the requested physical segregation a clear purpose. Its surfaces become content carriers; the deep camera move happens when the visitor examines a decision. The AI’s result can alter the same visible branches. Main risk: thin stacked planes could feel like generic tech decoration. Resolve this with actual owned interface fragments, visible connections to content, strong silhouette changes and a designed Work → Studio handoff.

**B — Traces of a build.** A silver routed landscape connects career and project nodes. A change in requirements reroutes a trace. It provides a strong journey metaphor but weaker physical separation and is more susceptible to looking like a generic circuit board. Keep as an alternative if the assembly feels too abstract.

**C — The working model.** Individual projects sit as illuminated specimens on a spatial workbench. Opening one reveals annotated workings and a linked experiment. This is strong for case studies but makes the overall career narrative less continuous. The detailed wireframes develop A; B and C are inexpensive direction comparisons, not three fully designed websites.

## Visual grammar

The palette is silver `#E8EDEE`, graphite `#242D30`, blue-gray edge tones, and a limited warm signal `#B44220`. Silver surfaces preserve the reference’s atmosphere; assertive grotesk name typography and a warm accent reconnect with the character of V6. Avoid the rejected paper, serif and editorial-book treatment. This proposal supersedes the visual direction in `2026-09-12-built-over-time.md`; the intelligence contract in `2026-09-12-change-one-thing.md` remains valid except for that old visual identity.

Use one grotesk family with a compact monospaced family for metadata. The wireframes use system fonts so the review requires no font download. Final font selection follows a specimen comparison. Suggested display scale: 64–120 px desktop, 48–64 px phone; body 16–18 px with comfortable leading; controls at least 14 px and 44 px touch targets. Small wireframe annotations are review chrome, not the final content type scale. Core text should meet WCAG AA contrast; pale linework is decorative only.

Panels are real HTML with readable text, a thin border, restrained transparency and a subtle background blur. Canvas supplies depth behind selected elements; it never owns the biography or replaces buttons with hit-tested meshes. Use corner details sparingly. There is no pretend telemetry, random percentage, invented status console or score. Readable compositions must work as still images before adding motion.

## Page map and interconnected journeys

| Destination | Content | Entry | Exit / related destination |
|---|---|---|---|
| `/` | Six home chapters | Direct visit; name link | Profile, Work, Studio, Writing, Contact |
| `/profile` | Biography, five roles, practice, verified record and attributed testimonials | Navigation; Career chapter | Work, résumé, Contact |
| `/work` | Three current independent project groups | Navigation; Home Work chapter | Each case study; Writing; Studio |
| `/work/lakshya` | Lakshya Hub case study | Work index; Home selected project | Product, related article, Studio, next work |
| `/work/paarth` | PAARTH Agent case study | Work index; previous/next | Public development plan, related article, Studio |
| `/work/tools` | PAARTH + insanemesh.ai project group | Work index; previous/next | Repository, related article, Studio |
| `/studio` | Guided experiment, AI clarification, comparison, challenge and replay | Navigation; relevant Home, project or article CTA | Return to exact entry context; Writing; Contact |
| `/blog` | Existing Writing archive | Navigation; Home Writing chapter | Each of eleven existing article slugs |
| `/blog/:slug` | Existing reviewed article | Archive; related case study | Related work, Studio, archive, Contact |
| `/contact` | Existing email/social links and public résumé | Navigation; home closure; case study | Contact destinations, résumé, opening scene |
| `/resume.pdf` | Reviewed public résumé | Profile, Contact, footer | Browser download/view, no private attachment exposed |

The review artifact uses hash routes rather than changing any production routes. Existing `/blog` routes stay canonical in the proposal; “Writing” is the navigation label. Preserve old section anchors `#about`, `#timeline`, `#record`, `#projects`, `#blog`, and `#contact` as equivalent destinations or scroll anchors. Before rollout, map the current V6 root to an explicit archive route (proposed `/v6`) and keep `/legacy`. The wireframe links to the current local versions; the archive move is not implemented.

A recruiter can go Home → Profile → résumé or Work → case study → Contact without any AI interaction. A curious engineer can go Home → Work → Studio → failing case → replay → related Writing. A reader entering an article directly can open Studio and return to the same reading position. These are coequal paths, not a forced tour. The final implementation must restore scroll and focus when leaving Studio; the current review preserves the return route only.

## Home scene script

### 00 — Identity: see the person

**Visible copy:** “Animesh Basak.” Supporting line: “I build interfaces, systems and tools. Explore the work—and the decisions beneath it.” Role line: “Lead engineer / Web · Mobile · AI systems.” Primary action: “Selected work.” Secondary: “Explore my journey.” Navigation, Contact and résumé are reachable immediately.

**Composition:** the name dominates the upper left. A large open assembly sits partly behind the lower-right area, with one warm trace running through it. It is a recognizable object with depth and negative space, not a screen-filling particle background. No boot gate or audio choice blocks entry. As scrolling begins, the six surfaces open; the camera rotates into a side view. Identity text exits before the largest movement.

### 01 — Career: see the accumulation

**Visible copy:** “Five roles. A wider perspective.” Supporting line: “From systems engineering to leading frontend work across web and mobile.” Show Infosys → Sparklin → Paytm → MakeMyTrip → Airtel Digital, with factual dates and roles. “Read the full record” opens Profile.

**Composition:** the assembly becomes a lateral cross-section spanning the viewport. Five role panels sit along a rail, each a normal DOM link. The current role receives the accent, not a speculative impact number. The reading hold is long enough to scan all roles without chasing moving text. Scrolling further clears the role copy; an independent project surface moves through the frame to the front.

### 02 — Work: see something that can be opened

**Visible copy:** “Ideas made inspectable.” Supporting line: “Independent products and tools offer a closer look at how I build.” Featured: Lakshya Hub, “A more considered job search.” Actions: “Open the project”, “All selected work”, “Change one thing.” Other existing project groups remain reachable in the index.

**Composition:** a large owned interface image is angled on the left. Title, purpose and actions form a compact counterweight on the right. The selected surface becomes its case-study image when opened. To continue toward intelligence, it separates into interface, pattern and constraint layers. These are editorial categories used to explain an independent artifact, never exposed employer architecture.

### 03 — Intelligence: inspect the decision

**Visible copy:** “Change one thing. See what it changes.” Invitation: “Can something feel instant and stay current? Set the requirement. Compare two choices. Find where one fails.” Actions: “Try the experiment” and “Continue to Writing.” The experiment is labeled independent and synthetic.

**Composition:** the camera travels between the separated layers and briefly enters an event field. Individual event points replace the large interface fragments. At a constraint, one trace becomes two; the camera settles into a symmetrical comparison, with one shared requirement above both branches. This is the most immersive motion interval, deliberately placed after the work has established context. During the actual experiment, changing a requirement affects the scene and result from the same trusted state.

### 04 — Writing: see the thinking made explicit

**Visible copy:** “Build. Question. Write it down.” Supporting line: “Notes on engineering, independent projects and AI tools.” A selected existing article is a large surface facing the visitor. “Explore Writing” opens the full eleven-entry inventory.

**Composition:** the two experiment branches converge into a trace that resolves onto a note surface. Spatial depth compresses, the background quiets, and the main surface becomes flat. The archive and article routes prioritize reading. No camera travels through paragraphs; motion stays at the boundary between destinations.

### 05 — Contact: leave an opening

**Visible copy:** “What should we build next?” The dedicated page expands this to “Let’s build something considered.” Show New Delhi, the existing professional email, GitHub, LinkedIn and résumé. WhatsApp, X and Instagram are also retained from the existing Contact source.

**Composition:** the layers gather into the opening assembly, leaving a deliberate gap beside the invitation. The loop is a compositional return. “Return to the beginning” completes it explicitly; scrolling is not forcibly reset. A visitor who scrolls backwards sees the same stages in reverse. There is no infinite scrolling trap or cumulative reconstruction counter.

## Motion connection contract

| Connection | Exit pose | Intermediate pose | Arrival pose |
|---|---|---|---|
| Identity → Career | Open assembly, name left | Rotate toward side; edges align into rail | Career cross-section, roles steady |
| Career → Work | Career panels clear reading area | Selected project surface moves forward | Angled project left, story right |
| Work → Studio | Interface separates into layers | Enter particle/event field; trace forks | Two result surfaces, one requirement |
| Requirement → changed outcome | Keep original branch visible | Highlight first failing predicate | Result and replay action legible |
| Studio → Writing | Branches compress into trace | Trace enters one note surface | Stable archive composition |
| Writing → Contact | Notes separate outside text area | Edges realign into original silhouette | Large contact invitation beside assembly |

Initial text and navigation render immediately. Proposed route transition duration is 450–700 ms; final values need visual evaluation. Scroll transitions occupy roughly 0.5–0.8 viewport of travel, separated by natural reading intervals. Scrubbed motion should track the visitor’s scroll direction with limited smoothing, not run a timed film that ignores input. Large transforms finish before body copy enters its reading position. Hover responses are short and optional.

Model Home as a sequence of readable poses and reversible transitions. Direct links initialize the destination pose without requiring a previous visit. Navigation can interrupt a transition; outgoing and incoming content must never leave the screen empty. Each route remains an ordinary document with a persistent visual layer as progressive enhancement. A final single-transition prototype should prove camera choreography, interruption, reverse scroll and mobile fallback before the whole site is built.

## Proof Studio: complete original intelligence contract

The signature remains **“Change one thing. See what it changes.”** Its deeper action is **“Find where this fails.”** AI translates a vague question into a visible, editable requirement, selects one supported experiment and explains actual result evidence. Trusted code evaluates the outcomes. No generated code is executed. The AI is not an avatar pretending to reproduce Animesh’s private thoughts, and cannot invent career memories.

The first experiment is an original synthetic reading board with two fixed implementations. Cache-first shows a saved copy with an age label and refreshes in the background. Network-first waits for a verified response. Both consume exactly the same scenario. “Age” means time since last verification against the synthetic source. “Verified during this visit” is a separate predicate, not a floating-point comparison to zero age.

| Requirements | Cache-first | Network-first | Expected authored example |
|---|---|---|---|
| 150 ms deadline; up to 120 s old | Meets both | Misses waiting | Cache-first fits here |
| 150 ms deadline; verified during this visit | Misses freshness | Misses waiting | Neither offered choice fits both |
| 1,000 ms deadline; verified during this visit | Misses freshness | Meets both | Network-first fits here |

These examples use a cached copy verified 45 seconds ago and a successful response at 800 ms. They are contract expectations, not measurements from a completed engine. The wireframe’s controls switch authored examples. It makes no API calls or performance measurements.

### Interaction and state script

1. **Ready:** default question and an obvious “Try the experiment”. No blank chatbot requiring a clever prompt.
2. **Question:** the eventual AI asks whether “current” means verified in this visit or whether a two-minute-old copy is acceptable. The visitor confirms with normal controls. A later arbitrary-question input must be bounded and clearly identify AI processing.
3. **Comparison:** show both strategies, shared scenario, visible requirements and evaluated result. Keep copy understandable without opening technical details.
4. **Challenge:** run a finite declared set. Initial proposed search: cache ages `[0, 45, 121]` seconds × response delays `[80, 800, 1500]` ms, successful responses only. Iterate age ascending, then delay ascending; report the first failure for the selected strategy, the failing predicate and tested scope. Failure events can be added as separately versioned scenarios later.
5. **Counterexample:** a 121-second-old saved copy violates a 120-second age limit at first display. With an 800 ms response and 150 ms deadline, network-first also misses the deadline. This illustrative trace demonstrates a limit; it is not a general impossibility theorem.
6. **No counterexample found:** say exactly “No counterexample found in the tested scenarios.” Show which nine scenarios were tested. Never say “This always works.”
7. **Neither fits:** state which predicate each offered strategy missed. Do not force a winner or silently change the strategy to manufacture success.
8. **Replay:** replay the same event trace and illuminate the earliest divergence. Store experiment version, content version, seed, configuration and events. Exclude raw prompts and personal text. Browser-only initially; synthetic encoded share links are a later extension, not a dependency.
9. **Explanation:** generated text cites valid result IDs and approved public source IDs. An authored personal note is a separate component with explicit attribution. If a note does not exist, omit that component; do not synthesize an opinion in Animesh’s voice.
10. **Unsupported / private question:** explain scope and return to supported experiments. No employer-system access, arbitrary URL retrieval, private résumé or unpublished design-doc retrieval.
11. **Unavailable / rate limited:** keep deterministic comparison, local controls, counterexample search and replay available; use authored explanations. The UI does not need to expose provider names to ordinary visitors.

The review demonstrates compare, clarification, counterexample, neither, replay, empty-search, loading, unavailable and source-limit states. No real AI, deterministic runner, bounded search, citation system, replay storage or share link is connected in this review artifact.

### Hosting, provider fallback and spending boundary

Keep the site on Vercel. A server endpoint keeps provider keys out of the browser, limits input/output, validates responses against a small schema and supplies only explicitly approved public context. The endpoint can accept an experiment ID, proposed setting changes and an explanation request. AI output never becomes executable code, SQL, a shell command or an arbitrary fetch target. Local experiment results remain authoritative.

Proposed inference route: **Groq Free → Cloudflare Workers AI Free → authored local guide**. [Groq’s official rate-limit documentation](https://console.groq.com/docs/rate-limits) lists free-plan limits and explains organization-level quotas and 429 responses. [Cloudflare’s Workers AI pricing documentation](https://developers.cloudflare.com/workers-ai/platform/pricing/) documents a free daily allocation and paid usage. These are capped services, not unlimited free promises. Exact model choice should follow a small structured-output and explanation-quality evaluation against the available free models, then account-specific quota verification before launch.

Use a hard total timeout, one bounded provider fallback and no automatic paid upgrade. Under expected low traffic the aim is no incremental inference spend, with a useful experience when the free allocation is exhausted. Hosting, the existing domain, abuse protection and traffic growth have separate costs and limits. Do not promise the whole portfolio is cost-free forever. No keys, accounts, billing settings or providers were configured by this design work.

## Dedicated page layouts

**Profile:** broad biography first; full reverse-chronological career record beneath; fourteen practice areas grouped for scanning; verified recognition and attributed recommendations below. The home rail is an overview, not the only place to read the career. The visual object becomes a quiet profile cross-section rather than another hero performance.

**Work:** three current project groups, each with an owned image and concise purpose. **Detail:** image and proposition, then problem, approach, reviewed evidence, trade-off, actual limitations, repository/product link, related Writing and a contextual Studio invitation. Label planning documents and prototypes honestly; do not imply a linked plan is a released feature. A synthetic Studio experiment is independent and cannot serve as evidence of production performance.

**Writing:** all eleven metadata entries are retained in the review. Date, topic and title are the primary scan pattern; later filters must be useful, not ornamental. **Article:** roughly 65–75 characters per line, static body, contents rail, accessible code and diagrams, authored quotes, related project and optional Studio link. Preserve real MDX features after editorial review. Do not turn first-person article text into a testimonial.

**Contact:** direct existing email and social links, reviewed résumé, location and return-to-origin action. No fabricated availability status, employer claim or unnecessary form backend. **Résumé state:** the prototype shows its publication dependency instead of copying the supplied detailed attachment into a publicly served folder.

## Mobile, access and failure states

At phone widths, stack content in the same semantic order. Use restrained layer offsets, short transitions and a clear chapter index. Omit the deep camera dive and dense particle field. In Studio, display the shared requirement first, strategy A second, strategy B third and a shared conclusion last. Do not make a visitor swipe horizontally to compare constraints. Contact targets and navigation remain at least 44 px.

Reduced motion uses static illustrated poses and ordinary page scrolling. Keyboard focus follows the document order; content remains available without hover. If WebGL is unsupported or its context is lost, use the static assembly poster and DOM content. Do not show a spinner indefinitely. Slow assets do not block the name, navigation or text. Direct article links need no canvas startup. AI errors preserve the independent local experience.

No ambient audio is required. Sound can be considered only after the visual and interaction story works, and must default off without an entry gate. Do not inherit the reference’s tiny low-contrast text as a quality target. The initial mobile gallery was rejected during review and replaced by the connected mobile v02 prototype described below. Responsive behavior in this HTML artifact is a review aid, not production accessibility certification.

## Content preservation and publication ledger

| Material | Included in design | Publication action |
|---|---|---|
| Name, location, current role | Home, Profile, Contact | Confirm final headline |
| Infosys, Sparklin, Paytm, MakeMyTrip, Airtel Digital | Home rail and full Profile | Retain accurate role/date facts; broad descriptions |
| Lakshya Hub | Index + detail + related Writing | Verify actual artifact/status and owned images |
| PAARTH Agent | Index + detail + plan link | Distinguish plan, prototype and release |
| PAARTH + insanemesh.ai | Index + detail + repository/Writing | Keep both initiatives visible; confirm public ownership |
| Fourteen practice areas | Profile | Organize without fake proficiency percentages |
| Eleven Writing entries | Archive + article templates | Review complete text before migration; preserve slugs |
| Testimonials | Recognition layout reserved | No attributed third-party testimonials found; source actual approved quotes |
| Education | Profile and mobile record | B.Tech, IPEC, 2014–2018 reconciled with supplied résumé |
| Achievements and additional credentials | Profile/ résumé slots | Verify attributed evidence before publication |
| Employer metrics and details | Tracked as excluded from draft copy | Do not carry forward by default merely because V6 showed them |
| Detailed résumé attachment | Not served or transmitted | Produce reviewed public version before replacing download |
| Email, GitHub, LinkedIn | Contact and global actions | Preserve exact verified destinations |
| WhatsApp, X and Instagram | Contact links | Existing Contact source destinations retained |
| V6 and legacy | Footer links in wireframe | Plan archive route and compatibility redirects before rollout |
| Original intelligence | Full state script + visual states | Implement one complete experiment before expanding |

The user explicitly requested restraint around employer detail. No internal product names, team sizes, private architecture, incident descriptions, employer screenshots or unapproved metrics are used as new public proof. An AI prompt alone is not a publication control: the public dataset must be an explicit allowlist. Existing sensitive articles are retained in the local inventory but excluded from AI context until reviewed. This is an editorial boundary, not a guarantee of legal clearance.

## What to validate before building the site

First review the stills for identity, career, project selection and Studio together. The target is that each reads as a different composition while the material language remains coherent. The most important creative decision is whether the assembly and the Work → Studio particle/fork sequence feel like Animesh’s portfolio, not a generic technology visual.

After that design review, build only one representative transition and one functional reading-board experiment. Observe real scroll behavior, reverse direction, direct navigation, interruption, keyboard operation, phone layout and reduced-motion fallback. Validate the three expected-result contracts, bounded-search honesty and replay reproducibility. Only expand to the complete site after those demonstrate the intended story. Awwwards nomination and universal novelty are aspirations, not promised outcomes.

## Current artifact boundary

This deliverable is a connected HTML wireframe board, original SVG schematics, an existing article metadata inventory and this script. It includes 12 review areas, six home compositions, three project detail variants, all eleven article metadata variants and nine intelligence states. The controls and links are review aids; no production app implementation, WebGL scene, external AI integration, publication, commit or deployment was performed.

The previous implementation remains untouched by this design pass. The prior paper/sculpture direction is superseded as a visual proposal. Content and intelligence requirements that remain useful are explicitly carried into this document so later implementation does not restart the discussion or silently discard them.


## Mobile revision 02 — requested during design review

The initial three-phone gallery was rejected by the user. Mobile now has its own connected prototype at `#/mobile/home`, with a compact atmospheric identity scene, an offset glass project invitation, and a persistent thumb-level dock for Home, Work, Studio and More. The More screen contains the complete index, while Contact is always reachable from the top corner. This supersedes the original gallery, not the desktop storyline.

Career becomes a chronological reading surface with all five roles, their date ranges and a dedicated summary view. Work presents one substantial project surface at a time; all three detail variants lead to the relevant Writing and a contextual Studio entry. The archive retains the eleven existing titles and dates, with article-specific reading templates. Contact retains email, LinkedIn, GitHub, WhatsApp, X, Instagram and the reviewed-public-résumé state. Fourteen practice areas remain on Profile.

Studio uses a sequence instead of compressing the desktop comparison into columns: (1) confirm a shared requirement, (2) read the verdict and vertically ordered evidence for both choices, (3) challenge and replay. The generated-guide clarification, free-provider-unavailable state and bounded empty-search state remain accessible in the review. Replay is a vertical event trace that names the first violated predicate. These are authored examples; mobile does not connect an AI model or simulation engine.

Opening Studio from a mobile project or article records the mobile return route. The final implementation must additionally restore reading position and focus. The artboard's internal scroll simulates a full phone screen; the outer review rail is not part of the portfolio. Selecting a layer opens a stable reading surface. Phone motion should suggest separation with modest offsets and scale changes, rather than replaying the desktop camera tunnel.


## Career revision 03 — descriptive roles on both layouts

The user requested more than a one-line career summary. Each of the five roles now includes a descriptive narrative, three responsibility bullets and a technical-focus list on the main Profile page, in both desktop and mobile wireframes. The mobile record includes company jump links to make the longer page easy to navigate. The concise Home rail remains an overview linking to this full record. Read the exact draft in [career-copy.md](career-copy.md).

The supplied résumé was re-read locally to ground this copy. It confirms Infosys as December 2018–January 2021, Sparklin as January–October 2021, and the existing month ranges for the later three roles. It also confirms the B.Tech in Computer Science and Engineering at Inderprastha Engineering College, Delhi NCR, 2014–2018; this now appears on both Profile layouts. These verified facts replace the earlier education placeholder and coarse early-career dates. No confidential employer metrics or internal product names are added to the draft narrative. The project group also now explicitly names SuperAgent in its description to preserve the résumé’s project reference.

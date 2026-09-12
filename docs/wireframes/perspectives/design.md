> **Current direction: Working Record.** The revision below supersedes earlier descriptions of separate palettes, particle loaders and translucent sheets. Earlier notes are retained as design history.

# A matter of perspective — design system and connected wireframes

Status: proposed design for review. Created 12 September 2026. This artifact does not change the Next.js portfolio or call Groq.

Review: http://localhost:3010/perspectives/#system

## Design decision

Use one design system with four authored edition recipes. Four unrelated systems would create competing identities, inconsistent controls, repeated content maintenance and a larger accessibility burden. Changing colours alone would not deliver a different story. Each edition therefore has a distinct composition, display treatment, chapter sequence and motion choreography built on a common interaction and content contract.

The identity is Animesh Basak, Lead Engineer and independent builder. This is a hiring portfolio: a visitor should quickly understand his role, find relevant evidence and reach the résumé or contact. The entrance asks about interests rather than demanding a visitor identity. The site makes no AGI, award or world-first claim.

## Shared foundation

Tokens in `tokens.css` use three levels: primitive values → semantic roles → component aliases. Primary text, muted text, surface, raised surface, border and accent change with edition. Controls inherit those roles. Shared names prevent four divergent component libraries.

The shared spacing scale is 4, 8, 12, 16, 24, 32, 48, 64 and 96 pixels. Desktop uses asymmetric column compositions with 24–80 pixel gutters; phones use a single reading column with 20–24 pixel gutters. Body copy is 16 pixels at 1.65 line height. Display text is fluid, roughly 54–108 pixels on desktop and 42–60 on mobile. System sans, serif and mono faces are placeholders for later final font selection; mono is only for supporting labels.

Every primary control has a minimum height of 48 pixels. Other actions target at least 44 pixels. Keyboard focus uses a visible 3 pixel accent ring. The main content receives focus after navigation; mobile menus close on Escape and return focus to their trigger. Navigation, résumé and contact remain in the same functional positions. Descriptive career text is visible rather than hidden behind hover interactions.

## Four editions

| Edition | Surface / accent | Type and layout | Sequence | Motion proposal |
|---|---|---|---|---|
| Leadership | Paper / rust | Serif statements, narrow record column, asymmetric editorial sections | Current responsibility → contextual career → independent ownership → writing → contact | Surfaces open as chapters; a margin rule becomes the career rail |
| Interfaces | Silver / cobalt | Large sans, component annotations, interface composition | Surface → decisions → projects → optional experiment and career → contact | A selected interface separates into layers; layers settle into evidence |
| AI work | Graphite / mint | Large sans, connected stages, numbered artifact rows | Workflow → products and plans → boundaries → writing → career → contact | A trace links authored workflow stages; it does not pretend to be live inference |
| Journey | Sand / forest | Serif, large dates, chronological reading | Beginnings → five roles in chronological order → projects → education → contact | Years unfold into a vertical stack; the final chapter remains open |

The shared career, project and article pages inherit the edition’s tokens and retain its navigation context. Their factual bodies do not change. Each home has its own arrangement beyond the hero; it is not a colour-switching template. The full career remains descriptive in all editions.

## Entrance and loading choreography

Opening question: “What would you like to understand about my work?” Answers: “How I lead engineering”, “How I build connected systems”, “What I’m building with AI”, and “How I got here”. An optional free-text field accepts a specific interest. “Explore everything” and the one-page résumé are direct alternatives.

The visual is a suspended folded document whose fragments derive from public career and project content. Arrival: a skippable opening precedes the question; content readiness is shown separately. Selection: relevant fragments become legible. Alignment: surfaces change perspective and resolve into a headline and reading path. Entry: the front surface becomes the real first section, with later surfaces continuing into scroll chapters. A working opening loader now precedes the question: deterministic particles assemble AB, three connected planes rotate and separate, then open into four reading paths before revealing the question. It runs for 4.2 seconds plus a 650 ms fade, with a skip control once the actual content is ready and a replay button on the question. The subsequent one-second answer-selection alignment remains a separate demonstration. The continuous WebGL camera handoff into story chapters is still a future implementation.

Feedback target is 160 milliseconds; small reveals target 360 milliseconds. The entrance alignment targets about one second, never a fabricated network progress percentage. In production the selected HTML should be available immediately and decoration should load progressively. Returning visitors and direct links bypass the entrance. On phones use shallow layers and a vertical handoff, with no camera fly-through. Reduced motion removes spatial transitions and the demonstration delay.

## Intelligence contract — future implementation

Preset answers map directly to one of four authored routes, without model inference. Free text may be sent to a bounded server-side classifier after submit; it returns only approved edition and emphasis identifiers. Prepared copy and layouts supply the rendered content. It must not generate page code, achievements, employment facts or biographies. Never send the résumé, employer context or private source files to this classifier.

A suggested route must be visible and changeable before entry. Mixed or unknown interests offer all four routes; provider timeout or quota exhaustion leaves the presets working. There is no inferred visitor identity, fit score or required personal information. A future session preference can retain only the chosen edition. The review currently uses explicit local keyword matching, labels it as a demonstration and stores no input. Real provider routing is not implemented here.

## Connected pages and preservation

Each of four homes links to Career, Work, Writing and Contact. Work links to five project-detail pages; those link to related writing and public artifacts. The eleven article previews link to the complete existing local articles. Back-to-story links preserve the edition. Change perspective returns to the opening question. Browser back/forward uses hash routing in this review.

The initial content was copied from the current public `lib/portfolio/data.ts` record and `content/blog-public` metadata. Five roles, five independent projects, eleven writing entries and practice areas remain accessible. Education is B.Tech Computer Science & Engineering, Inderprastha Engineering College, 2014–2018. The résumé links to the uploaded original one-page `/resume-public.pdf`; it is not regenerated. V6 and legacy remain linked. The existing Studio is an optional synthetic experiment in the interfaces edition, not the main intelligence concept.

No attributed testimonials have been verified; none are fabricated or inserted as placeholder quotes. Owned product screenshots remain needed for final art direction. The wireframe uses labelled conceptual compositions. PAARTH is explicitly linked as a development plan; its planned capabilities are not presented as released or measured. Employer information uses the broad public career scope already in source.

## Component states

| Component | Default | Interaction / alternate state |
|---|---|---|
| Perspective answer | Label plus edition letter, full-width row | Hover/focus accent; selection disables repeat submission until entry; reduced-motion entry is immediate |
| Custom question | Visible label, 240-character limit, submit arrow | Empty input asks for a choice; unknown/mixed input retains all routes; recognized intent shows a confirmable suggestion |
| Navigation | Stable career/work/writing/contact | Mobile menu and persistent four-item dock; Escape restores trigger focus |
| Project artifact | Title, description, conceptual diagram, status label | Opens detail with problem, approach, trade-off, limitations, public source and related writing |
| Résumé | Direct link to the original PDF | Opens an existing local destination; no form or email collection |
| Loading | Readable name/question; actual content-loading message if needed | Failure shows a readable error; no infinite simulated progress |

## Review boundaries and next decision

This is a connected, responsive wireframe and art-direction proposal. It is not final typography, owned imagery, full article layout implementation, production routing, WebGL scroll animation or an AI classifier. External links point to current public project artifacts and the existing local portfolio on port 3001. The review server on port 3010 serves only `docs/wireframes`, never environment credentials.

Review the four compositions on desktop and mobile, then choose which treatments to retain or change. Once the design is accepted, prototype the entrance-to-first-section continuity and one representative scroll transition before implementing the full new routing architecture. No production implementation or deployment is included in this design task.

## Verification

See `verification.md` for the checks performed on this artifact. Browser checks establish layout and interaction behavior in the tested environment; they do not establish mobile hardware performance or award quality.

## Working loader update

Open http://localhost:3010/perspectives/preview.html#loader to play the actual loader. Its three labelled stages describe visual choreography, not download percentages. The readiness label reflects the content fetch; that fetch has an eight-second timeout and a readable failure state. Direct story URLs bypass the loader. Reduced motion uses a still frame until content is ready, then reveals the question immediately. Background rendering pauses while the document is hidden. Canvas resolution is capped at 1.5 device pixel ratio. No packages or AI inference are required.


## Content and opening revision — 12 September 2026

The wireframe now incorporates the content review and the user’s consolidated account at a high level. Frontend systems and architecture remain the specialization. Backend integration and React Native contributions are explicitly AI-assisted. Internal employer names, journey details, metrics, release topology and incidents are excluded from the revised copy.

Independent work: Lakshya Hub, PAARTH (formerly SuperAgent), FRIDAY, PAARTH-TRADER and insanemesh.ai. The current PAARTH repository at https://github.com/animeshbasak/Paarth was read to ground its description as an open-source layer around AI coding tools. The former `tools` detail route resolves to PAARTH for compatibility. Historical article titles remain dated; the current project identity is PAARTH. Other development statuses reflect the user’s supplied account, not a fresh project-code audit. PAARTH-TRADER is labelled paper-trading research and has no invented external artifact link.

The opening uses Canvas 2D perspective projection, seeded particles and pulsing corner connections. It depicts components, contracts and connections metaphorically; it is not an employer architecture diagram. Mobile uses a smaller composition without peripheral labels. Reduced motion bypasses the film as soon as content is ready. No AI call, new dependency or production deployment is involved.

Motion research: Codrops kinetic SVG typography (https://tympanus.net/codrops/2023/01/31/bringing-letters-to-life-coding-a-kinetic-svg-typography-animation/) and Awwwards loading-animation reference (https://www.awwwards.com/inspiration/loading-animation-timc-roussilhe-portfolio). These informed the study of staged reveal; implementation is original to this wireframe.


## Working Record redesign — current direction

A single warm-paper, dark-ink and rust identity now spans all four perspectives. The opening, entrance and story heroes share a record-stack component representing frontend engineering, PAARTH and Lakshya. Opaque sheets replace overlapping translucent text. Each story puts its relevant record in front. Introductory copy appears before the question, with a direct full-portfolio path.

The opening assembles those three records over 2.85 seconds and fades over 500 ms. It remains skippable as soon as content is ready; reduced motion bypasses it. This is a DOM/CSS wireframe animation, not a final shared-element transition or production asset loader. Selection takes 450 ms; navigation resets scroll instantly so visitors do not pass through the preceding page’s scroll position.

Story headlines now describe actual scope. Selected-work sections curate relevant projects for leadership and engineering, while the work index preserves all five initiatives. Project covers use distinct typography and colour within the common palette, rather than repeating a workflow diagram. All career paragraphs, AI-assisted backend/native qualifications, articles, direct résumé and archive links remain intact. The intelligence remains a labelled local selector for prebuilt stories.

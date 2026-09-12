# Through the layers implementation plan

**Goal:** Build the approved connected portfolio locally, including the redesigned mobile experience, descriptive career record and an executable Proof Studio.

**Architecture:** Next.js App Router, semantic server-rendered content, a persistent progressive-enhancement Three.js assembly, and native scroll driving composed scene poses. An independent deterministic module owns experiment results; a bounded server guide may explain them with free-provider fallback. App content never comes from the model.

**Tech stack:** Existing Next.js 15, React 19, TypeScript, Three.js, Motion, Zod and MDX. No new paid service.

**Spec:** `docs/wireframes/story-script.md`, including mobile revision 02 and career revision 03. User approved implementation after both revisions.

## Constraints

- Local work on `codex/through-the-layers`; no deployment, push or publication.
- Preserve current edits, V6, legacy, eleven Writing entries and all three independent project groups.
- No internal employer product names, team sizes or private metrics in new profile copy or AI context.
- Public article bodies remain excluded from AI until explicitly reviewed. Private résumé never reaches the model.
- Use approved descriptive career narratives and verified education. Never fabricate testimonials.
- AI may select validated requirements and explain trusted evidence; it cannot execute generated code.
- Groq free configuration → Cloudflare free configuration → authored guide; no implicit paid fallback.
- Direct links, mobile, reduced motion and failed WebGL preserve usable content.

## 1. Deterministic intelligence domain and guide endpoint

Ownership: `lib/proof/*`, `app/api/proof/route.ts`, `tests/proof-*.test.mjs`. This domain can be built independently of the visual shell.

Interfaces: `Requirements { deadlineMs:number; maxAgeSeconds:number|null }`, `Scenario { cacheAgeSeconds:number; responseMs:number }`, `compare(requirements, scenario)`, `searchCounterexample(strategy, requirements)`, versioned replay serialization/validation. `null` means verified during this visit. Final exported shapes are documented by the domain implementer before UI integration.

- [x] Write contract tests for 150ms/120s cache-first, 150ms/strict neither, 1000ms/strict network-first; malformed replay rejection and deterministic search.
- [x] Implement two trusted strategies and timestamped events with named failing predicates.
- [x] Search nine declared scenarios; represent empty search honestly.
- [x] Implement grounded authored guidance and optional schema-validated provider explanation behind server-only configuration.
- [x] Test bad input, missing configuration, provider timeout/error, unsupported/private questions and replay bounds. Run `node --experimental-strip-types --test tests/proof-*.test.mjs`.

## 2. Approved public content and readable pages

Ownership: `lib/portfolio/*`, `components/portfolio/ContentPages.tsx`, `components/portfolio/ProjectArt.tsx`, `components/portfolio/content.module.css`, `public/resume-public.pdf`.

Interfaces: shared typed career/project data; exported `ProfilePage`, `WorkPage`, `ProjectPage({slug})`, `ContactPage`, `WritingPage({posts})`, `ArticlePage({post,children})` components. Parent owns route wrappers and shell.

- [x] Reconcile approved career copy, dates, education, fourteen practice areas and existing social links into typed content.
- [x] Build profile with full narratives, three responsibilities each, technical focus and mobile company jump links.
- [x] Build all project detail variants with honest scope, owned schematic art, real artifact links and related Writing.
- [x] Build complete Writing index and readable article wrapper; preserve existing bodies locally without passing them to AI.
- [x] Use the user's uploaded one-page résumé unchanged, superseding the generated draft. Served bytes match the original attachment; legacy PDFs remain intact.

## 3. Shared visual system, routes and mobile navigation

Ownership: `app/(portfolio)/*`, `app/v6/*`, `components/portfolio/Shell.tsx`, `components/portfolio/portfolio.css`, root metadata/cursor adjustments and archive navigation.

- [x] Preserve V6 page and blog routes under `/v6`, correcting internal navigation to the archived edition.
- [x] Mount new routes `/`, `/profile`, `/work`, `/work/:slug`, `/studio`, `/blog`, `/blog/:slug`, `/contact`.
- [x] Use silver, graphite, frosted surfaces and warm signal with readable type. Scope styles to avoid breaking archives.
- [x] Implement desktop navigation, mobile Home/Work/Studio/More dock, accessible menu, résumé and legacy links.
- [x] Preserve old home anchors and restore contextual return navigation from Studio.

## 4. Home scene choreography

Ownership: `components/portfolio/HomeStory.tsx`, `components/portfolio/scene/*`, `tests/portfolio-scene.test.mjs`.

- [x] Define pure scene poses at identity, career, work, Studio, Writing and Contact.
- [x] Author translucent interface planes, fine internal linework and a continuous warm trace. No copied reference assets.
- [x] Drive separation, spatial composition and the event-field dive from actual home sections; forward and reverse share a deterministic mapping.
- [x] Use native touch scrolling, a static assembly fallback and reduced-motion still poses. Pause drawing when hidden; cap pixel ratio.
- [x] Observe Home → Career → Work → Studio in the browser before expanding polish.

## 5. Real Proof Studio interface

Ownership: `components/portfolio/ProofStudio.tsx`, `components/portfolio/studio.module.css`.

- [x] Bind visible requirements to the trusted engine; compare same scenario and show its actual verdict.
- [x] Run bounded challenge, render first failing predicate, and animate a deterministic replay using virtual time.
- [x] Preserve neither-fit, no-failure-found, unsupported question, AI unavailable and local-guide states.
- [x] Mobile: requirement → verdict and two vertical evidence rows → challenge/replay. Keep editing and return paths reachable.
- [x] Store only versioned synthetic replay data, never raw questions. Label authored versus AI explanation.

## 6. Integration and verification

- [x] Run TypeScript, domain and scene tests; production build without the dev server writing the same output directory.
- [x] Verify all routes, article slugs, project links, archives and résumé response.
- [x] Observe desktop and phone views, reverse scroll, keyboard menu, requirement edits, failing-case replay, unavailable guide and direct Studio entry.
- [x] Confirm reduced-motion and script-free fallback keep the full document accessible; context-loss handling is implemented, with physical GPU-loss testing still outside this local review.
- [x] Record exactly what runs locally and any configuration still required for external AI. Leave local preview open; no deployment.

## Verification outcome — 2026-09-12

See `docs/portfolio-build-verification.md` for the observed flows, test output, archive/content boundaries and remaining provider configuration. The user explicitly chose the uploaded one-page PDF during implementation; the generated broad-profile résumé was superseded. Eleven curated website editions preserve their original article slugs while removing employer internals, and the archived edition retains original content.

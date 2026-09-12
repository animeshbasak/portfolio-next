# Public content boundary

The five career narratives and responsibility lists in `data.ts` reproduce the approved broad copy in `docs/wireframes/career-copy.md`. Early-career month ranges and IPEC education (2014–2018) use the reconciled record. No employer metrics, internal architecture or private screenshots were added to the new career or project pages.

No attributed testimonials or independently verified recognition source was provided. Those sections are omitted; adding them depends on actual approved quotes, attribution and supporting evidence.

## Résumé is an explicitly selected source document

The user explicitly requested the uploaded one-page résumé as-is for the public download. That instruction supersedes the generated two-page résumé proposed earlier. The parent implementation places the selected original attachment at `public/resume-public.pdf`. The website's curated article policy below is separate from that explicit document selection; it must not silently rewrite the uploaded résumé. The earlier generator remains a historical implementation artifact, not the authority for the selected download.

The existing `public/resume.pdf` also exists, so archive links targeting it were not broken and were left unchanged. The legacy edition's “V6” switch was corrected from `/` to `/v6` so its label matches its destination.

## Independent project evidence

Project illustrations are original conceptual SVG diagrams. They are not screenshots, production event traces or benchmark evidence. PAARTH Agent links to a development plan and the page explicitly distinguishes planned capabilities from releases. Public artifact links are retained from the approved wireframe and existing portfolio data.

The FRIDAY name remains in its historical build note and canonical slug. That note links to PAARTH Agent without claiming that every FRIDAY phase is a currently released PAARTH capability. SuperAgent is explicitly named as the developer-tool routing work, while insanemesh.ai remains a distinct content workflow.

## Curated Writing editions

`content/blog-public/` contains separate public editions of all eleven original articles. `lib/portfolio/public-blog.ts` reads those editions for the new portfolio; it exports `getPublicPosts()` and `getPublicPostBySlug()` with the existing `PostMeta` and `Post` types. The original `content/blog/` files remain untouched for the archived editions.

Every original slug, publication date, category and featured flag is retained. Titles and excerpts that repeated an excluded metric, private detail or unsupported capability claim were edited. Tags that would suggest the removed employer case study were generalised. Reading times are recomputed from the actual public body rather than inherited from the longer original. Historical publication dates refer to the original notes, not the date of the public edit.

All eleven originals were read before editing. The public editions preserve the article's engineering argument, first-person reflections where the source supports them, and relevant independent-project implementation details. Employer-specific incidents were not replaced with invented incidents or attributed quotes. Numerical results lacking an inspectable methodology were removed rather than presented as verified outcomes.

| Original slug | Meaningful editorial changes |
| --- | --- |
| `150m-users-vs-side-projects` | Removed employer traffic figures, conversion implications, named rollout platform and internal rollout claims. Retained the distinction between independent experimentation and production reliability, with general design and rollback considerations. Removed the traffic number from the displayed title; canonical slug remains stable. |
| `hld-before-keyboard` | Removed employer steering-committee/sign-off process and user figures. Retained the argument for design contracts, failure-path thinking and planning in independent work; softened “always” and staff/senior absolutes. |
| `lighthouse-performance-business-decision` | Removed named-employer hydration architecture, timing claims, sales/merchant metrics, incident counts and timeline, and the attributed post-mortem quotation. Preserved the performance-versus-user-outcome argument. Removed the incomplete Suspense example that implied a measured improvement it did not establish. |
| `staff-engineer-interview-not-coding` | Removed the purported interview-panel quotation about employer payment/analytics dependencies. Kept the broader interview-preparation reflection; explicitly labels the replacement question as illustrative, not an actual panel quote. Avoids universal claims about interview formats. |
| `lead-full-stack-airtel-backend` | Reconciled the displayed role to the approved broad Lead Engineer description. Removed internal product names, team size, traffic metrics, private service ownership, release tooling, internal sign-off and incident-reduction claims. Retained the reflection on interface/service boundaries and independent project examples. |
| `rag-in-2026-what-works` | Retained local Ollama/Chroma/LlamaIndex experimentation and whole-document comparison. Removed universal superiority, precise provider context-window and “RAG is obsolete” claims; makes clear that the observation is not a benchmark and retrieval can still be appropriate. |
| `lakshya-v2-job-search-os` | Retained Next.js/Supabase, Apify ingestion, geographic filtering, fit scoring and Claude-assisted drafting. Removed zero-quality-loss automation and guaranteed human-sounding output claims. The score is explicitly a prioritisation aid rather than a hiring probability; current availability is delegated to the product. |
| `insanemesh-ai-automation-architecture` | Resolved the conflict between “runs itself without intervention” and a manual approval gate. Retained the ideation/drafting/Puppeteer/Telegram/Meta pipeline. Removed exact run-time/day claims and marks the gate snippet as conceptual; it does not assert that sending a preview alone completes approval. |
| `friday-phase-4-arena` | Retained the bid schema, routing idea, budget guard, SQLite scheduler and dashboard design. Removed unverified cost/quality figures and absolute spending guarantees. Qualifies self-reported confidence and marks future voice/browser work as a direction rather than a release. |
| `superagent-cost-aware-routing` | Retained intent-to-skill-chain routing, memory, graph queries, adapters and routing visibility. Removed savings benchmarks, fixed platform/skill counts, universal compatibility and no-telemetry/no-signup assurances. Links current repository documentation instead of republishing potentially stale install commands. |
| `lakshya-7-source-unified-search` | Retained the seven-source design, adapter boundary, fit-score save-path bug, session storage, PDF template fixes, queued scans and observability setup. Removed claimed market coverage, query cost/latency, test counts, unrestricted scraping and instant-return claims. Fixed the abbreviated TypeScript union to a valid illustrative interface and clarified score invalidation. |

## AI boundary and verification

Neither the original nor the curated article body is supplied to the AI guide. The curated reader is a website publication source, not an AI-context allowlist. A synthetic Studio example remains separate from evidence for any article or project.

Validation: all eleven public files compile with `@mdx-js/mdx`; the public and original slug inventories match exactly; date/category/featured fields match each source; each article contains substantive body content; the excluded employer details and benchmark strings were searched for and are absent from the public bodies. `npx tsc --noEmit` passed after the reader was added. Parent integration runs the full route build and browser checks.

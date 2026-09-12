# Through the layers — local implementation verification

Local preview: http://localhost:3001. Branch: `codex/through-the-layers`. No deploy, push, commit, account creation or paid service configuration was performed. The previous V6 experience now lives at `/v6`; `/legacy` remains reachable. Existing user edits and previous design artifacts remain in the workspace.

## What is implemented

A shared silver visual system connects Home, Profile, Work, three project detail routes, Proof Studio, the eleven-entry Writing index, eleven readable article routes and Contact. The Home assembly opens across career, work, event-field, Studio, Writing and Contact chapters. Forward and reverse scrolling use the same deterministic progress mapping. The closing composition returns to the opening pose without forcing a scroll reset. Desktop geometry renders only when its state changes; particles update at most about 15 times per second. DPR is capped at 1.5, and hidden documents stop drawing.

Mobile has its own composition, a Home/Work/Studio/More dock, an accessible native dialog and sequential Studio panels. Supporting browsers get restrained native scroll animation on mobile layers; other browsers retain the same readable layout. All five career roles include the approved narrative, three responsibilities, technical focus and company jump links. Education, practice, independent project groups including SuperAgent, and existing social destinations are retained. No attributed testimonial was available, so none was invented.

The uploaded `Animesh_Basak_Resume_2026_Refined.pdf` is the selected résumé. It is served unchanged at `/resume-public.pdf`. Its file hash and the HTTP response hash match the source attachment. macOS PDF metadata reports one page. The earlier generated two-page draft is superseded; its historical generator now writes only under docs and cannot overwrite the selected download.

Public website articles use `content/blog-public`; the eleven original slugs remain valid. Existing articles under `content/blog` remain unchanged for V6. `lib/portfolio/PUBLICATION.md` records the editorial omissions. Neither article collection nor the résumé is supplied to the guide.

## Checks observed

- Production Next.js build succeeds, including all static route generation and the new share image.
- 35 Node tests pass: trusted experiment predicates, approved verdict examples, deterministic search, replay serialization and hostile input rejection, provider fallback and timeout behavior, HTTP request bounds, contextual/private guide scope, and reversible scene mapping.
- TypeScript and `git diff --check` pass.
- All main routes, three project detail pages, eleven public article routes, `/v6`, `/legacy`, `/sitemap.xml`, `/opengraph-image`, and the selected PDF respond successfully. An archived article also responds independently of its curated public edition.
- Chrome desktop inspection: shared scene renders; Home, career and project transitions were observed; project artwork progressively gives way to the live scene.
- Phone inspection at 390×844: readable Home composition, full career narrative, four-way dock, Studio requirements → neither-fit evidence → counterexample → replay. The menu closes with Escape and restores focus to More.
- Width 320 checks on Home, Profile, project detail, article, Studio and Contact found no document overflow or clipped headings, paragraphs or links.
- The 150ms + verified-this-visit brief produces neither-fit; allowing 1000ms produces network-first. A 2000ms strict brief exhausts all nine network-first scenarios with explicit bounded no-failure wording.
- Counterexample replay shows its exact requirements, synthetic scenario and event sequence. Its guide explains that replay, independently of the original comparison above it. “Why does this fail?” correctly explains the saved-copy freshness failure at 121s age and 80ms response. Submitted questions cannot be edited while pending, and requirement changes invalidate pending guidance.
- Studio opened from a project returns to the original scroll position and keyboard focus on its invitation link.
- Emulated reduced motion keeps six Home chapters and all content links in normal document flow. With scripts disabled, the semantic Home content and static assembly still render. Test emulation was restored afterward.

## Practical limits

Proof Studio is an independent synthetic experiment with two fixed strategies and nine declared search scenarios, not a production benchmark or universal proof. Its guide currently works through local authored evidence. Optional server adapters support explicitly enabled Groq free configuration, then Cloudflare Workers AI free configuration, then authored fallback. They require user-provided account configuration; no live provider call or free-plan verification was performed. See `docs/proof-configuration.md` for the exact setup and limits, including best-effort process-local rate limiting.

Browser checks used Chrome and emulated phone dimensions, not physical iOS/Android devices or a calibrated performance benchmark. WebGL context-loss handlers restore the poster, but physical GPU-loss testing was not forced. Award nomination and universal novelty are not guaranteed. The original archived pages and the expressly selected résumé still contain their original content; publication remains a separate decision.

## Run locally

```sh
PORTFOLIO_DEV=1 npm run dev -- --port 3001
```

This uses `.next-dev` so production validation can run separately:

```sh
node --experimental-strip-types --test tests/*.test.mjs
npm run build
```

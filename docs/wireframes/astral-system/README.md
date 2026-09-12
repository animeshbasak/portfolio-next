# Astral — Animesh Basak design system v0.1

A visual foundation for the approved journey: numeric astral arrival → conversational orientation → an authored visitor story → the same form accompanies each chapter. Open http://localhost:3010/astral-system/ for interactive specimens. This is a design-system artifact, not the complete portfolio or a live AI integration.

## One system, several stories

Use one brand, type scale, spacing rhythm, guide geometry and navigation model. Hiring prioritises scope and career; engineering prioritises decisions and project anatomy; AI curiosity prioritises independent work; an open exploration follows the chronological journey. These are authored content arrangements, not four disconnected visual identities. Visitors can change path or browse everything at any time.

The full implementation retains five career roles, five independent projects (LakshyaHub, PAARTH, FRIDAY, PAARTH-TRADER and insanemesh.ai), writing, the original one-page résumé, contact and V6/legacy access. The gallery shows representative layouts, not every content record. Testimonials must be verified before publication; no invented quotes or outcomes.

## Foundations and token ownership

`tokens.json` captures three layers; `tokens.css` supplies the equivalent browser variables. Primitive tokens hold raw palette, spacing and font values. Semantic tokens describe use (surface, text, signal, focus); component aliases define button, panel, input and guide styling. Keep both artifacts synchronised when changing values. The current JSON was generated from the CSS declarations, with aliases preserved.

The type stack prefers Inter if present, then local Arial/Helvetica; this preview does not fetch or bundle Inter. Confirm a licensed self-hosted production font and verify line wrapping before integrating. Display is fluid 54–128px on desktop, 43–64px on mobile; headings 32–64px; body 16px with 1.65 line height. Small mono labels identify metadata, never carry essential reading content. Use a 4px base, 24/32px component gaps and 56/80px section spacing. Reading measure is capped at 68ch.

## Presence state contract

| State | Geometry and purpose | Trigger and exit | Still equivalent |
|---|---|---|---|
| Loading | Numeric 0–100 beside the ribbon form | Asset readiness → asking; immediate skip always available in production | Complete numeric state and entry action |
| Asking | Open, slow ribbon orbit | Single visitor question → processing or authored choice | Balanced ribbon outline |
| Processing | Smaller, quicker orbit | Valid answer → route; timeout → choices | Static orbit plus written status |
| Leading | Form shifts toward the chapter marker | Explicit chapter navigation → resting | Form at destination marker |
| Inspecting | Same ribbons separate along the vertical axis | Open project anatomy → close or resting | Separated layers |
| Resting | Small, static form in the margin | Reading → tap for guide | Identical still form |
| Unavailable | Five restrained outline ribbons | Provider failure → manual story navigation | Outline plus written unavailable status |

The visual study uses Canvas2D projected ribbons, no textures or borrowed assets. This keeps the identity reviewable without introducing a production 3D stack. The state selector demonstrates target geometry; the final site must interpolate one persistent scene across states over 600ms. The design system does not yet implement cross-route shared-canvas transitions or scroll-linked camera movement.

UI hover/focus responses use 180ms; geometric state changes use 600ms with cubic-bezier(.16,1,.3,1). Automatic animation settles within five seconds. Reduced motion draws a still equivalent immediately and disables smooth scrolling. Keep text and controls in DOM. No background particles over reading text. No scroll hijacking. The prototype limits drawing to roughly 30fps and caps pixel ratio at 2; production frame timing still needs profiling on target devices.

## Components and accessibility

**Question:** one visible label, editable text, clear send action, 500-character maximum in the specimen, explicit empty-input feedback. Ask one question at a time and at most two useful follow-ups. A rich opening answer can select the path directly. No visitor identity required. The current response is scripted, makes no network call and saves nothing.

**Actions:** primary light fill for the next step; outlined secondary for changing direction; disabled state only for a real pending action. All buttons have 44px minimum height. Focus uses a 2px signal outline with a 5px offset. The full site must provide keyboard and screen-reader navigation equivalent to every pointer action.

**Context guide:** desktop contextual panel; mobile sheet inside the chapter specimen. Opens on explicit action, moves focus to Close, returns focus to its trigger on close, and supports Escape. This specimen is non-modal, so it does not trap keyboard focus. A production modal sheet would require dialog semantics, background inertness and focus containment.

**Career:** readable multi-paragraph role description; date column on desktop; compact date and full-width content on mobile. **Project:** purpose → approach → trade-off anatomy. **Writing:** quiet reading layout and still guide. **Contact:** a clear next action and always-available original résumé. Specimen article prose is explicitly identified as layout copy, not an invented published article.

At ≤640px the guide joins the chapter header, state controls become two columns and component specimens become one column. At 641–900px the layout narrows without hiding essential content. Large screens cap the design-system width at 1600px. Mobile sheets include bottom safe-area padding.

## Intelligence and content boundaries

AI selects a validated story ID and authored follow-up; it never invents achievements, generates runtime HTML or changes the factual record. Server-side credentials only. Use a bounded request deadline and manual choices when providers are unavailable. The existing Groq integration is separate from this visual specimen; its availability does not imply conversational routing is implemented here.

Public positioning: Lead Engineer specialising in frontend systems and architecture, with AI-assisted backend and native contributions. Employer work remains at high level: shared frontend platforms, reusable UI, technical design and implementation responsibilities. Exclude internal architecture, customer numbers, release details and business metrics. PAARTH is the renamed SuperAgent project, not a second independent project. PAARTH-TRADER remains research/paper-trading only.

## Implementation sequence

Integrate tokens and shared navigation first. Add the persistent guide scene at the app-shell level, connect the actual loading milestones and skip action, then implement authored story selection. Attach guide state to chapter navigation and project inspection; keep all underlying content accessible without the scene or AI. Test desktop/mobile layouts, keyboard flow, reduced motion, provider timeout, reload/deep-link behaviour and original résumé availability before replacing the live experience.

Research lineage: the earlier visual study is documented at ../../research/2026-09-12-astral-conversational-portfolio.md. Dribbble references informed restrained luminous presence and quiet surroundings; no reference artwork or animation files were copied. Awards and world-first novelty are aspirations, not guarantees.

# Astral: pattern research and proposed extensions

The user approved Astral as the base on 2026-09-12 and requested further Dribbble research. The baseline is recorded in ../wireframes/astral-system/approved-base.json with file hashes. Its visual code is unchanged by this research pass.

## Reference observations

| Reference | Evidence inspected | Transferable pattern | Astral adaptation |
|---|---|---|---|
| [Coetzee Creative — Projects Showcase](https://dribbble.com/shots/26732402-Coetzee-Creative-Projects-Showcase-UX-Scroll-Animation), Raynhardt Coetzee | Creator description and browser visual of dark project showcase: large project surface, adjacent explanatory copy, restrained grid | Project imagery and explanation have complementary roles; creator describes horizontal storytelling and scroll-triggered transitions | Keep the guide/project anatomy on one side and readable decisions on the other; swap authored content as the visitor opens each layer |
| [Thinking — AI Product Interaction & Motion UI](https://dribbble.com/shots/27354914-Thinking-AI-Product-Interaction-Motion-UI-CSS-Animation), Michael Frankland | Creator description and browser visual: coloured orb, peripheral lights, explicit THINKING label | Shape activity and written status communicate system state together | Give Astral a brief contraction while classifying; settle and label the chosen path when complete. Retain our restrained blue/ice palette |
| [Pinned Scroll Storytelling](https://dribbble.com/shots/6157006-Pinned-Scroll-Storytelling), Joe Chakravorty | Creator description and browser visual: text/image split with generous reading space | Parallel visual and reading tracks, with pacing controlled by scroll | Career thread can remain in view as the role descriptions flow; on mobile use a compact chapter marker and normal vertical reading |
| [Timeline Scroll Interactions](https://dribbble.com/shots/5019178-Timeline-Scroll-Interactions), Matt Thompson for MakeReign | Creator text and shot metadata retrieved; animation not fully reviewed | Candidate reference for chronological navigation | Optional follow-up study; do not treat as evidence of a particular interaction or production implementation |

Dribbble shots are concept/reference evidence, not proof of accessibility, performance or production reliability. No reference assets were copied. The proposals below are our synthesis, not features claimed to exist in those references.

## Recommended extensions

### 1. Continuous arrival

At 100, the number dissolves into the existing ribbon geometry; the same form then takes its asking position. Once the visitor chooses a path, one ribbon extends toward its first chapter. Maintain object continuity rather than replacing one scene with another. The user can skip the intro; readiness is tied to real resources and never waits for the language model.

### 2. Career thread

Unfold one ribbon into a vertical path with five chronological stops. The current role marker expands as its descriptive content enters view; previous stops remain available as direct navigation. Each role gets enough room for responsibility, growth and relevant public evidence. On mobile, use a small sticky chapter label; do not pin a full-screen canvas over the text.

### 3. Project anatomy — first prototype priority

Let the visitor open a project through three labelled layers: purpose, approach, trade-off. The guide separates into three ribbons that correspond to these layers. Scrolling or selecting a layer brings its authored explanation forward; “Return to overview” reunites the form. This translates the user's original layer-by-layer idea into an engineering story.

Start with PAARTH: purpose, local workflow approach, explicit trade-offs. Then adapt the same interaction to LakshyaHub. Employer material stays high-level; project anatomy does not license disclosure of internal work. Keep deep inspection optional, with visible buttons and a still equivalent.

### 4. Change perspective without losing your place

The guide offers a small “Change perspective” action. If a visitor changes from hiring to engineering while reading a project, remain on that project and change the authored emphasis. Explain what changed with a short line and provide undo. Do not replay onboarding or discard their current position. AI can classify interest; the website renders predefined content and valid destinations.

### 5. A useful trail at the end

Show a small visitor-controlled recap: chapters opened, projects explored and useful next links. Base it only on explicit interactions during the visit, not inferred identity or a hidden visitor score. A “Revisit PAARTH” link is more useful than a generic restart. Keep the original résumé and full archive accessible regardless of path.

## Alternatives considered

**Material polish only:** improve ribbon lighting and typography transitions. Low disruption and useful craft work, but does little to make the motion explain engineering.

**Continuous narrative (recommended):** continuous arrival, career thread, project anatomy and context-preserving perspective changes. This adds meaning while preserving the approved visual foundation.

**Fully spatial constellation:** put projects and roles into a navigable 3D universe. Visually ambitious but brings camera controls, accessibility and mobile complexity; quick hiring evaluation becomes harder. Do not make this the primary experience.

## Sequence and review criteria

Prototype project anatomy first as a separate extension to the approved base. It tests the hardest and most distinctive interaction using safe public content. Then connect the career thread and arrival sequence to the same geometry. Add perspective changes once the authored content variants are reconciled.

Acceptance: viewers can identify the active chapter and layer without interpreting animation; direct controls reach every destination; reversing scroll reverses visual progression predictably; changing perspective preserves the project and has undo; reduced motion exposes equivalent content; 320px mobile reading is unobstructed; provider failure retains manual navigation. Profile actual frame timing before making smoothness claims.

This research pass delivers recommendations and preserves the baseline; these new extensions are not yet implemented.

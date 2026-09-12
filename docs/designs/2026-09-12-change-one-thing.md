# Change one thing

Originality research and interaction brief for Animesh Basak's portfolio · 12 September 2026

Status: proposed design, not an implemented feature. Companion to [Built over time](2026-09-12-built-over-time.md). The static mockup establishes materials and composition; the interaction described here is the next prototype to validate.

## Recommendation

**Build a portfolio that lets visitors challenge a design decision and replay what changes.** The main site tells Animesh's engineering journey. Its signature interaction, **Change one thing**, turns one original miniature application into two branching implementations under the visitor's chosen constraints. The AI can help find a counterexample to the current recommendation.

The invitation is simple: **“Change one thing. See what it changes.”** Inside the experiment, the memorable action is **“Find where this fails.”** The portfolio can acknowledge that a different approach fits the new requirements better, or that neither available approach meets them. This demonstrates engineering judgment without requiring an employer case study.

I found no exact match for the full proposed combination in the personal portfolio pages inspected: a branching personal journey, visitor-controlled requirements, bounded counterexample search, deterministic replay, and links to the owner's approved reflections. This is a limited design-research finding, not evidence that nobody anywhere has built it. The underlying ideas all have precedents. Do not market it as a verified world first.

## What already exists

Research used targeted searches for developer portfolios with contextual AI, interactive architecture, simulations, playgrounds, changed constraints, counterexamples, and falsifiable claims. Sources below are creators' own sites, case studies, or source repositories. Feature descriptions establish published precedent; this research did not independently test every site's functionality. Search results are incomplete and may omit private, unindexed, recently launched, or differently named work.

| Reference | Published precedent | Implication for this design |
|---|---|---|
| [Jilani — developer portfolio](https://jilani.dev/en/projects/portfolio) | Contextual assistant for work and experience, dynamic case studies, and multiple reading depths. | Conversational biography and tailored reading are already familiar. |
| [Dinesh Gaikwad — developer portfolio case study](https://dineshgaikwad.vercel.app/projects/portfolio) | Architecture comparison, request-flow simulations, database exploration, and contextual AI explanations. | “AI plus diagrams plus engineering depth” is too close to an existing published concept. |
| [Landon Cummings](https://www.landoncummings.com/) | A personal portfolio describes interactive physics, algorithm, and AI demonstrations. | Runnable demonstrations alone are not the distinctive contribution. |
| [Nicky Case — The Evolution of Trust source](https://github.com/ncase/trust) and [Explorable Explanations](https://explorabl.es/) | Interactive learning through experiments and play. | Credit the explorable-explanation tradition; do not present learning-by-simulation as a new invention. |
| [PortfolioBacktest — product description](https://portfoliobacktest.io/portfolio-backtest) | In the unrelated investment domain, describes AI-assisted controlled comparisons, deterministic calculations, and explanations. Its motion preview is explicitly illustrative. | Separating AI explanation from a deterministic experiment engine is sound architecture, not a novelty claim. |
| [AhaSignals — research protocol](https://ahasignals.com/research-protocol/) | In financial research, describes AI as a challenger and requires boundary conditions and falsifiable claims; the protocol is described as under rehearsal. | AI that challenges a claim is also an existing idea. The distinctive work must be in the personal experience and execution. |

The original Proof Studio proposal stopped at question → demonstration → explanation. The closest references make that insufficient as a signature. The refined proposal adds a visitor's explicit criterion, a test that can contradict the initial recommendation, a reproducible result, and a spatial branch through the personal narrative.

## Three approaches considered

**An AI version of Animesh at different career stages.** Emotionally attractive, but it would need substantial authentic writing to avoid invented autobiography. A language model must not fabricate what Animesh believed in a particular year. This is not the recommended flagship.

**A generative skill map that reorganizes around the visitor.** Easy to understand, but a map and personalized explanation provide weak evidence of engineering skill. Existing contextual assistants and skill graphs already cover much of that ground. It can be a navigation aid later.

**Change one thing.** Recommended because the visitor participates in a real comparison, the AI has a specific job, and each visual layer corresponds to a decision. It also permits complete demonstrations using original synthetic material. Its main risk is becoming a technical dashboard; the first experience must remain a short, readable story with a useful default and optional depth.

## The first minute

1. **Arrive.** “Built over time.” An indigo thread passes through translucent leaves. Name, Lead Frontend Engineer, work, resume, and contact are immediately reachable.
2. **Enter one question.** A chapter offers “Can something feel instant and stay current?” Selecting it opens an original reading-board experiment. Typing a related question can reach the same state.
3. **See two choices.** One leaf shows cached content immediately with its age; the other waits for a new response. Both are honest, valid strategies. The experiment states its synthetic conditions.
4. **Change one requirement.** The visitor tightens the acceptable age of displayed content. The thread forks, keeping the original branch faintly visible for comparison.
5. **Challenge the recommendation.** “Find where this fails” runs a bounded set of scenarios. A result identifies the requirement that was missed and offers a replay. The AI explains the evidence and can recommend reconsidering the choice.
6. **Meet the engineer.** An optional approved note explains Animesh's view on the trade-off, linked to a relevant independent project or genuine reflection. It is clearly separate from the AI explanation.

The visitor can finish there, explore another chapter, or go directly to contact. No quiz, score, login, compulsory tour, or personalized psychological profile is involved. A default question makes the experience useful without requiring the visitor to invent a prompt.

## One concrete experiment

Create an original fictional reading board with a small set of synthetic notes. Compare two fixed implementations: **cache-first with a visible age label and background refresh**, and **network-first with an explicit waiting state**. Do not recreate an employer's interface, APIs, schemas, or incident. This is a present-day independent teaching artifact, not a reconstruction of an early-career product.

The scenario defines a virtual response delay, a cached copy's last-verification time, source versions, and optional failure events. The requirements define the maximum waiting time for first content and the maximum age of any content displayed. “Age” means elapsed virtual time since the copy was last verified against the fictional source, not its creation date. A visible stale label explains age but does not satisfy a requirement prohibiting older content.

For the first prototype, use a cached copy last verified 45 seconds ago and a successful synthetic response after 800 milliseconds. The following are expected contract examples, not measurements from a completed prototype or a production site:

| Visitor's requirements | Cache-first | Network-first | Permitted conclusion |
|---|---|---|---|
| Content within 150 ms; displayed data may be up to 120 seconds old | Meets both in this scenario | Misses waiting limit | Cache-first fits these requirements here. |
| Content within 150 ms; display no previously verified copy | Misses freshness requirement on initial display | Misses waiting limit | Neither offered implementation meets both requirements in this scenario. |
| Content within 1,000 ms; display no previously verified copy | Misses freshness requirement on initial display | Meets both | Network-first fits these requirements here. |

“Display no previously verified copy” is a readable strict-freshness mode: only a response verified during this run qualifies. It is evaluated as a distinct predicate rather than a fragile floating-point comparison to exactly zero age. A later implementation may hide stale cached content until validation; that becomes a separately named strategy, not a silent change to the comparison.

The conclusion is bounded by the implemented strategies and scenario. It is not a claim that no other architecture could satisfy the requirements. Do not conflate simulated waiting time with the portfolio's own performance, or imply the experiment proves production scalability.

## What makes the intelligence useful

The AI clarifies a vague request into a visible requirement: “Does current mean verified in this visit, or is a two-minute-old copy acceptable?” It proposes one supported change at a time. The visitor can edit that requirement using regular controls. Only a validated configuration reaches the experiment.

The model can request **a search for a failing case** within a finite, declared scenario set. Code evaluates the predicates and returns the first counterexample in a documented order, or a concise summary of the tested cases. The model explains that result. A search that finds nothing must say **“No counterexample found in the tested scenarios”**, never “This always works.”

The AI may surface an inconvenient result: more latency, stale information, an unresolved failure, or no offered design meeting all requirements. It must not be rewarded merely for making Animesh look good. The portfolio's credibility comes from clear boundaries and thoughtful alternatives, supported by the owner's actual published work.

This is not a model reproducing Animesh's private thinking. Personal viewpoints come from approved authored notes; generated explanations are labeled. If there is no authored note for a question, the assistant can explain the general engineering principle without attributing an opinion or incident to him.

## Layered animation with a reason

The layers represent **a working interface → a reusable pattern → a decision under constraints → a considered revision → a new question**. Career dates and roles remain a separate factual chronology. These are editorial lenses for the journey, not invented claims about what Animesh learned at a particular employer.

Scrolling separates the leaves. Changing a requirement produces a second path through them. Replaying a result illuminates the point where the paths diverged. Earlier choices stay visible long enough to understand the change; the visitor can return to either branch. The AI panel and the sculpture read from the same experiment state.

The first implementation should use a scoped DOM/SVG composition with transform and opacity motion. Use a small 3D scene only if a visual prototype establishes its value. Mobile uses stacked comparisons and chapter buttons; reduced motion uses static branches. Essential text and controls always remain in the DOM, and the ordinary portfolio stays navigable without the experiment.

## Engineering plan

Reuse Next.js, TypeScript, Motion, and MDX. Build one pure experiment module, two trusted React implementations, a small scenario set, and a typed result format. Use virtual time and deterministic events so replay does not depend on actual network conditions or frame rate. Never intentionally throttle or break the visitor's real page to stage a failure.

The model endpoint accepts a bounded question and approved public context. Its output can select an experiment, propose supported parameters, reference approved source IDs, or request bounded search. It cannot supply executable code or arbitrary URLs. Local controls and authored explanations remain available when the model is unavailable.

Proposed flow: `Visitor intent → visible requirement → validated scenario → deterministic comparison/search → result and replay → grounded explanation → approved personal note`. A replay stores experiment version, content version, seed, parameters, and event trace. It excludes the raw question and any personal text. Initially keep it in the browser; a later share link may encode validated synthetic settings without server storage.

The AI retrieves only an explicit public-content collection. Exclude this research, earlier employer-centered design drafts, the detailed resume supplied for private analysis, and unreviewed existing posts. The model has no access to employer systems or private files. Publication rights for independent artifacts and broad career facts still need to be established; a confidentiality prompt alone is not sufficient.

## Prototype acceptance checks

| Check | Evidence required |
|---|---|
| Understandable first minute | A visitor can describe one trade-off after trying the default comparison, without an engineering tutorial. |
| Real comparison | Both implementations consume the same scenario; results derive from state, not decorative counters. |
| Honest failure | `strict_freshness_and_short_deadline_returns_no_matching_strategy` covers the unsatisfied example above. |
| Counterexample search | `search_returns_failing_predicate_and_replay` and `empty_search_does_not_claim_universal_success`. |
| Reproducibility | `same_version_seed_and_config_reproduce_trace`; incompatible versions are rejected or explicitly migrated. |
| AI boundary | Invalid IDs/parameters, fabricated citations, unsupported questions, and attempts to request employer details are rejected or handled with an explicit limitation. |
| Navigation | A visitor reaches work, resume, and contact without engaging the Studio; close/reopen preserves reading position. |
| Access and motion | Keyboard, phone layout, zoom, reduced motion, and screen-reader output preserve equivalent behavior. |

Build one complete comparison before expanding into reliability, reuse, or accessibility experiments. The creative hypothesis is that a short, beautiful experience that welcomes disagreement makes engineering judgment memorable. Validate that hypothesis in the browser with real people; a static mockup and this research cannot establish an award outcome.

## Decision

Keep **Built over time** as the personal narrative and visual identity. Keep **Proof Studio** as the working name for the integrated experiment area. Make **Change one thing** its single signature action, with **Find where this fails** as the deeper intelligence interaction. Avoid adding more feature names, dashboards, avatars, skill scores, or a menu of unrelated AI tricks.

The next reviewable milestone is one working chapter containing the reading-board comparison, a replayable failing case, and an AI explanation grounded in that result. No application code has been changed by this research revision. The exact personal reflections remain for Animesh to author or approve; the system must never invent them.

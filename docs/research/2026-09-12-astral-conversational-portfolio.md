# Astral opening → conversation → prepared portfolio

Status: researched direction for visual review; not implemented. This supersedes the Working Record direction. No source files were changed for this research.

## The requested experience

The user wants a visible 0–100 astral animation first, then an AI guide asking what the visitor wants to know about Animesh. The guide asks relevant follow-up questions and selects an already-authored portfolio based on the answers. The conversational entrance is central to the experience. The portfolio itself is not generated at runtime.

Interpretation of “astral”: a dark, spatial field of luminous particles, orbital movement and depth; large, legible numerical typography built from or surrounded by those particles. This is a proposed art direction, not a claim that the user has approved every visual choice. Preserve the corrected career content, current PAARTH identity, full chronology, writing and original résumé. Do not carry employer internals into the guide or site.

## Relevant research

1. Codrops, **3D Typing Effects with Three.js**: https://tympanus.net/codrops/2022/11/08/3d-typing-effects-with-three-js/ — describes sampling text into particle coordinates and animating instances. Relevant to numerals as a particle structure. It is a technique reference, not a design to reproduce.
2. Codrops, **Interactive Particles Slideshow**: https://tympanus.net/codrops/2013/07/03/interactive-particles-slideshow/ — text and shapes morph between particle arrangements. Relevant to preserving one visual medium across counter, conversational focal point and entry. Old implementation; use as a motion study rather than dependency guidance.
3. Codrops, **Making Motion Behave**: https://tympanus.net/codrops/2026/02/04/making-motion-behave-inside-vladyslav-penevs-production-ready-interaction-systems/ — discusses particle morphing that waits for target geometry. Relevant to sequencing a visual transition only when its destination is ready.
4. Google, **Conversation Design: Questions**: https://developers.google.com/assistant/conversation-design/questions — one question at a time, open versus narrow questions, clarification when intent is ambiguous. Written for conversational assistants; adapting these principles to a text-first web entrance is a design inference.
5. Google, **Commands**: https://developers.google.com/assistant/conversation-design/commands — support both a single rich instruction and a step-by-step dialogue. A visitor who already explains their purpose and depth preference should not be asked to repeat them.

These sources establish feasible techniques and useful interaction principles. They do not establish that this combination is unique, award-winning or effective for hiring; the latter needs visitor testing.

## One scene, three acts

### Act 1: The astral counter

Near-black, with cool ivory numerals and a restrained blue-white particle glow. Begin with a clear `0` in the centre. Particles carry the numeral silhouette as the value advances toward `100`; a stable numeric outline or readable text layer prevents the count dissolving into noise. Depth comes from a few particle planes, fine orbital arcs and restrained camera movement, not a starfield wallpaper.

Choreography tied to progress: at the beginning, widely scattered points gather; through the middle, number forms become denser and their orbital motion steadier; at completion, `100` briefly resolves, then releases into a compact constellation. That constellation becomes the visual anchor for the next question. No black-screen cut or unrelated landing page follows.

The counter represents the critical experience preparing: required fonts, approved content, scene readiness and entry assets. It must not report model confidence or invented AI analysis. Use measured milestones/asset completion, interpolating visual display toward actual progress. Reach 100 only when the entrance is ready. Do not fetch the entire site just to create a wait. On fast loads, advance quickly; the visual rehearsal may have a controlled timeline explicitly labelled as an intro preview. A failed task shows recovery instead of a counter stuck at 99. Keep a direct-entry alternative and a still, readable reduced-motion treatment.

### Act 2: A short, adaptive conversation

On the same dark stage, the constellation moves above or beside a single question. Text is HTML, selectable and accessible; no full-screen canvas text input. No chat-window chrome is necessary. Show one current question prominently, a natural-language input, optional short suggested replies and a quiet conversation history/edit control.

Opening: **“What would you like to know about Animesh?”**

Suggested answers can help visitors start: “I’m hiring”, “Show me his engineering work”, “I’m interested in his AI projects”, “I’m exploring”. They are examples, not the only supported language.

Ask only for missing information. Usually two answers are sufficient; allow at most three questions before offering a story. Never ask for name, employer, email or a job description merely to enter. No inferred demographics, personality judgments or background profiling. The relevant signals are stated purpose, topic and reading depth.

### Act 3: A visible reason for the selected story

The guide gives a short explanation: **“I’ll start with his frontend architecture work, then show his leadership responsibilities and independent tools.”** The visitor can enter or change the focus. A confident explicit request can offer entry immediately, without mandatory extra questions.

The constellation expands toward the selected scene; relevant chapter titles appear along that transition and settle into the portfolio navigation. The selected design is already authored and loaded. It should feel like the visitor is moving deeper into the same environment. The astral treatment can recede around long-form reading, with stable content and readable contrast. Distinct narrative compositions remain possible inside a related visual world; this is not a requirement for identical page layouts.

## Example conversations and routes

### Hiring: frontend leadership

Visitor: “I’m looking for a lead frontend engineer.”
Guide: “What matters most for this role: architecture, hands-on delivery, or technical leadership?”
Visitor: “Architecture, but someone who still builds.”
Guide: “Would you prefer a quick overview or a deeper technical walkthrough?”
Visitor: “Quick overview.”
Entry summary: “Start with frontend systems and delivery responsibility, then see the career record and selected independent work.”
Prepared route: hiring overview → current scope → descriptive career → PAARTH/Lakshya → résumé/contact. Frontend is the specialisation; backend and React Native contributions are explicitly AI-assisted.

### Engineering peer: integration and system design

Visitor: “How does he connect frontend and backend?”
Guide: “Would you like a broad account of his work, or a technical example from an independent project?”
Visitor: “A project example.”
Entry summary: “I’ll start with Lakshya’s data and workflow decisions, then show the relevant engineering experience.”
Prepared route: technical story → Lakshya implementation decisions → API/data contracts → high-level career scope → related writing. Do not reveal employer architecture to make this route feel deeper.

### AI tools

Visitor: “I want to see PAARTH and how he builds AI tools.”
Guide: “Are you more interested in what the tools do, or the engineering behind them?”
Visitor: “The engineering.”
Entry summary: “I’ll begin with PAARTH’s workflow layer, then FRIDAY and the research projects.”
Prepared route: AI engineering → PAARTH → FRIDAY → PAARTH-TRADER, clearly paper-trading research → relevant build notes. No extra question about purpose is needed.

### Open exploration

Visitor: “Just looking around.”
Guide: “Would you like to start with his career or what he’s building independently?”
Visitor: “Career.”
Prepared route: chronological journey → all five roles → independent projects → writing/contact. If the visitor says “surprise me”, offer the complete journey without forcing further answers.

### Ambiguous or unsupported interests

For mixed intents, acknowledge both and ask which to start with, rather than pretending there is a perfect classification. For an out-of-scope topic, explain the available work and offer the closest supported path. A visitor asking for confidential employer detail receives only the approved high-level account and a public independent example. Always offer “Explore everything”.

## The intelligence contract

The model interprets answers and selects approved topic IDs, a prepared route and a next-question ID. Runtime code validates that response against the finite catalogue. It can recognise natural language and avoid redundant questions; it cannot produce an arbitrary URL, fabricate achievements, execute content, generate a site or expose private source material.

Model input should contain the visitor’s short answers and a minimal public topic catalogue, not the full résumé, internal consolidated account or API keys. The existing server-side provider integration could be reused after checking its current suitability. This research does not assume a free quota or verify provider availability. Preset answers and deterministic branching must remain usable if the provider is unavailable; plainly describe that as a guided selection when AI is offline.

Use explicit session state: loading → first question → clarification/depth question → suggested story → entered. Allow answer editing and changing perspective. Do not persist conversational input by default. Changing the view never removes access to the other projects, complete career, writing or résumé.

## Next visual deliverable

Create a focused motion study, not another full-site redesign: desktop and mobile frames for `0`, a middle counter state, `100 → constellation`, first question, adaptive follow-up and selected-story entry. Include one complete hiring conversation and an AI-project conversation so the branching is tangible. Review the exact visual language and transition before extending it through the career/project pages.

Acceptance checks for that study: count legibility, real readiness semantics, one question per turn, visibly different follow-ups, no redundant questions for a rich first answer, useful offline route, editable selection, reduced motion, mobile keyboard fit, readable portfolio entry and complete content access. Judge the visual direction separately from whether the code runs.

## Dribbble visual study

Inspected shot pages and rendered artwork in Chrome:

- Robin Holesinsky / rh.design, **AI assistant motion mobile visual** — https://dribbble.com/shots/26604861-AI-assistant-motion-mobile-visual. A blue luminous form above a short message, surrounded by substantial dark space. Useful reference for conversational hierarchy and a consistent visual anchor. Adapt the hierarchy; do not copy the form or phone presentation.
- Asaad Mahmood / The Small Square, **Mobile AI assistant animation** — https://dribbble.com/shots/26445170-Mobile-AI-assistant-animation. A flowing purple luminous sphere on a quiet phone screen. Useful reference for material depth and an expressive assistant presence. The portfolio need not inherit its voice-only microphone interaction.
- Michael Sevilla, **Loader Animation** — https://dribbble.com/shots/952076-Loader-Animation. A numerical counter with a segmented luminous arc on a dark background. Useful as a clear progress hierarchy study; the older textured treatment is not the desired final art direction.

Design inference: concentrate visual complexity into the central form; reduce background stars around reading and input; use deliberate shape changes for waiting, processing and entry rather than a static star glyph. Numerals should resolve into that form at 100, preserving the same visual object across the loader and conversation. This remains a proposed refinement: no demo code changed during the Dribbble research turn. Screenshots establish visual composition, not browser implementation, performance or accessibility of the reference work.

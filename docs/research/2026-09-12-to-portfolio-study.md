# Reference study: to-portfolio.com

Studied on 12 September 2026. Research only; no portfolio implementation changed during this study. The earlier paper/sculpture redesign is rejected and is not the visual baseline. V6 and legacy remain the user's preferred references for their own identity.

## What was actually inspected

Desktop: the audio choice and boot sequence; Home; forward scrolling through career records, the About/map scene, and the experiments overview; navigation to About and Work; the first-to-second Work selection transition. About was also checked at a 390 × 844 viewport. Browser DOM/CSS and publicly delivered JavaScript were inspected to separate observed behavior from assumptions. Audio stayed off. This was not a frame-rate, Lighthouse, screen-reader, or complete reduced-motion audit.

The initial direct About visit displayed a globe without its content. Entering Home, choosing the audio state, and navigating through About produced the complete page. This is an observed entry-path issue in this session, not a diagnosis of its cause.

## Design findings

The experience has a consistent fictional instrument interface: small technical labels, grids, registration corners, fine connecting lines, subdued surfaces, status indicators, and a restrained accent system. Composition changes substantially between areas while these recurring details establish continuity.

Home starts with a faceted core and segmented orbital structures. Scrolling introduces circuit-like lines and career records, then a map/location composition, and finally an experiments overview. The backgrounds, foreground overlays, apparent distance, and object arrangement change together. Transitions occupy authored intervals between reading moments.

About is a compact composition around a globe: one wide profile panel above two smaller experience/skills panels. The content is ordinary HTML. Its computed CSS includes a translucent background and a 6px backdrop blur. The globe is rendered in a canvas behind it. The feeling of depth comes from their overlap, orbit graphics, transparency, and scale—not from making the biography itself a 3D mesh.

Work changes the composition again: a large perspective image surface on the left; title, explanation, thumbnails, progress and navigation on the right. Selecting the next work changed the image, title, explanation and index together. Previous/next buttons were temporarily disabled while a morph progress indicator was active, then re-enabled. This is a coordinated interaction with an explicit transition state.

## Verified implementation clues

- Next.js: the document ships Next static chunks and a Turbopack runtime.
- React Three Fiber: its renderer identifies itself in the delivered scene bundle, alongside Three.js rendering classes.
- GSAP and ScrollTrigger: actual timeline/trigger code appears in the shipped application, including scroll-scrubbed reveals.
- Lenis: shipped smooth-scroll code and application calls that stop/start scrolling around transitions and return to the origin.
- Custom shader code: the scene bundle contains GLSL with appearance, formation, morph, glitch and texture-transition controls. This goes beyond stock CSS parallax.
- Assets and geometry: a globe map texture is loaded with Three.js; the bundle also includes instanced geometry facilities. The presence of a library class alone does not prove every object uses that class.

A practical reconstruction of the architecture is: document/router → interaction and scroll state → coordinated DOM timelines plus a shared 3D rendering layer. Camera/object/material changes and interface reveals read related state. This architectural description is an inference from the observed behavior and delivered code, not access to the author's original source repository.

## What this changes in our process

The missing work in the rejected prototype was composition and transition design. A single sculpture changing beside a repeated reading column did not give each portfolio chapter an identity. More particles or a different easing curve would not resolve that.

Before further implementation, establish distinct still compositions for identity, career, independent projects, Writing, and contact using the character already present in V6/legacy. For every connection, draw the exit frame, shared intermediate frame, and arrival frame. Specify what persists, what transforms, where the viewer looks, and when the content becomes readable. Prototype one representative connection using real portfolio content before expanding the system.

For this portfolio, professional copy should carry career scope and progression; independently owned products can supply detailed diagrams and demonstrations. Existing employer-specific articles still need editorial review before any public revamp. Authored Writing quotations are not third-party testimonials.

The reference's tiny, low-contrast labels and initial entry friction are tradeoffs to evaluate, not qualities to copy automatically. Our motion must also work with direct links, reverse scrolling, keyboard navigation, mobile reading, and reduced motion.

## Sources

- [About](https://to-portfolio.com/about), [Home](https://to-portfolio.com/), [Work](https://to-portfolio.com/work): browser observations.
- [Delivered scene bundle](https://to-portfolio.com/_next/static/chunks/dca484e45cb92dd8.js): React Three Fiber, Three.js, shaders and map texture loading. Public bundle names may change on deployment.
- [Delivered interaction bundle](https://to-portfolio.com/_next/static/chunks/443d778182f65268.js): smooth scrolling and reconstruction orchestration.
- [Delivered scroll choreography](https://to-portfolio.com/_next/static/chunks/e7460985369d2b4b.js): timeline and ScrollTrigger integration.
- [GSAP ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/): scrub, pin and timeline synchronization.
- [Lenis documentation](https://github.com/darkroomengineering/lenis): smooth-scroll integration.

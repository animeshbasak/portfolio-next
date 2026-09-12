# Astral release

The public portfolio uses one persistent Canvas2D ribbon form, a short arrival animation, three authored home perspectives, five career roles and five projects. Project purpose/approach/trade-off sections change the guide geometry. All content remains reachable through navigation. Original résumé and V6/legacy visual editions remain available; archive career and article copy uses reviewed public content.

The AI selects an authored perspective, not generated page markup or biographical answers. Groq credentials are server-only. Invalid responses, provider failures and unclear input retain direct path selection. Rate limiting is best-effort per instance, with a bounded provider deadline. The arrival counter represents the intro animation, not asset-download progress.

Release review fixes: no-JavaScript content is no longer inert; paused, reduced-motion and hidden-tab canvas loops stop scheduling continuous work; motion time survives pause/resume; social metadata matches the current positioning. Contact requests are bounded and validated, rendered as plain text and report provider errors honestly. Production dependency audit is clean after compatible updates and a PostCSS override.

Verification commands: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm audit --omit=dev`. Browser checks include mobile navigation, no horizontal overflow at 320/390px, no-JavaScript navigation, reduced motion, live Groq selection, project layer navigation, and all career/project destinations. Deployment uses the existing Vercel project `portfolio-next`, linked to `animeshbasak/portfolio-next`, with production domain `animeshbasak.com`.

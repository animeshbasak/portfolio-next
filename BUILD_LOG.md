# Lakshya Build Log

## Session 1 — Auth + Dashboard (complete)
- Login page with Google OAuth
- 5-step onboarding (resume upload, roles, preferences, tech, Apify key)
- Dashboard with job list, AI scoring, cover letter/cold DM generation
- Jobs API (CRUD + Claude scoring)

## Session 2 — Scraper + Pages (complete)

### TASK 1 — Settings
- GET/PATCH/DELETE /api/lakshya/settings
- Settings page with 4 tabs: Profile, Job Preferences, API Keys, Danger Zone
- 500ms debounced auto-save, toast feedback
- Files:
  - src/app/api/lakshya/settings/route.ts
  - src/app/lakshya/(app)/settings/page.tsx

### TASK 2 — Apify Scraper
- /lib/lakshya/apify.ts: runApifyActor, validateApifyKey, normaliseLinkedIn, normaliseNaukri
- POST /api/lakshya/scrape: multi-portal scrape, dedup, bulk insert, fire-and-forget scoring
- GET /api/lakshya/scrape/status: poll run status
- POST /api/lakshya/jobs/[id]/score: Claude scoring for scraped jobs
- Files:
  - src/lib/lakshya/apify.ts
  - src/app/api/lakshya/scrape/route.ts (with x-service-user-id cron support)
  - src/app/api/lakshya/scrape/status/route.ts
  - src/app/api/lakshya/jobs/[id]/score/route.ts

### TASK 3 — ScrapeStatusBar + Dashboard Nav
- /components/lakshya/ScrapeStatusBar.tsx: poll every 3s, auto-refresh jobs on complete
- Dashboard nav bar added (Dashboard, Tracker, Prep, Study, Insights)
- Settings gear icon added to dashboard header
- ScrapeStatusBar added above StatsBar on dashboard
- Files:
  - src/components/lakshya/ScrapeStatusBar.tsx
  - src/app/lakshya/dashboard/DashboardClient.tsx (modified)

### TASK 4 — Cron
- GET /api/lakshya/cron with x-cron-secret auth
- Iterates enabled users, calls scrape with service-role header
- vercel.json: Mon-Fri 7:00 UTC (12:30 IST)
- Files:
  - src/app/api/lakshya/cron/route.ts
  - vercel.json

### TASK 5 — Remaining Pages + APIs
- Stories API: GET/POST /api/lakshya/stories
- Stories ID API: PATCH/DELETE /api/lakshya/stories/[id]
- Insights API: GET /api/lakshya/insights
- Skills Gap API: POST /api/lakshya/insights/gaps
- /lakshya/tracker — Kanban drag-and-drop board, 8 columns, detail modal
- /lakshya/prep — Story vault (STAR method) + question bank from jobs
- /lakshya/study — Study topics from JDs (checkboxes) + 5 Coursera courses (3-state progress saved to localStorage) + AI skills gap
- /lakshya/insights — Analytics: 6 stat cards, score distribution bar chart, decision breakdown, portal breakdown, scrape run history table
- Files:
  - src/app/api/lakshya/stories/route.ts
  - src/app/api/lakshya/stories/[id]/route.ts
  - src/app/api/lakshya/insights/route.ts
  - src/app/api/lakshya/insights/gaps/route.ts
  - src/app/lakshya/tracker/page.tsx
  - src/app/lakshya/prep/page.tsx
  - src/app/lakshya/study/page.tsx
  - src/app/lakshya/insights/page.tsx

## TypeScript: 0 errors

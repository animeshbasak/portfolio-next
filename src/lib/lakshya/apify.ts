const APIFY_BASE = 'https://api.apify.com/v2';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScrapedJob {
  company: string;
  role: string;
  location: string | null;
  jd_text: string | null;
  apply_link: string | null;
  ctc_range: string | null;
  posted_date: string | null;
  portal: string;
}

// ─── Key validation ───────────────────────────────────────────────────────────

export async function validateApifyKey(apiToken: string): Promise<boolean> {
  try {
    const res = await fetch(`${APIFY_BASE}/users/me?token=${apiToken}`);
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Core runner — NEVER throws, always returns [] on failure ─────────────────

export async function runApifyActor(
  actorId: string,
  input: object,
  apiToken: string,
  timeoutSecs = 60
): Promise<unknown[]> {
  console.log(`[apify] Trying actor: ${actorId}`);
  console.log(`[apify] Input: ${JSON.stringify(input).slice(0, 200)}`);

  const url = `${APIFY_BASE}/acts/${actorId}/run-sync-get-dataset-items?token=${apiToken}&timeout=${timeoutSecs}&memory=256&format=json`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), (timeoutSecs + 15) * 1000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    console.log(`[apify] actor=${actorId} status=${res.status}`);

    // Non-throwing status codes — log and return []
    if (res.status === 401) { console.error(`[apify] ${actorId}: Invalid Apify key`); return []; }
    if (res.status === 402) { console.error(`[apify] ${actorId}: Requires paid plan`); return []; }
    if (res.status === 403) { console.error(`[apify] ${actorId}: Actor is private (403)`); return []; }
    if (res.status === 404) { console.error(`[apify] ${actorId}: Actor not found (404)`); return []; }
    if (res.status === 429) { console.error(`[apify] ${actorId}: Rate limited (429)`); return []; }
    if (!res.ok) { console.error(`[apify] ${actorId}: Unexpected status ${res.status}`); return []; }

    const items = await res.json() as unknown[];
    console.log(`[apify] actor=${actorId} items=${items.length}`);
    if (items.length > 0) {
      console.log(`[apify] actor=${actorId} sample=${JSON.stringify(items[0]).slice(0, 300)}`);
    } else {
      console.log(`[apify] actor=${actorId} returned 0 items`);
    }
    return items;
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      console.error(`[apify] ${actorId}: Timed out after ${timeoutSecs}s`);
    } else {
      console.error(`[apify] ${actorId}: Fetch error — ${(err as Error).message}`);
    }
    return [];
  } finally {
    clearTimeout(timer);
  }
}

// ─── tryActorsInOrder — stops at first actor that returns results ──────────────

export async function tryActorsInOrder(
  actors: Array<{ id: string; input: object }>,
  token: string,
  timeoutSecs = 60
): Promise<unknown[]> {
  for (const actor of actors) {
    const items = await runApifyActor(actor.id, actor.input, token, timeoutSecs);
    if (items.length > 0) return items;
    console.log(`[apify] ${actor.id} returned 0 items, trying next...`);
  }
  return [];
}

// ─── Normalise helpers ────────────────────────────────────────────────────────

function str(...vals: (string | undefined | null)[]): string | null {
  for (const v of vals) {
    if (v && v.trim()) return v.trim();
  }
  return null;
}

// LinkedIn actors: curious_coder/linkedin-jobs-scraper, curious_coder/linkedin-jobs-search-scraper
interface LinkedInItem {
  title?: string; position?: string;
  company?: string; companyName?: string;
  location?: string;
  jobUrl?: string; url?: string; link?: string;
  description?: string; snippet?: string;
  salary?: string; postedAt?: string;
}

export function normaliseLinkedIn(items: unknown[]): ScrapedJob[] {
  return (items as LinkedInItem[]).flatMap((item) => {
    const role = str(item.title, item.position);
    const company = str(item.company, item.companyName);
    if (!role || !company) return [];
    return [{
      company,
      role,
      location: str(item.location),
      jd_text: str(item.description, item.snippet),
      apply_link: str(item.jobUrl, item.url, item.link),
      ctc_range: str(item.salary),
      posted_date: item.postedAt || null,
      portal: 'linkedin',
    }];
  });
}

// Naukri actors: muhammetakkurtt/naukri-job-scraper, agentx/all-jobs-scraper
interface NaukriItem {
  title?: string; jobTitle?: string; position?: string;
  company?: string; companyName?: string;
  location?: string; jobLocation?: string;
  url?: string; link?: string; applyLink?: string;
  description?: string; jobDescription?: string;
  salary?: string;
}

export function normaliseNaukri(items: unknown[]): ScrapedJob[] {
  return (items as NaukriItem[]).flatMap((item) => {
    const role = str(item.title, item.jobTitle, item.position);
    const company = str(item.company, item.companyName);
    if (!role || !company) return [];
    return [{
      company,
      role,
      location: str(item.location, item.jobLocation),
      jd_text: str(item.description, item.jobDescription),
      apply_link: str(item.url, item.link, item.applyLink),
      ctc_range: str(item.salary),
      posted_date: null,
      portal: 'naukri',
    }];
  });
}

// Indeed actors: curious_coder/indeed-scraper, borderline/indeed-scraper, memo23/apify-indeed-cheerio
interface IndeedItem {
  positionName?: string; title?: string; jobTitle?: string;
  company?: string; companyName?: string;
  location?: string; jobLocation?: string;
  url?: string; externalApplyLink?: string; link?: string;
  description?: string; jobDescription?: string;
  salary?: string;
}

export function normaliseIndeed(items: unknown[]): ScrapedJob[] {
  return (items as IndeedItem[]).flatMap((item) => {
    const role = str(item.positionName, item.title, item.jobTitle);
    const company = str(item.company, item.companyName);
    if (!role || !company) return [];
    return [{
      company,
      role,
      location: str(item.location, item.jobLocation),
      jd_text: str(item.description, item.jobDescription),
      apply_link: str(item.url, item.externalApplyLink, item.link),
      ctc_range: str(item.salary),
      posted_date: null,
      portal: 'indeed',
    }];
  });
}

// Wellfound via rag-web-browser — unstructured text, best-effort parse
interface WellfoundItem {
  text?: string;
  markdown?: string;
  url?: string;
}

export function normaliseWellfound(items: unknown[]): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  for (const item of items as WellfoundItem[]) {
    const text = item.markdown || item.text || '';
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      const atMatch = line.match(/^(.+?)\s+at\s+(.+)$/i);
      const dashMatch = line.match(/^(.+?)\s+[—–-]\s+(.+)$/);
      if (atMatch && atMatch[1].length < 80 && atMatch[2].length < 80) {
        jobs.push({ role: atMatch[1], company: atMatch[2], location: null, jd_text: null, apply_link: item.url || null, ctc_range: null, posted_date: null, portal: 'wellfound' });
      } else if (dashMatch && dashMatch[1].length < 80 && dashMatch[2].length < 80) {
        jobs.push({ company: dashMatch[1], role: dashMatch[2], location: null, jd_text: null, apply_link: item.url || null, ctc_range: null, posted_date: null, portal: 'wellfound' });
      }
      if (jobs.length >= 15) break;
    }
  }
  return jobs;
}

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, createAdminClient } from '@/lib/lakshya/supabase-server';
import {
  tryActorsInOrder,
  normaliseLinkedIn,
  normaliseNaukri,
  normaliseIndeed,
  normaliseWellfound,
} from '@/lib/lakshya/apify';
import type { ScrapedJob } from '@/lib/lakshya/apify';
import type { LakshyaProfile } from '@/lib/lakshya/types';
import { ANIMESH_EMAIL } from '@/lib/lakshya/animesh-profile';

// ─── Junior-role filter ────────────────────────────────────────────────────────

const SKIP_TITLE_KEYWORDS = [
  'junior', 'fresher', 'trainee', 'intern',
  'angular only', '0-2 years', '1-3 years', '0-1 year',
];

function isJuniorRole(role: string): boolean {
  const lower = role.toLowerCase();
  return SKIP_TITLE_KEYWORDS.some((kw) => lower.includes(kw));
}

function filterSenior(jobs: ScrapedJob[]): ScrapedJob[] {
  return jobs.filter((j) => !isJuniorRole(j.role));
}

// ─── Query builder ────────────────────────────────────────────────────────────

interface ScrapeQueries {
  linkedin: string[];
  naukri: string[];
  indeed: string[];
  targetCompanies: string[];
}

function buildQueries(profile: LakshyaProfile): ScrapeQueries {
  // Animesh gets hardcoded high-quality queries
  if (profile.email === ANIMESH_EMAIL) {
    return {
      linkedin: [
        'Lead Frontend Engineer React TypeScript India',
        'Staff Frontend Engineer Next.js Fintech',
        'Principal Frontend Engineer India remote',
      ],
      naukri: [
        'Lead Frontend Engineer React TypeScript Delhi',
        'Frontend Architect TypeScript Next.js',
      ],
      indeed: [
        'Lead Frontend Engineer React 50 LPA India',
        'Staff Engineer Frontend India remote',
      ],
      targetCompanies: [
        'Razorpay', 'Zepto', 'Groww', 'PhonePe', 'CRED',
        'Postman', 'BrowserStack', 'Juspay', 'Jar', 'Jupiter',
      ],
    };
  }

  // Generic profile — build from stored prefs
  const roles = (profile.scrape_keywords?.length
    ? profile.scrape_keywords
    : profile.target_roles) ?? ['Frontend Engineer'];

  const seniorityPrefixes = ['Lead', 'Staff', 'Principal', 'Senior'];
  const baseRole = roles[0] ?? 'Frontend Engineer';
  const locationStr = profile.target_locations?.includes('Remote')
    ? 'India remote'
    : (profile.target_locations?.[0] ?? 'India');

  return {
    linkedin: [
      `Lead ${baseRole} React TypeScript`,
      `Staff ${baseRole} ${locationStr}`,
      seniorityPrefixes
        .map((p) => `${p} ${baseRole}`)
        .slice(0, 2)
        .join(' OR '),
    ],
    naukri: [
      `Lead ${baseRole} React TypeScript ${locationStr}`,
      `Senior ${baseRole} Next.js`,
    ],
    indeed: [
      `Lead ${baseRole} React TypeScript`,
      `Staff ${baseRole} India remote`,
    ],
    targetCompanies: [],
  };
}

// ─── LinkedIn actor config ────────────────────────────────────────────────────

function linkedInActors(queries: string[], locationStr: string, targetCompanies: string[]) {
  const actors: Array<{ id: string; input: object }> = [];

  // One search per targeted query
  for (const q of queries.slice(0, 3)) {
    const searchUrl =
      `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(q)}` +
      `&location=${encodeURIComponent(locationStr)}&f_TPR=r604800&f_E=3%2C4&sortBy=R`;
    actors.push(
      { id: 'curious_coder~linkedin-jobs-scraper', input: { searchUrl, maxItems: 20 } },
      { id: 'curious_coder~linkedin-jobs-search-scraper', input: { searchUrl, maxItems: 20 } },
    );
  }

  // Extra search targeting specific companies (batches of 5)
  if (targetCompanies.length > 0) {
    for (let i = 0; i < targetCompanies.length; i += 5) {
      const batch = targetCompanies.slice(i, i + 5);
      const searchUrl =
        `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent('Frontend Engineer')}` +
        `&company=${encodeURIComponent(batch.join(','))}&location=India&f_TPR=r2592000`;
      actors.push(
        { id: 'curious_coder~linkedin-jobs-scraper', input: { searchUrl, maxItems: 20 } },
      );
    }
  }

  return actors;
}

// ─── Naukri actor config ──────────────────────────────────────────────────────

function naukriActors(queries: string[], locationStr: string, yearsExp: number) {
  return queries.slice(0, 2).flatMap((q) => [
    {
      id: 'muhammetakkurtt~naukri-job-scraper',
      input: {
        keyword: q,
        location: locationStr,
        experience: `${yearsExp},${yearsExp + 5}`,
        salary: '1500000',
        maxItems: 20,
      },
    },
    {
      id: 'agentx~all-jobs-scraper',
      input: { query: q, location: locationStr, site: 'naukri.com', maxItems: 20 },
    },
  ]);
}

// ─── Indeed actor config ──────────────────────────────────────────────────────

function indeedActors(queries: string[], locationStr: string) {
  return queries.slice(0, 2).flatMap((q) => {
    const input = { query: q, location: locationStr, country: 'IN', maxItems: 20 };
    return [
      { id: 'curious_coder~indeed-scraper', input },
      { id: 'borderline~indeed-scraper', input },
      { id: 'memo23~apify-indeed-cheerio', input },
    ];
  });
}

// ─── Main scrape logic (shared between user + cron paths) ─────────────────────

async function runScrape(
  profile: LakshyaProfile,
  portals: string[],
  apiKey: string
): Promise<{
  portalResults: Record<string, ScrapedJob[]>;
  allJobs: ScrapedJob[];
}> {
  const locationStr = profile.target_locations?.includes('Remote')
    ? 'India Remote'
    : (profile.target_locations?.[0] ?? 'Delhi NCR');
  const yearsExp = profile.years_experience ?? 7;
  const queries = buildQueries(profile);

  const portalResults: Record<string, ScrapedJob[]> = {};

  await Promise.all(
    portals.map(async (portal) => {
      let raw: unknown[] = [];
      if (portal === 'linkedin') {
        raw = await tryActorsInOrder(
          linkedInActors(queries.linkedin, locationStr, queries.targetCompanies),
          apiKey, 60,
        );
        portalResults[portal] = filterSenior(normaliseLinkedIn(raw));
      } else if (portal === 'naukri') {
        raw = await tryActorsInOrder(naukriActors(queries.naukri, locationStr, yearsExp), apiKey, 60);
        portalResults[portal] = filterSenior(normaliseNaukri(raw));
      } else if (portal === 'indeed') {
        raw = await tryActorsInOrder(indeedActors(queries.indeed, locationStr), apiKey, 60);
        portalResults[portal] = filterSenior(normaliseIndeed(raw));
      } else if (portal === 'wellfound') {
        raw = await tryActorsInOrder([{
          id: 'apify~rag-web-browser',
          input: { startUrls: ['https://wellfound.com/jobs?role=frontend-engineer&remote=true'], maxCrawlPages: 3 },
        }], apiKey, 60);
        portalResults[portal] = filterSenior(normaliseWellfound(raw));
      } else {
        portalResults[portal] = [];
      }
      console.log(`[scrape] portal=${portal} jobs=${portalResults[portal].length}`);
    })
  );

  const allJobs = Object.values(portalResults).flat();
  return { portalResults, allJobs };
}

function buildInsertRows(jobs: ScrapedJob[], userId: string) {
  return jobs.map((j) => ({
    user_id: userId,
    company: j.company,
    role: j.role,
    location: j.location,
    jd_text: j.jd_text,
    apply_link: j.apply_link,
    ctc_range: j.ctc_range,
    portal: j.portal,
    posted_date: j.posted_date,
    status: 'Saved',
    is_starred: false,
    date_scraped: new Date().toISOString(),
    why_fit: [], gaps: [], resume_updates: [],
    study_topics: [], interview_questions: [],
  }));
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // ── Cron / service-role path ─────────────────────────────────────────────
  const serviceUserId = req.headers.get('x-service-user-id');
  const serviceRoleKey = req.headers.get('x-service-role');

  if (serviceUserId && serviceRoleKey === process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = createAdminClient();
    const body = await req.json().catch(() => ({})) as { portals?: string[] };

    const { data: profileData } = await admin
      .from('lakshya_profiles').select('*').eq('id', serviceUserId).single();
    if (!profileData?.apify_key) {
      return NextResponse.json({ error: 'No Apify key configured', setupRequired: true }, { status: 400 });
    }

    const p = profileData as LakshyaProfile;
    const portals = body.portals ?? p.scrape_portals ?? ['linkedin', 'naukri', 'indeed'];

    const { data: run, error: runErr } = await admin
      .from('lakshya_runs')
      .insert({
        user_id: serviceUserId,
        run_date: new Date().toISOString(),
        jobs_scraped: 0, jobs_new: 0, jobs_scored: 0,
        apply_now_count: 0, update_first_count: 0, skip_count: 0,
        portals_used: portals, status: 'running', error_message: null,
      })
      .select().single();
    if (runErr || !run) return NextResponse.json({ error: 'Failed to create run' }, { status: 500 });

    const { portalResults, allJobs } = await runScrape(p, portals, p.apify_key!);
    const portalCounts: Record<string, number> = {};
    for (const [k, v] of Object.entries(portalResults)) portalCounts[k] = v.length;

    const { data: existing } = await admin
      .from('lakshya_jobs').select('company,role,apply_link').eq('user_id', serviceUserId);
    const existingKeys = new Set((existing ?? []).map((j: { company: string; role: string; apply_link: string | null }) => `${j.company}|${j.role}|${j.apply_link ?? ''}`));
    const newJobs = allJobs.filter((j) => !existingKeys.has(`${j.company}|${j.role}|${j.apply_link ?? ''}`));

    if (newJobs.length > 0) {
      await admin.from('lakshya_jobs').insert(buildInsertRows(newJobs, serviceUserId));
    }

    await admin.from('lakshya_runs').update({
      status: 'completed',
      jobs_scraped: allJobs.length,
      jobs_new: newJobs.length,
      error_message: null,
    }).eq('id', run.id);

    return NextResponse.json({ runId: run.id, scraped: allJobs.length, new: newJobs.length, portalCounts });
  }

  // ── Regular user auth path ───────────────────────────────────────────────
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({})) as { portals?: string[] };

  const { data: profileData } = await supabase
    .from('lakshya_profiles').select('*').eq('id', user.id).single();
  if (!profileData?.apify_key) {
    return NextResponse.json({ error: 'No Apify key configured', setupRequired: true }, { status: 400 });
  }

  const p = profileData as LakshyaProfile;
  const portals = body.portals ?? p.scrape_portals ?? ['linkedin', 'naukri', 'indeed'];

  const { data: run, error: runErr } = await supabase
    .from('lakshya_runs')
    .insert({
      user_id: user.id,
      run_date: new Date().toISOString(),
      jobs_scraped: 0, jobs_new: 0, jobs_scored: 0,
      apply_now_count: 0, update_first_count: 0, skip_count: 0,
      portals_used: portals, status: 'running', error_message: null,
    })
    .select().single();
  if (runErr || !run) return NextResponse.json({ error: 'Failed to create run' }, { status: 500 });

  const { portalResults, allJobs } = await runScrape(p, portals, p.apify_key!);
  const portalCounts: Record<string, number> = {};
  for (const [k, v] of Object.entries(portalResults)) portalCounts[k] = v.length;

  // Deduplicate
  const { data: existing } = await supabase
    .from('lakshya_jobs').select('company,role,apply_link').eq('user_id', user.id);
  const existingKeys = new Set((existing ?? []).map((j: { company: string; role: string; apply_link: string | null }) => `${j.company}|${j.role}|${j.apply_link ?? ''}`));
  const newJobs = allJobs.filter((j) => !existingKeys.has(`${j.company}|${j.role}|${j.apply_link ?? ''}`));
  const dupCount = allJobs.length - newJobs.length;

  // Insert + fire-and-forget scoring
  let insertedIds: string[] = [];
  if (newJobs.length > 0) {
    const { data: inserted, error: insertErr } = await supabase
      .from('lakshya_jobs').insert(buildInsertRows(newJobs, user.id)).select('id');
    if (insertErr) console.error('[scrape] insert error:', insertErr.message);
    insertedIds = (inserted ?? []).map((r: { id: string }) => r.id);
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (req.headers.get('host')
      ? `${req.headers.get('x-forwarded-proto') ?? 'http'}://${req.headers.get('host')}`
      : 'http://localhost:3000');
  const cookie = req.headers.get('cookie') ?? '';

  for (const jobId of insertedIds) {
    fetch(`${baseUrl}/api/lakshya/jobs/${jobId}/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
    }).catch((err) => console.error('[scrape] score failed for', jobId, err));
  }

  await supabase.from('lakshya_runs').update({
    status: 'completed',
    jobs_scraped: allJobs.length,
    jobs_new: newJobs.length,
    error_message: null,
  }).eq('id', run.id);

  return NextResponse.json({
    runId: run.id,
    scraped: allJobs.length,
    new: newJobs.length,
    duplicates: dupCount,
    portalCounts,
  });
}

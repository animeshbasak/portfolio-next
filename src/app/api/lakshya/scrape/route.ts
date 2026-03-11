import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, createAdminClient } from '@/lib/lakshya/supabase-server';
import { runApifyActor } from '@/lib/lakshya/apify';
import type { ScrapedJob } from '@/lib/lakshya/apify';
import type { LakshyaProfile } from '@/lib/lakshya/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RagItem {
  text?: string;
  markdown?: string;
  url?: string;
}

// ─── Text parser ──────────────────────────────────────────────────────────────

const JUNIOR_PATTERN = /\b(junior|fresher|intern|trainee|0-2|1-3)\b/i;

function parseJobsFromText(text: string, portal: string, sourceUrl: string): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  const seen = new Set<string>();
  const lines = text.split('\n').filter((l) => l.trim().length > 10);

  const titlePattern =
    /\b(Lead|Staff|Principal|Senior|Head|Architect|Manager)\b.*\b(Frontend|Front.End|React|Engineer|Developer)\b/gi;

  for (let i = 0; i < lines.length; i++) {
    titlePattern.lastIndex = 0;
    const titleMatch = lines[i].match(titlePattern);
    if (!titleMatch) continue;

    const context = lines.slice(Math.max(0, i - 2), i + 8).join(' ');

    // Skip junior roles
    if (JUNIOR_PATTERN.test(context)) continue;

    const role = titleMatch[0].trim().replace(/[*#`[\]]/g, '');
    if (seen.has(role)) continue;
    seen.add(role);

    // Company — line immediately before the title line (best guess)
    const companyLine = (lines[i - 1] || lines[i + 1] || 'Unknown')
      .replace(/[*#`[\]]/g, '')
      .trim()
      .slice(0, 100);

    // Location
    const locationMatch = context.match(
      /\b(Delhi|Mumbai|Bangalore|Bengaluru|Remote|Hybrid|Pune|Hyderabad|India|NCR|Noida|Gurugram|Gurgaon)\b/i
    );

    // Salary
    const salaryMatch = context.match(/(\d+)\s*[-–]\s*(\d+)\s*(LPA|lakh|L|CTC)/i);

    // Apply URL — prefer job/career/apply links
    const urlMatch = context.match(/https?:\/\/[^\s"'<>)]+(?:job|career|apply)[^\s"'<>)]*/i);

    console.log(`[Scrape] ${portal}: fetched ${text.length} chars`);

    jobs.push({
      role,
      company: companyLine,
      location: locationMatch ? locationMatch[0] : 'India',
      apply_link: urlMatch ? urlMatch[0] : sourceUrl,
      jd_text: context.slice(0, 1000),
      ctc_range: salaryMatch ? `${salaryMatch[1]}-${salaryMatch[2]} LPA` : null,
      portal,
      posted_date: null,
    });
  }

  return jobs;
}

// ─── 5 scrape targets ─────────────────────────────────────────────────────────

const SCRAPE_TARGETS: Array<{ url: string; portal: string }> = [
  {
    url: 'https://www.naukri.com/lead-frontend-engineer-jobs',
    portal: 'naukri',
  },
  {
    url: 'https://www.naukri.com/frontend-architect-jobs',
    portal: 'naukri',
  },
  {
    url: 'https://wellfound.com/jobs?role=frontend-engineer&remote=true',
    portal: 'wellfound',
  },
  {
    url: 'https://www.indeed.co.in/jobs?q=Lead+Frontend+Engineer+React&l=Delhi&explvl=senior_level',
    portal: 'indeed',
  },
  {
    url: 'https://www.indeed.co.in/jobs?q=Staff+Frontend+Engineer+React+TypeScript&l=Remote',
    portal: 'indeed',
  },
];

// ─── Main scrape logic ────────────────────────────────────────────────────────

async function runScrape(apiKey: string): Promise<{
  portalResults: Record<string, ScrapedJob[]>;
  allJobs: ScrapedJob[];
}> {
  const settled = await Promise.allSettled(
    SCRAPE_TARGETS.map(async (target) => {
      const items = await runApifyActor(
        'apify/rag-web-browser',
        {
          startUrls: [{ url: target.url }],
          maxCrawlPages: 3,
          maxResults: 30,
        },
        apiKey,
        90
      );

      // Aggregate text across all crawled pages
      let totalText = '';
      for (const item of items as RagItem[]) {
        totalText += (item.markdown || item.text || '') + '\n\n';
      }

      console.log(`[Scrape] ${target.portal}: fetched ${totalText.length} chars`);
      const jobs = parseJobsFromText(totalText, target.portal, target.url);
      console.log(`[Scrape] ${target.portal}: extracted ${jobs.length} jobs`);
      console.log(
        `[Scrape] Sample jobs:`,
        jobs.slice(0, 3).map((j) => `${j.role} @ ${j.company}`)
      );

      return { portal: target.portal, jobs };
    })
  );

  const portalResults: Record<string, ScrapedJob[]> = {};
  for (const result of settled) {
    if (result.status === 'rejected') {
      console.error('[Scrape] target failed:', result.reason);
      continue;
    }
    const { portal, jobs } = result.value;
    if (!portalResults[portal]) portalResults[portal] = [];
    portalResults[portal].push(...jobs);
  }

  const allJobs = Object.values(portalResults).flat();
  return { portalResults, allJobs };
}

// ─── DB insert row builder ────────────────────────────────────────────────────

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

    const { data: profileData } = await admin
      .from('lakshya_profiles').select('*').eq('id', serviceUserId).single();
    if (!profileData?.apify_key) {
      return NextResponse.json({ error: 'No Apify key configured', setupRequired: true }, { status: 400 });
    }

    const p = profileData as LakshyaProfile;
    const portals = p.scrape_portals ?? ['linkedin', 'naukri', 'wellfound'];

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

    const { portalResults, allJobs } = await runScrape(p.apify_key!);
    const portalCounts: Record<string, number> = {};
    for (const [k, v] of Object.entries(portalResults)) portalCounts[k] = v.length;

    const { data: existing } = await admin
      .from('lakshya_jobs').select('company,role,apply_link').eq('user_id', serviceUserId);
    const existingKeys = new Set(
      (existing ?? []).map((j: { company: string; role: string; apply_link: string | null }) =>
        `${j.company}|${j.role}|${j.apply_link ?? ''}`
      )
    );
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

  const { data: profileData } = await supabase
    .from('lakshya_profiles').select('*').eq('id', user.id).single();
  if (!profileData?.apify_key) {
    return NextResponse.json({ error: 'No Apify key configured', setupRequired: true }, { status: 400 });
  }

  const p = profileData as LakshyaProfile;
  const portals = p.scrape_portals ?? ['linkedin', 'naukri', 'wellfound'];

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

  const { portalResults, allJobs } = await runScrape(p.apify_key!);
  const portalCounts: Record<string, number> = {};
  for (const [k, v] of Object.entries(portalResults)) portalCounts[k] = v.length;

  // Deduplicate
  const { data: existing } = await supabase
    .from('lakshya_jobs').select('company,role,apply_link').eq('user_id', user.id);
  const existingKeys = new Set(
    (existing ?? []).map((j: { company: string; role: string; apply_link: string | null }) =>
      `${j.company}|${j.role}|${j.apply_link ?? ''}`
    )
  );
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

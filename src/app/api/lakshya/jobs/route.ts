import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/lakshya/supabase-server';
import { claudeScore } from '@/lib/lakshya/claude';
import type { LakshyaProfile } from '@/lib/lakshya/types';

function buildProfileText(profile: LakshyaProfile): string {
  return `CANDIDATE: ${profile.full_name || 'Unknown'}
CURRENT ROLE: ${profile.current_role || 'Not specified'} at ${profile.current_company || 'Not specified'}
YEARS EXPERIENCE: ${profile.years_experience}
TECH STACK: ${profile.tech_stack.join(', ')}
TARGET ROLES: ${profile.target_roles.join(', ')}
TARGET SALARY: ${profile.target_salary_min}+ LPA
TARGET LOCATIONS: ${profile.target_locations.join(', ')}
PREFERRED DOMAINS: ${profile.preferred_domains.join(', ')}

RESUME:
${profile.resume_text || 'Not provided'}`;
}

export async function GET() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: jobs, error } = await supabase
      .from('lakshya_jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ jobs: jobs ?? [] });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { company, role, jd_text, location, ctc_range, apply_link, portal } = body;

    if (!company || !role || !jd_text) {
      return NextResponse.json({ error: 'company, role, and jd_text are required' }, { status: 400 });
    }

    // Fetch user profile to build profile text for scoring
    const { data: profile } = await supabase
      .from('lakshya_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Score the job with Claude
    const p = profile as LakshyaProfile;
    const profileText = buildProfileText(p);
    const scored = await claudeScore(jd_text, profileText, p.anthropic_key);

    // Insert into DB
    const { data: job, error } = await supabase
      .from('lakshya_jobs')
      .insert({
        user_id: user.id,
        company,
        role,
        jd_text,
        jd_summary: scored.jdSummary,
        location: location || null,
        ctc_range: ctc_range || null,
        apply_link: apply_link || null,
        portal: portal || 'manual',
        match_score: scored.matchScore,
        interview_prob: scored.interviewProb,
        decision: scored.decision,
        decision_reason: scored.decisionReason,
        why_fit: scored.whyFit,
        gaps: scored.gaps,
        resume_updates: scored.resumeUpdates,
        study_topics: scored.studyTopics,
        interview_questions: scored.interviewQuestions,
        cold_message: scored.coldMessage,
        is_moonshot: scored.isMoonshot,
        status: 'Saved',
        is_starred: false,
        date_scraped: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ job });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

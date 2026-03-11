import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/lakshya/supabase-server';
import { claudeScore } from '@/lib/lakshya/claude';
import type { LakshyaProfile } from '@/lib/lakshya/types';

function buildProfileText(p: LakshyaProfile): string {
  return `CANDIDATE: ${p.full_name || 'Unknown'}
CURRENT ROLE: ${p.current_role || ''} at ${p.current_company || ''}
YEARS EXPERIENCE: ${p.years_experience}
TECH STACK: ${p.tech_stack.join(', ')}
TARGET ROLES: ${p.target_roles.join(', ')}
TARGET SALARY: ${p.target_salary_min}+ LPA
TARGET LOCATIONS: ${p.target_locations.join(', ')}
PREFERRED DOMAINS: ${p.preferred_domains.join(', ')}
RESUME:
${p.resume_text || 'Not provided'}`;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: job } = await supabase
      .from('lakshya_jobs').select('*').eq('id', id).eq('user_id', user.id).single();
    if (!job || !job.jd_text) {
      return NextResponse.json({ error: 'Job not found or no JD' }, { status: 404 });
    }

    const { data: profile } = await supabase
      .from('lakshya_profiles').select('*').eq('id', user.id).single();
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const p = profile as LakshyaProfile;
    const scored = await claudeScore(job.jd_text as string, buildProfileText(p), p.anthropic_key);

    await supabase.from('lakshya_jobs').update({
      jd_summary: scored.jdSummary,
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
    }).eq('id', id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

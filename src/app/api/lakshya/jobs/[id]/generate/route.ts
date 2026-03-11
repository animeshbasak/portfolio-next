import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/lakshya/supabase-server';
import { claudeCoverLetter, claudeColdMessage } from '@/lib/lakshya/claude';
import type { LakshyaProfile, LakshyaJob } from '@/lib/lakshya/types';

function buildProfileText(profile: LakshyaProfile): string {
  return `CANDIDATE: ${profile.full_name || 'Unknown'}
CURRENT ROLE: ${profile.current_role || 'Not specified'} at ${profile.current_company || 'Not specified'}
YEARS EXPERIENCE: ${profile.years_experience}
TECH STACK: ${profile.tech_stack.join(', ')}
TARGET ROLES: ${profile.target_roles.join(', ')}
TARGET SALARY: ${profile.target_salary_min}+ LPA
TARGET LOCATIONS: ${profile.target_locations.join(', ')}

RESUME:
${profile.resume_text || 'Not provided'}`;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { type } = await req.json();

    if (type !== 'cover_letter' && type !== 'cold_message') {
      return NextResponse.json({ error: 'type must be cover_letter or cold_message' }, { status: 400 });
    }

    // Fetch job and profile in parallel
    const [jobRes, profileRes] = await Promise.all([
      supabase.from('lakshya_jobs').select('*').eq('id', id).eq('user_id', user.id).single(),
      supabase.from('lakshya_profiles').select('*').eq('id', user.id).single(),
    ]);

    if (jobRes.error || !jobRes.data) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    if (profileRes.error || !profileRes.data) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const job = jobRes.data as LakshyaJob;
    const prof = profileRes.data as LakshyaProfile;
    const profileText = buildProfileText(prof);

    let generated: string;
    if (type === 'cover_letter') {
      generated = await claudeCoverLetter(job, profileText, prof.anthropic_key);
    } else {
      generated = await claudeColdMessage(job, profileText, prof.anthropic_key);
    }

    // Save generated content to job
    const field = type === 'cover_letter' ? 'cover_letter' : 'cold_message';
    await supabase
      .from('lakshya_jobs')
      .update({ [field]: generated })
      .eq('id', id)
      .eq('user_id', user.id);

    return NextResponse.json({ [field]: generated });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/lakshya/supabase-server';
import { claudeSkillsGap } from '@/lib/lakshya/claude';
import type { LakshyaProfile } from '@/lib/lakshya/types';

export async function POST() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [profileRes, jobsRes] = await Promise.all([
    supabase.from('lakshya_profiles').select('tech_stack,anthropic_key').eq('id', user.id).single(),
    supabase.from('lakshya_jobs').select('jd_text').eq('user_id', user.id)
      .not('jd_text', 'is', null).limit(20),
  ]);

  if (!profileRes.data) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const prof = profileRes.data as LakshyaProfile;
  const gaps = await claudeSkillsGap(
    (jobsRes.data ?? []) as { jd_text: string }[],
    prof.tech_stack,
    prof.anthropic_key
  );

  return NextResponse.json({ gaps });
}

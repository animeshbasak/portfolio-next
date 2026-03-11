import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, createAdminClient } from '@/lib/lakshya/supabase-server';
import { validateApifyKey } from '@/lib/lakshya/apify';

export async function GET(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const action = req.nextUrl.searchParams.get('action');

  if (action === 'test-apify') {
    const { data: profile } = await supabase
      .from('lakshya_profiles').select('apify_key').eq('id', user.id).single();
    if (!profile?.apify_key) {
      return NextResponse.json({ connected: false, error: 'No API key saved' });
    }
    const valid = await validateApifyKey(profile.apify_key as string);
    return NextResponse.json({ connected: valid });
  }

  const { data: profile, error } = await supabase
    .from('lakshya_profiles').select('*').eq('id', user.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json() as Record<string, unknown>;
  // Allowlist of patchable fields
  const allowed = [
    'full_name','current_company','current_role','target_roles',
    'target_salary_min','target_locations','preferred_domains','tech_stack',
    'years_experience','apify_key','anthropic_key','openai_key',
    'scraping_enabled','scrape_portals','scrape_keywords','min_match_score',
  ];
  const patch: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) patch[key] = body[key];
  }
  patch.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('lakshya_profiles').update(patch).eq('id', user.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createServerClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { action } = await req.json() as { action: string };

  if (action === 'clear-jobs') {
    await supabase.from('lakshya_jobs').delete().eq('user_id', user.id);
    return NextResponse.json({ ok: true });
  }

  if (action === 'reset-onboarding') {
    await supabase.from('lakshya_profiles')
      .update({ onboarding_complete: false }).eq('id', user.id);
    return NextResponse.json({ ok: true });
  }

  if (action === 'delete-account') {
    await supabase.from('lakshya_jobs').delete().eq('user_id', user.id);
    await supabase.from('lakshya_stories').delete().eq('user_id', user.id);
    await supabase.from('lakshya_runs').delete().eq('user_id', user.id);
    await supabase.from('lakshya_profiles').delete().eq('id', user.id);
    await admin.auth.admin.deleteUser(user.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

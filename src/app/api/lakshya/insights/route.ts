import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/lakshya/supabase-server';

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [jobs, runs] = await Promise.all([
    supabase.from('lakshya_jobs').select('*').eq('user_id', user.id),
    supabase.from('lakshya_runs').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(10),
  ]);

  return NextResponse.json({ jobs: jobs.data ?? [], runs: runs.data ?? [] });
}

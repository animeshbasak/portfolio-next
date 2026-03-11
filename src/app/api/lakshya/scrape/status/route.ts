import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/lakshya/supabase-server';

export async function GET(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const runId = req.nextUrl.searchParams.get('runId');

  let query = supabase
    .from('lakshya_runs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1);

  if (runId) {
    query = supabase
      .from('lakshya_runs')
      .select('*')
      .eq('user_id', user.id)
      .eq('id', runId)
      .limit(1);
  }

  const { data: runs, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const run = runs?.[0] ?? null;
  if (!run) return NextResponse.json({ run: null });

  return NextResponse.json({ run });
}

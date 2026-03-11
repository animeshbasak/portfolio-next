import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/lakshya/supabase-server';

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data, error } = await supabase
    .from('lakshya_stories').select('*').eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ stories: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json() as {
    company?: string;
    title?: string;
    situation?: string;
    task?: string;
    action?: string;
    result?: string;
    tags?: string[];
  };
  const { company, title, situation, task, action, result, tags } = body;
  if (!title || !situation || !task || !action || !result) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const { data, error } = await supabase
    .from('lakshya_stories')
    .insert({ user_id: user.id, company: company || '', title, situation, task, action, result, tags: tags || [] })
    .select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ story: data });
}

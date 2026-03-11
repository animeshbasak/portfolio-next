import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/lakshya/supabase-server';

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profiles, error } = await admin
    .from('lakshya_profiles')
    .select('id, apify_key')
    .eq('scraping_enabled', true)
    .not('apify_key', 'is', null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let processed = 0;
  const origin = `https://${req.headers.get('host')}`;

  for (const profile of profiles ?? []) {
    try {
      await fetch(`${origin}/api/lakshya/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-service-user-id': profile.id as string,
          'x-service-role': process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        },
        body: JSON.stringify({ portals: ['linkedin', 'naukri'] }),
      });
      processed++;
    } catch {
      // continue to next user
    }
    await new Promise((r) => setTimeout(r, 5000));
  }

  return NextResponse.json({
    processed,
    total: profiles?.length ?? 0,
    timestamp: new Date().toISOString(),
  });
}

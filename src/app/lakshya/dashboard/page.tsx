import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/lakshya/auth';
import { createServerClient } from '@/lib/lakshya/supabase-server';
import DashboardClient from './DashboardClient';
import type { LakshyaJob, LakshyaProfile } from '@/lib/lakshya/types';

export default async function DashboardPage() {
  const user = await requireAuth();

  const supabase = await createServerClient();

  const [profileRes, jobsRes] = await Promise.all([
    supabase
      .from('lakshya_profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
    supabase
      .from('lakshya_jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ]);

  if (!profileRes.data?.onboarding_complete) {
    redirect('/lakshya/onboarding');
  }

  return (
    <DashboardClient
      profile={profileRes.data as LakshyaProfile}
      initialJobs={(jobsRes.data ?? []) as LakshyaJob[]}
    />
  );
}

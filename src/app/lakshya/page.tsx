import { redirect } from 'next/navigation';
import { getUser } from '@/lib/lakshya/auth';
import { createServerClient } from '@/lib/lakshya/supabase-server';

export default async function LakshyaRootPage() {
  const user = await getUser();

  if (!user) {
    redirect('/lakshya/login');
  }

  const supabase = await createServerClient();
  const { data: profile } = await supabase
    .from('lakshya_profiles')
    .select('onboarding_complete')
    .eq('id', user.id)
    .single();

  if (profile?.onboarding_complete) {
    redirect('/lakshya/dashboard');
  }

  redirect('/lakshya/onboarding');
}

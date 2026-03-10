import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/lakshya/supabase-server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/lakshya/login?error=auth_failed`);
  }

  try {
    const supabase = await createServerClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      return NextResponse.redirect(`${origin}/lakshya/login?error=auth_failed`);
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(`${origin}/lakshya/login?error=auth_failed`);
    }

    const { data: profile } = await supabase
      .from('lakshya_profiles')
      .select('onboarding_complete')
      .eq('id', user.id)
      .single();

    if (profile?.onboarding_complete) {
      return NextResponse.redirect(`${origin}/lakshya/dashboard`);
    }

    return NextResponse.redirect(`${origin}/lakshya/onboarding`);
  } catch {
    return NextResponse.redirect(`${origin}/lakshya/login?error=auth_failed`);
  }
}

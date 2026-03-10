import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if user has completed onboarding
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('lakshya_profiles')
          .select('onboarding_complete')
          .eq('id', user.id)
          .single()

        if (profile?.onboarding_complete) {
          return NextResponse.redirect(
            new URL('/lakshya/dashboard', requestUrl.origin)
          )
        } else {
          return NextResponse.redirect(
            new URL('/lakshya/onboarding', requestUrl.origin)
          )
        }
      }
    }
  }

  // Auth failed — back to login with error
  return NextResponse.redirect(
    new URL('/lakshya/login?error=auth_failed', requestUrl.origin)
  )
}
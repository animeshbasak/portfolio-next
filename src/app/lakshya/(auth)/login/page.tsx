'use client';

// SETUP REQUIRED IN SUPABASE DASHBOARD:
// 1. Go to Authentication > Providers > Google
// 2. Enable Google provider
// 3. Add OAuth credentials from Google Cloud Console
// 4. Set redirect URL to:
//    https://animeshbasak.vercel.app/api/lakshya/auth/callback
// 5. Also add http://localhost:3000/api/lakshya/auth/callback for local dev

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/lakshya/supabase-client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/lakshya/dashboard');
      }
    });
  }, [router, supabase.auth]);

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
       redirectTo: `${window.location.origin}/api/lakshya/auth/callback`,
      },
    });
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--lk-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"DM Sans", sans-serif',
    }}>
      <div style={{
        background: 'var(--lk-surface)',
        border: '1px solid var(--lk-border)',
        borderRadius: 'var(--lk-radius)',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: '"DM Mono", monospace',
            color: 'var(--lk-accent)',
            fontSize: '28px',
            fontWeight: 500,
            margin: 0,
            letterSpacing: '-0.5px',
          }}>
            लक्ष्य Lakshya
          </h1>
          <p style={{
            color: 'var(--lk-text-muted)',
            fontSize: '14px',
            margin: '8px 0 0',
          }}>
            Your AI job hunting OS
          </p>
        </div>

        <div style={{
          width: '100%',
          height: '1px',
          background: 'var(--lk-border)',
        }} />

        <button
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: '#ffffff',
            color: '#1a1a1a',
            border: 'none',
            borderRadius: 'var(--lk-radius-sm)',
            padding: '12px 20px',
            fontSize: '15px',
            fontWeight: 500,
            fontFamily: '"DM Sans", sans-serif',
            cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p style={{
          color: 'var(--lk-text-muted)',
          fontSize: '12px',
          textAlign: 'center',
          margin: 0,
        }}>
          Built for Animesh Basak · Private tool
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

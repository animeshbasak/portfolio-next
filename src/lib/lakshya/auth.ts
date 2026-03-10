import { redirect } from 'next/navigation';
import { createServerClient } from './supabase-server';
import { ANIMESH_EMAIL } from './animesh-profile';

export async function getSession() {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    redirect('/lakshya/login');
  }
  return user;
}

export function isAnimesh(email: string): boolean {
  return email === ANIMESH_EMAIL;
}

import { supabase } from './supabaseClient';

export async function signInWithGoogle() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    return session;
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });

  if (error) {
    console.error('Google sign-in failed:', error.message);
    return null;
  }

  return null;
}
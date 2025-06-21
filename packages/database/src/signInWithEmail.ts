import { supabase } from './supabaseClient';

export async function signInWithEmail() {
  if (import.meta.env.MODE === 'development') {
    console.log('Attempting to sign in with email...', import.meta.env.VITE_DEV_EMAIL, import.meta.env.VITE_DEV_PASSWORD);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_DEV_EMAIL,
      password: import.meta.env.VITE_DEV_PASSWORD,
    });
    if (error) {
      console.error('Dev sign-in failed:', error.message);
    }
    return data;
  }
} 
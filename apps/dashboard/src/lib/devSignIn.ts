export async function devSignIn(supabaseDev: any) {
  if (import.meta.env.MODE === 'development') {
    const { error } = await supabaseDev.auth.signInWithPassword({
      email: import.meta.env.VITE_DEV_EMAIL,
      password: import.meta.env.VITE_DEV_PASSWORD,
    });
    if (error) {
      console.error('Dev sign-in failed:', error.message);
    }
  }
} 
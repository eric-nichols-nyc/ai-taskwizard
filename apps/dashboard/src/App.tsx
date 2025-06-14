import { useEffect } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { AuthProvider } from '@turbo-with-tailwind-v4/supabase'
import { supabase } from './supabaseClient'
import { router } from './router'
import { createClient } from '@supabase/supabase-js'
const supabaseDev = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

// Only for development!
if (import.meta.env.MODE === 'development') {
  supabaseDev.auth.setSession({
    access_token: import.meta.env.VITE_DEV_ACCESS_TOKEN, // Your dev token in .env
    refresh_token: '', // Or real refresh token if you have it
  })
}

// async function devSignIn() {
//   if (import.meta.env.MODE === 'development') {
//     const { error } = await supabaseDev.auth.signInWithPassword({
//       email: import.meta.env.VITE_DEV_EMAIL,
//       password: import.meta.env.VITE_DEV_PASSWORD,
//     });
//     if (error) {
//       console.error('Dev sign-in failed:', error.message);
//     }
//   }
// }

function App() {
  useEffect(() => {
    async function maybeSignInWithGoogle() {
      if (import.meta.env.MODE === 'development') {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin,
            },
          });
          if (error) {
            console.error('Google sign-in failed:', error.message);
          }
        }
      }
    }
    maybeSignInWithGoogle();
  }, []);

  return (
    import.meta.env.MODE === 'development' ? (
        <RouterProvider router={router} />
    ) : (
      <AuthProvider isHost={true} supabase={supabase} accessToken={import.meta.env.VITE_USER_ACCESS_TOKEN}>
        <RouterProvider router={router} />
      </AuthProvider>
    )
  )
}

export default App

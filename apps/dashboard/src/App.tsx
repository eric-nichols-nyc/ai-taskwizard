import { useEffect } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { AuthProvider } from '@turbo-with-tailwind-v4/supabase'
import { supabase } from './supabaseClient'
import { router } from './router'


const IS_ISOLATED = window.location.href.includes(import.meta.env.VITE_ISOLATED_HOST);

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
      if (IS_ISOLATED) {
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
   !IS_ISOLATED ? (
        <RouterProvider router={router} />
    ) : (
      <AuthProvider isHost={false} supabase={supabase} >
        <RouterProvider router={router} />
      </AuthProvider>
    )
  )
}

export default App

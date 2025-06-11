import { RouterProvider } from '@tanstack/react-router'
import { AuthProvider } from '@turbo-with-tailwind-v4/supabase'
import { supabase } from './supabaseClient'
import { router } from './router'

function App() {
  return (
    <AuthProvider supabase={supabase}>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App

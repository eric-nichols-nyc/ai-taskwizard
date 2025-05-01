import { createClient } from '@supabase/supabase-js'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)

interface AuthState {
  session: any | null
  user: any | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  setSession: (session: any) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        set({ session: data.session, user: data.user })
      },
      signUp: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        set({ session: data.session, user: data.user })
      },
      signOut: async () => {
        await supabase.auth.signOut()
        set({ session: null, user: null })
      },
      setSession: (session) => set({ session }),
    }),
    {
      name: 'auth-storage',
    }
  )
) 
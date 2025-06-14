'use client'
import * as React from 'react'
import { createContext, useEffect, useState, useMemo } from 'react'
import { User, Session, SupabaseClient } from '@supabase/supabase-js'
import { AuthContextType } from './types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ 
    children, 
    isHost = false,
    supabase,
    accessToken
  }: { 
    children: React.ReactNode
    isHost?: boolean
    supabase: SupabaseClient
    accessToken?: string
  }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    // If an accessToken prop is provided, use it (dev or otherwise)
    if (accessToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: '',
      });
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      });
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      if (_event === 'SIGNED_OUT') {
        setUser(null)
        setSession(null)
      }
    });

    return () => subscription.unsubscribe()
  }, [accessToken, isHost])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error: error.message }
      return {}
    } catch {
      return { error: 'An unexpected error occurred' }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, metadata?: { firstName?: string; lastName?: string }) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: metadata
        }
      })
      if (error) return { error: error.message }
      setSuccess("Check your email to verify your account.")
      return {}
    } catch {
      return { error: 'An unexpected error occurred' }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setLoading(false)
  }

  const signInWithProvider = async (provider: 'google' | 'github') => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) return { error: error.message }
      return {}
    } catch {
      return { error: 'An unexpected error occurred' }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) return { error: error.message }
      return {}
    } catch {
      return { error: 'An unexpected error occurred' }
    }
  }

  const updateProfile = async (updates: { email?: string; password?: string }) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.updateUser(updates)
      if (error) return { error: error.message }
      return {}
    } catch {
      return { error: 'An unexpected error occurred' }
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = useMemo(() => ({
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithProvider,
    resetPassword,
    updateProfile,
  }), [user, session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }

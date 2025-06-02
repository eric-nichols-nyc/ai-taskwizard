'use client'
import * as React from 'react'
import { createContext, useEffect, useState, useMemo } from 'react'
import { User, Session, AuthError, SupabaseClient } from '@supabase/supabase-js'
import { AuthContextType } from './types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ 
    children, 
    isHost = false,
    supabase
  }: { 
    children: React.ReactNode
    isHost?: boolean
    supabase: SupabaseClient
  }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // If this is the host, broadcast auth state to child apps
      if (isHost && typeof window !== 'undefined') {
        broadcastAuthState(session?.user ?? null, session)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Broadcast auth changes to child apps if this is the host
      if (isHost && typeof window !== 'undefined') {
        broadcastAuthState(session?.user ?? null, session, event)
      }

      if (event === 'SIGNED_OUT') {
        setUser(null)
        setSession(null)
      }
    })

    // If this is the host, listen for auth state requests from child apps
    if (isHost && typeof window !== 'undefined') {
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'REQUEST_AUTH_STATE') {
          // Respond with current auth state
          (event.source as Window)?.postMessage({
            type: 'AUTH_STATE_RESPONSE',
            user: user,
            session: session
          }, '*')
        }
      }

      window.addEventListener('message', handleMessage)
      return () => {
        subscription.unsubscribe()
        window.removeEventListener('message', handleMessage)
      }
    }

    return () => subscription.unsubscribe()
  }, [isHost])

    // Helper function to broadcast auth state
    const broadcastAuthState = (user: User | null, session: Session | null, event?: string) => {
        // Broadcast to all child frames/windows
        const message = {
          type: 'AUTH_STATE_CHANGE',
          user,
          session,
          event
        }
        
        // Post to all iframes
        const iframes = document.querySelectorAll('iframe')
        iframes.forEach(iframe => {
          iframe.contentWindow?.postMessage(message, '*')
        })
        
        // Also post to current window for other listeners
        window.postMessage(message, '*')
      }
    

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        return { error: error.message }
      }
      
      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        return { error: error.message }
      }
      
      return {}
    } catch (error) {
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
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        return { error: error.message }
      }
      
      return {}
    } catch (error) {
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
      
      if (error) {
        return { error: error.message }
      }
      
      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  const updateProfile = async (updates: { email?: string; password?: string }) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.updateUser(updates)
      
      if (error) {
        return { error: error.message }
      }
      
      return {}
    } catch (error) {
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

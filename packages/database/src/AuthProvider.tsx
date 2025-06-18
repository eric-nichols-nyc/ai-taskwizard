// packages/supabase/src/AuthProvider.tsx
'use client'
import * as React from 'react'
import { createContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { type User, type Session } from '@supabase/supabase-js'
import { type AuthContextType } from './types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ 
    children, 
    isHost = false,
  }: { 
    children: React.ReactNode
    isHost?: boolean
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
      console.log('Auth state changed:', event, session?.user?.id)
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
        // Security: Only respond to messages from same origin or trusted origins
        if (
          process.env.NODE_ENV !== 'development' &&
          event.origin !== window.location.origin
        ) {
          return
        }

        if (event.data.type === 'REQUEST_AUTH_STATE') {
          console.log('Host: Received auth state request, responding with:', { user, session })
          // Respond with current auth state
          broadcastAuthState(user, session, undefined, event.source as Window)
        }
      }

      window.addEventListener('message', handleMessage)
      return () => {
        subscription.unsubscribe()
        window.removeEventListener('message', handleMessage)
      }
    }

    return () => subscription.unsubscribe()
  }, [isHost, supabase])


  // Helper function to broadcast auth state
  const broadcastAuthState = (
    user: User | null, 
    session: Session | null, 
    event?: string,
    targetWindow?: Window
  ) => {
    const message = {
      type: 'AUTH_STATE_CHANGE',
      user: user ? {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
        app_metadata: user.app_metadata,
        created_at: user.created_at,
        updated_at: user.updated_at,
        email_confirmed_at: user.email_confirmed_at,
        phone: user.phone,
        confirmed_at: user.confirmed_at,
        last_sign_in_at: user.last_sign_in_at,
        role: user.role,
        aud: user.aud
      } : null,
      session: session ? {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        expires_at: session.expires_at,
        token_type: session.token_type,
        user: session.user
      } : null,
      event,
      timestamp: Date.now()
    }
    
    console.log('Host: Broadcasting auth state:', message)
    
    if (targetWindow) {
      // Send to specific window
      targetWindow.postMessage(message, '*')
    } else {
      // Broadcast to all child frames/windows
      const iframes = document.querySelectorAll('iframe')
      iframes.forEach(iframe => {
        iframe.contentWindow?.postMessage(message, '*')
      })
      
      // Also post to current window for other listeners
      window.postMessage(message, '*')
      
      // Try to broadcast to all windows
      try {
        window.parent.postMessage(message, '*')
      } catch (e) {
        // Ignore errors for cross-origin frames
      }
    }
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

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithProvider,
    resetPassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }
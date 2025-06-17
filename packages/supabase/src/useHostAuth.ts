// packages/supabase/src/client/useHostAuth.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'

interface HostAuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

/**
 * Lightweight auth hook for child apps in Module Federation
 * Syncs with host auth state via postMessage
 */
export function useHostAuth(): HostAuthState {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  const requestAuthState = useCallback(() => {
    if (typeof window === 'undefined') return
    
    console.log('Child: Requesting auth state from host')
    
    // Try different ways to communicate with host
    try {
      // Method 1: Post to parent window
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'REQUEST_AUTH_STATE' }, '*')
      }
      
      // Method 2: Post to top window
      if (window.top && window.top !== window) {
        window.top.postMessage({ type: 'REQUEST_AUTH_STATE' }, '*')
      }
      
      // Method 3: Post to opener window
      if (window.opener) {
        window.opener.postMessage({ type: 'REQUEST_AUTH_STATE' }, '*')
      }
      
      // Method 4: Broadcast to all windows
      window.postMessage({ type: 'REQUEST_AUTH_STATE' }, '*')
      
    } catch (error) {
      console.warn('Child: Error requesting auth state:', error)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleMessage = (event: MessageEvent) => {
      console.log('Child: Received message:', event.data)
      
      if (event.data.type === 'AUTH_STATE_CHANGE' || event.data.type === 'AUTH_STATE_RESPONSE') {
        console.log('Child: Processing auth state update:', event.data)
        
        // Reconstruct user object if it exists
        const userData = event.data.user
        const sessionData = event.data.session
        
        if (userData) {
          const reconstructedUser: User = {
            id: userData.id,
            aud: userData.aud || 'authenticated',
            role: userData.role || 'authenticated',
            email: userData.email,
            email_confirmed_at: userData.email_confirmed_at,
            phone: userData.phone,
            confirmed_at: userData.confirmed_at,
            last_sign_in_at: userData.last_sign_in_at,
            app_metadata: userData.app_metadata || {},
            user_metadata: userData.user_metadata || {},
            identities: userData.identities || [],
            created_at: userData.created_at,
            updated_at: userData.updated_at,
            is_anonymous: userData.is_anonymous || false
          }
          setUser(reconstructedUser)
        } else {
          setUser(null)
        }
        
        if (sessionData) {
          const reconstructedSession: Session = {
            access_token: sessionData.access_token,
            refresh_token: sessionData.refresh_token,
            expires_in: sessionData.expires_in,
            expires_at: sessionData.expires_at,
            token_type: sessionData.token_type || 'bearer',
            user: sessionData.user
          }
          setSession(reconstructedSession)
        } else {
          setSession(null)
        }
        
        setLoading(false)
        setRetryCount(0) // Reset retry count on successful update
      }
    }

    // Listen for auth updates from host
    window.addEventListener('message', handleMessage)
    
    // Request current auth state from host immediately
    requestAuthState()
    
    // Set up retry mechanism for auth state request
    const retryTimeout = setTimeout(() => {
      if (loading && retryCount < 2) {
        console.log(`Child: Retrying auth state request (attempt ${retryCount + 1})`)
        setRetryCount(prev => prev + 1)
        requestAuthState()
      } else if (retryCount >= 2) {
        console.warn('Child: Max retry attempts reached, stopping retries')
        setLoading(false)
      }
    }, 1000 * (retryCount + 1)) // Exponential backoff

    return () => {
      window.removeEventListener('message', handleMessage)
      clearTimeout(retryTimeout)
    }
  }, [requestAuthState, loading, retryCount])

  // Fallback: Try to get auth state on mount and when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      if (loading) {
        requestAuthState()
      }
    }
    
    const handleVisibilityChange = () => {
      if (!document.hidden && loading) {
        requestAuthState()
      }
    }
    
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [loading, requestAuthState])

  return { user, session, loading }
}
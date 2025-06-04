'use client'

import { useState, useEffect } from 'react'
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
  
    useEffect(() => {
      if (typeof window === 'undefined') return
  
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'AUTH_STATE_CHANGE') {
          setUser(event.data.user)
          setSession(event.data.session)
          setLoading(false)
        }
        
        if (event.data.type === 'AUTH_STATE_RESPONSE') {
          setUser(event.data.user)
          setSession(event.data.session)
          setLoading(false)
        }
      }
  
      // Listen for auth updates from host
      window.addEventListener('message', handleMessage)
      
      // Request current auth state from host
      window.parent.postMessage({ type: 'REQUEST_AUTH_STATE' }, '*')
  
      return () => {
        window.removeEventListener('message', handleMessage)
      }
    }, [])
  
    return { user, session, loading }
  }
  
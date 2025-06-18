import { useState, useEffect, useRef } from 'react'

interface AuthState {
  user: any | null
  loading: boolean
}

export function useHostAuth(): AuthState {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const requestIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasReceivedInitialState = useRef(false)

  useEffect(() => {
    // Listen for auth updates from host
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'AUTH_STATE_CHANGE' || event.data.type === 'AUTH_STATE_RESPONSE') {
        console.log('Child app received auth state:', event.data)
        setUser(event.data.user)
        setLoading(false)
        hasReceivedInitialState.current = true
        
        // Clear the polling interval once we get a response
        if (requestIntervalRef.current) {
          clearInterval(requestIntervalRef.current)
          requestIntervalRef.current = null
        }
      }
    }

    // Only listen if we're in an iframe (deployed)
    if (window.parent !== window) {
      window.addEventListener('message', handleMessage)
      // Request current auth state from host immediately
      console.log('Child app requesting auth state from host')
      window.parent.postMessage({ type: 'REQUEST_AUTH_STATE' }, '*')
      // Keep requesting until we get a response (with timeout)
      let attempts = 0
      const maxAttempts = 30 // 15 seconds max
      requestIntervalRef.current = setInterval(() => {
        if (!hasReceivedInitialState.current && attempts < maxAttempts) {
          console.log('Child app retrying auth state request, attempt:', attempts + 1)
          window.parent.postMessage({ type: 'REQUEST_AUTH_STATE' }, '*')
          attempts++
        } else {
          // Stop trying after max attempts
          if (requestIntervalRef.current) {
            clearInterval(requestIntervalRef.current)
            requestIntervalRef.current = null
          }
          if (!hasReceivedInitialState.current) {
            console.warn('Child app failed to receive auth state after max attempts')
            setLoading(false) // Stop loading even if we didn't get auth state
          }
        }
      }, 500) // Try every 500ms
    } else {
      // In development, we're not in an iframe, so don't wait for messages
      console.log('Child app running in development mode')
      setLoading(false)
    }

    return () => {
      window.removeEventListener('message', handleMessage)
      if (requestIntervalRef.current) {
        clearInterval(requestIntervalRef.current)
      }
    }
  }, [])

  return { user, loading }
}
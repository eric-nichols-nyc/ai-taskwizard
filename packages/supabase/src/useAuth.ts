import { useContext } from 'react'
import { AuthContext } from './AuthProvider'
import { AuthContextType } from './types'

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
      // Return a mock context for localhost
      return {
        user: null,
        session: null,
        loading: false,
        signIn: async () => ({}),
        signUp: async () => ({}),
        signOut: async () => {},
        signInWithProvider: async () => ({}),
        resetPassword: async () => ({}),
        updateProfile: async () => ({})
      }
    }
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
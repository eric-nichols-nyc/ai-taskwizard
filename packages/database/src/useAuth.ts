import { useContext } from 'react'
import { AuthContext } from './AuthProvider'
import { type AuthContextType } from './types'
import { type User } from '@supabase/supabase-js'

function getSimplifiedUser(user: User | null) {
  if (!user) return null;
  const { id, email, user_metadata } = user;
  let firstname = '';

  if (user_metadata && typeof user_metadata === 'object') {
    if ('firstname' in user_metadata && typeof user_metadata.firstname === 'string') {
      firstname = user_metadata.firstname ?? '';
    } else if ('full_name' in user_metadata && typeof user_metadata.full_name === 'string') {
      firstname = user_metadata.full_name.split(' ')[0] ?? '';
    }
  }

  return { firstname: firstname ?? '', id, email: email ?? '' };
}

export function useAuth(): AuthContextType & { simpleUser: { firstname: string, id: string, email: string } | null } {
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
        updateProfile: async () => ({}),
        simpleUser: null
      }
    }
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  const simpleUser = getSimplifiedUser(context.user)
  
  return { ...context, simpleUser }
}
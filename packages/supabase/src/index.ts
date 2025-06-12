export { AuthProvider } from './AuthProvider'
export { useAuth } from './useAuth'
export { AuthGuard } from './AuthGuard'
export type { AuthContextType, AuthGuardProps } from './types'
import type { SupabaseClient } from '@supabase/supabase-js';

export interface AuthProviderProps {
  children: React.ReactNode;
  isHost?: boolean;
  supabase: SupabaseClient;
}

//export { default as SignIn } from './SignIn';
export { AuthProvider } from './AuthProvider'
export { useAuth } from './useAuth'
export { AuthGuard } from './AuthGuard'
export { SignIn } from './sign-in'
export type { AuthContextType, AuthGuardProps } from './types'
import type { SupabaseClient } from '@supabase/supabase-js';

export interface AuthProviderProps {
  children: React.ReactNode;
  isHost?: boolean;
  supabase: SupabaseClient;
}

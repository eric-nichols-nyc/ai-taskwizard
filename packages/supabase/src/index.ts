export { AuthProvider } from './AuthProvider'
export { useAuth } from './useAuth'
export { useHostAuth } from './useHostAuth'
export { AuthGuard } from './AuthGuard'
export { SignIn } from './sign-in'
export { CardSchema } from './schemas'
export { createSupabaseClient } from './supabaseClient'
export type { AuthContextType, AuthGuardProps } from './types'
import type { SupabaseClient } from '@supabase/supabase-js';

export interface AuthProviderProps {
  children: React.ReactNode;
  isHost?: boolean;
  supabase: SupabaseClient;
}

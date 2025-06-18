export { AuthProvider } from './AuthProvider'
export { useAuth } from './useAuth'
export { SignIn } from './sign-in'
export { CardSchema } from './schemas'
export type { AuthContextType, AuthGuardProps } from './types'
import type { SupabaseClient } from '@supabase/supabase-js';

export interface AuthProviderProps {
  children: React.ReactNode;
  isHost?: boolean;
  supabase: SupabaseClient;
}

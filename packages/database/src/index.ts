export { AuthProvider } from './AuthProvider'
export { useAuth } from './useAuth'
export { SignIn } from './sign-in'
export { signInWithEmail } from './signInWithEmail'
export { signInWithGoogle } from './signInWithGoogle'
export { CardSchema } from './schemas'
export { supabase } from './supabaseClient'
export { QueryProvider } from './QueryProvider'
export { createTaskService, type CreateTaskPayload } from './task-service'
export type { AuthContextType, AuthGuardProps, Task } from './types'
import type { SupabaseClient } from '@supabase/supabase-js';

export interface AuthProviderProps {
  children: React.ReactNode;
  isHost?: boolean;
  supabase: SupabaseClient;
}

import { createClient, SupabaseClient } from '@supabase/supabase-js'
export function createSupabaseClient(
  supabaseUrl: string,
  supabaseAnonKey: string
): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })
}

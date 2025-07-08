import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables validation
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  throw new Error('SUPABASE_URL environment variable is required');
}

if (!SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_ANON_KEY environment variable is required');
}

// Client-side Supabase client (with anon key)
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Server-side service client (with service role key)
export const createServiceClient = (): SupabaseClient => {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required for service client');
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// Database types - you can generate these with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID
export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          column_id: string;
          title: string;
          description: string | null;
          position: number;
          priority: 'Low' | 'Medium' | 'High' | null;
          due_date: string | null;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          column_id: string;
          title: string;
          description?: string | null;
          position: number;
          priority?: 'Low' | 'Medium' | 'High' | null;
          due_date?: string | null;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          column_id?: string;
          title?: string;
          description?: string | null;
          position?: number;
          priority?: 'Low' | 'Medium' | 'High' | null;
          due_date?: string | null;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Add other tables as needed
    };
  };
};
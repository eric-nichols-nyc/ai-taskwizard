import { type User, type Session } from '@supabase/supabase-js'

export interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, metadata?: { firstName?: string; lastName?: string }) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  signInWithProvider: (provider: 'google' | 'github') => Promise<{ error?: string }>
  resetPassword: (email: string) => Promise<{ error?: string }>
  updateProfile: (updates: { email?: string; password?: string }) => Promise<{ error?: string }>
}

export interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export interface KanbanBoardData {
  board: Board;
  columns: KanbanColumn[] | null;
  tasks: Task[] | null;
}


export interface Board {
  id: string;
  name: string;
  description?: string | null;
  user_id?: string | null;
  created_at?: string; // ISO timestamp
  updated_at?: string; // ISO timestamp
}

export interface KanbanColumn {
  id: string;
  board_id: string;
  name: string;
  position: number;
  color?: string | null;
  created_at?: string;
  tasks: Task[];
}


export interface Task {
  id: string; // UUID
  column_id: string; // UUID
  title: string;
  description?: string | null;
  position: number;
  status?: string | null;
  priority?: 'Low' | 'Medium' | 'High' | null;
  due_date?: string | null; // ISO date string
  user_id?: string | null;
  created_at?: string; // ISO timestamp
  updated_at?: string; // ISO timestamp
}


// Card type inferred from Zod schema (see schemas.ts)
// export type Card = z.infer<typeof CardSchema>;
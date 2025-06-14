import type { SupabaseClient } from '@supabase/supabase-js';
import type { Task } from './types';
import { TaskCreateSchema } from './schemas';

export interface TaskService {
  getTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | null>;
  createTask(data: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | null>;
  deleteTask(id: string): Promise<boolean>;
  createTaskWithDefaults(data: { title: string; [key: string]: any }): Promise<any>;
  // Add more methods as needed (e.g., getTasksByDate, getTasksByPriority)
}

export function createTaskService(supabase: SupabaseClient): TaskService {
  return {
    async getTasks() {
      const { data, error } = await supabase.from('tasks').select('*');
      if (error) throw error;
      return data as Task[];
    },

    async getTaskById(id) {
      const { data, error } = await supabase.from('tasks').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Task;
    },

    async createTask(taskData) {
      // Validate input using TaskCreateSchema
      const parseResult = TaskCreateSchema.safeParse(taskData);
      if (!parseResult.success) {
        throw parseResult.error;
      }
      const { data, error } = await supabase.from('tasks').insert([parseResult.data]).select().single();
      if (error) throw error;
      return data as Task;
    },

    async updateTask(id, updates) {
      const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as Task;
    },

    async deleteTask(id) {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      return true;
    },

    async createTaskWithDefaults({ title, ...rest }: { title: string; status?: string; priority?: 'Low' | 'Medium' | 'High'; due_date?: string }) {
      // 1. Get the 'Todo' column id
      const { data: columns, error: columnError } = await supabase
        .from('columns')
        .select('id')
        .eq('name', 'Todo')
        .single();
      if (columnError || !columns?.id) {
        throw new Error("Could not find 'Todo' column");
      }
      const column_id = columns.id;

      // 2. Get max position in this column
      const { data: tasksInColumn, error: tasksError } = await supabase
        .from('tasks')
        .select('position')
        .eq('column_id', column_id)
        .order('position', { ascending: false })
        .limit(1);
      if (tasksError) {
        throw new Error('Could not fetch tasks for position calculation');
      }
      const position = (tasksInColumn?.[0]?.position ?? 0) + 1;

      // 3. Get user_id from session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.id) {
        throw new Error('Could not get user from session');
      }
      const user_id = user.id;

      // 4. Set defaults
      const status = rest.status ?? 'todo';
      const priority = rest.priority ?? 'Medium';
      const due_date = rest.due_date ?? new Date().toISOString().split('T')[0];

      // 5. Construct task
      const task = {
        title,
        column_id,
        position,
        status,
        priority,
        due_date,
        user_id,
        ...rest,
      };

      // 6. Insert into DB
      const { data, error } = await supabase.from('tasks').insert([task]).select().single();
      if (error) {
        throw new Error(error.message || 'Failed to insert task');
      }
      return data;
    },
  };
}

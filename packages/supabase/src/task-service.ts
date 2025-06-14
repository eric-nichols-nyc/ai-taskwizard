import type { SupabaseClient } from '@supabase/supabase-js';
import type { Task } from './types';

export interface TaskService {
  getTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | null>;
  createTask(data: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | null>;
  deleteTask(id: string): Promise<boolean>;
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
      const { data, error } = await supabase.from('tasks').insert([taskData]).select().single();
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
  };
}

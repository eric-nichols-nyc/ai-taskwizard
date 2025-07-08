import { BaseService } from './base-service.js';
import {
  Task,
  CreateTask,
  UpdateTask,
  TaskQuery,
  TaskSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  TaskQuerySchema
} from '../schemas/task.js';
import type { ApiResponse } from '../schemas/common.js';

export class TaskService extends BaseService {
  /**
   * Create a new task
   */
  async createTask(data: CreateTask): Promise<Task> {
    try {
      // Validate input
      const validatedData = CreateTaskSchema.parse(data);

      const { data: task, error } = await this.supabase
        .from('tasks')
        .insert(validatedData)
        .select()
        .single();

      if (error) {
        this.handleError(error, 'Create task');
      }

      return TaskSchema.parse(task);
    } catch (error) {
      this.handleError(error, 'Create task');
    }
  }

  /**
   * Get task by ID
   */
  async getTaskById(id: string): Promise<Task | null> {
    try {
      const { data: task, error } = await this.supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Task not found
        }
        this.handleError(error, 'Get task');
      }

      return TaskSchema.parse(task);
    } catch (error) {
      this.handleError(error, 'Get task');
    }
  }

  /**
   * Get tasks with filtering, pagination, and sorting
   */
  async getTasks(query: Partial<TaskQuery> = {}): Promise<ApiResponse<Task[]>> {
    try {
      // Validate and set defaults for query parameters
      const validatedQuery = TaskQuerySchema.parse(query);
      const { page, limit, sort_by, sort_order, ...filters } = validatedQuery;

      // Build the query
      let supabaseQuery = this.supabase.from('tasks').select('*', { count: 'exact' });

      // Apply filters
      if (filters.column_id) {
        supabaseQuery = supabaseQuery.eq('column_id', filters.column_id);
      }
      if (filters.user_id) {
        supabaseQuery = supabaseQuery.eq('user_id', filters.user_id);
      }
      if (filters.priority) {
        supabaseQuery = supabaseQuery.eq('priority', filters.priority);
      }
      if (filters.search) {
        supabaseQuery = supabaseQuery.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      // Apply sorting
      supabaseQuery = supabaseQuery.order(sort_by, { ascending: sort_order === 'asc' });

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      supabaseQuery = supabaseQuery.range(from, to);

      const { data: tasks, error, count } = await supabaseQuery;

      if (error) {
        this.handleError(error, 'Get tasks');
      }

      const validatedTasks = tasks?.map(task => TaskSchema.parse(task)) || [];
      const pagination = this.calculatePagination(page, limit, count || 0);

      return {
        success: true,
        data: validatedTasks,
        pagination,
      };
    } catch (error) {
      this.handleError(error, 'Get tasks');
    }
  }

  /**
   * Update a task
   */
  async updateTask(id: string, data: UpdateTask): Promise<Task> {
    try {
      // Validate input
      const validatedData = UpdateTaskSchema.parse(data);

      const { data: task, error } = await this.supabase
        .from('tasks')
        .update({
          ...validatedData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.handleError(error, 'Update task');
      }

      return TaskSchema.parse(task);
    } catch (error) {
      this.handleError(error, 'Update task');
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        this.handleError(error, 'Delete task');
      }

      return true;
    } catch (error) {
      this.handleError(error, 'Delete task');
    }
  }

  /**
   * Bulk update task positions (for drag and drop)
   */
  async updateTaskPositions(updates: Array<{ id: string; position: number; column_id?: string }>): Promise<Task[]> {
    try {
      const updatedTasks: Task[] = [];

      for (const update of updates) {
        const validatedUpdate = UpdateTaskSchema.parse({
          position: update.position,
          ...(update.column_id && { column_id: update.column_id }),
        });

        const { data: task, error } = await this.supabase
          .from('tasks')
          .update({
            ...validatedUpdate,
            updated_at: new Date().toISOString(),
          })
          .eq('id', update.id)
          .select()
          .single();

        if (error) {
          this.handleError(error, 'Update task position');
        }

        updatedTasks.push(TaskSchema.parse(task));
      }

      return updatedTasks;
    } catch (error) {
      this.handleError(error, 'Update task positions');
    }
  }

  /**
   * Get tasks by column
   */
  async getTasksByColumn(columnId: string): Promise<Task[]> {
    try {
      const { data: tasks, error } = await this.supabase
        .from('tasks')
        .select('*')
        .eq('column_id', columnId)
        .order('position', { ascending: true });

      if (error) {
        this.handleError(error, 'Get tasks by column');
      }

      return tasks?.map(task => TaskSchema.parse(task)) || [];
    } catch (error) {
      this.handleError(error, 'Get tasks by column');
    }
  }
}

// Export singleton instance
export const taskService = new TaskService();
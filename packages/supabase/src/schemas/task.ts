import { z } from 'zod';

// Priority enum
export const PrioritySchema = z.enum(['Low', 'Medium', 'High']);

// Base task schema (matches your current Supabase structure)
export const TaskSchema = z.object({
  id: z.string().uuid().optional(),
  column_id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().nullable().optional(),
  position: z.number().int().min(0),
  priority: PrioritySchema.nullable().optional(),
  due_date: z.string().nullable().optional(), // ISO date string
  user_id: z.string().uuid().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Schema for creating a new task
export const CreateTaskSchema = TaskSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Schema for updating a task
export const UpdateTaskSchema = TaskSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Schema for task filters/queries
export const TaskQuerySchema = z.object({
  column_id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  priority: PrioritySchema.optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sort_by: z.enum(['created_at', 'updated_at', 'due_date', 'title', 'position']).default('position'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

// Type exports
export type Task = z.infer<typeof TaskSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
export type TaskQuery = z.infer<typeof TaskQuerySchema>;
export type Priority = z.infer<typeof PrioritySchema>;
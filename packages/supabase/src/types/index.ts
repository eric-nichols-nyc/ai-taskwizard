// Re-export all types from schemas for convenience
export type {
    Task,
    CreateTask,
    UpdateTask,
    TaskQuery,
    Priority,
  } from '../schemas/task.js';

  export type {
    User,
    CreateUser,
    UpdateUser,
    UserProfile,
  } from '../schemas/user.js';

  export type {
    Pagination,
    ApiResponse,
    ErrorResponse,
    Sort,
  } from '../schemas/common.js';

  export type {
    Database,
  } from '../clients/supabase.js';

  // Additional utility types
  export interface ServiceError {
    message: string;
    code?: string;
    details?: any;
  }

  export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }

  // Environment configuration types
  export interface DatabaseConfig {
    supabaseUrl: string;
    supabaseAnonKey: string;
    supabaseServiceRoleKey?: string;
    prismaUrl?: string;
  }
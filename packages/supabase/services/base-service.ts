import { SupabaseClient } from '@supabase/supabase-js';
import { createServiceClient } from '../clients/supabase.js';
import type { Database } from '../clients/supabase.js';

/**
 * Base service class that provides common functionality for all services
 */
export abstract class BaseService {
  protected supabase: SupabaseClient<Database>;

  constructor(supabaseClient?: SupabaseClient<Database>) {
    this.supabase = supabaseClient || createServiceClient();
  }

  /**
   * Handle Supabase errors and convert them to standardized format
   */
  protected handleError(error: any, operation: string): never {
    console.error(`${operation} failed:`, error);

    if (error?.code) {
      // Supabase specific errors
      switch (error.code) {
        case 'PGRST116':
          throw new Error('Record not found');
        case '23505':
          throw new Error('Record already exists');
        case '23503':
          throw new Error('Foreign key constraint violation');
        case '42501':
          throw new Error('Insufficient permissions');
        default:
          throw new Error(error.message || `${operation} failed`);
      }
    }

    throw new Error(error.message || `${operation} failed`);
  }

  /**
   * Calculate pagination metadata
   */
  protected calculatePagination(page: number, limit: number, totalCount: number) {
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      currentPage: page,
      totalPages,
      totalItems: totalCount,
      hasNext,
      hasPrev,
    };
  }
}
/**
 * Utility functions for database operations
 */

/**
 * Generate a slug from a string
 */
export function generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Validate UUID format
   */
  export function isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Format date to ISO string with timezone
   */
  export function formatDate(date: Date): string {
    return date.toISOString();
  }

  /**
   * Parse ISO date string to Date object
   */
  export function parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  /**
   * Check if a date is in the past
   */
  export function isPastDate(date: Date | string): boolean {
    const targetDate = typeof date === 'string' ? parseDate(date) : date;
    return targetDate < new Date();
  }

  /**
   * Calculate days between two dates
   */
  export function daysBetween(date1: Date | string, date2: Date | string): number {
    const d1 = typeof date1 === 'string' ? parseDate(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseDate(date2) : date2;
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Sanitize search query
   */
  export function sanitizeSearchQuery(query: string): string {
    return query
      .trim()
      .replace(/[<>\"'%;()&+]/g, '') // Remove potentially dangerous characters
      .substring(0, 100); // Limit length
  }

  /**
   * Generate random position for new items
   */
  export function generatePosition(): number {
    return Date.now();
  }



  /**
   * Retry async operation with exponential backoff
   */
  export async function retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          throw lastError;
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }
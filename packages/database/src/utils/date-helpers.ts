/**
 * Date utility functions for consistent date handling across the application
 */

/**
 * Convert a Date object to a YYYY-MM-DD string in local timezone
 * This avoids timezone conversion issues when working with date-only fields
 */
export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date as a YYYY-MM-DD string in local timezone
 */
export function getTodayString(): string {
  return toLocalDateString(new Date());
}

/**
 * Parse a YYYY-MM-DD string to a Date object
 * Assumes the date string is in local timezone
 */
export function parseLocalDate(dateString: string): Date {
  const parts = dateString.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Invalid date string format: ${dateString}. Expected YYYY-MM-DD`);
  }
  // At this point we know parts has exactly 3 valid numbers
  const year = parts[0]!;
  const month = parts[1]!;
  const day = parts[2]!;
  return new Date(year, month - 1, day);
}

/**
 * Check if two date strings represent the same date
 */
export function isSameDate(dateString1: string, dateString2: string): boolean {
  return dateString1 === dateString2;
}

/**
 * Get the start and end dates of a month as YYYY-MM-DD strings
 */
export function getMonthDateRange(year: number, month: number): {
  startDate: string;
  endDate: string;
} {
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  return {
    startDate: toLocalDateString(startOfMonth),
    endDate: toLocalDateString(endOfMonth)
  };
}
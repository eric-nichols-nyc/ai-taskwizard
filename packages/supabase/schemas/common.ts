import { z } from 'zod';

// Common pagination schema
export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

// Common response wrapper
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
    pagination: z.object({
      currentPage: z.number(),
      totalPages: z.number(),
      totalItems: z.number(),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    }).optional(),
  });

// Error response schema
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string().optional(),
  details: z.any().optional(),
});

// Common sort schema
export const SortSchema = z.object({
  sort_by: z.string(),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

// UUID validation
export const UUIDSchema = z.string().uuid();

// Type exports
export type Pagination = z.infer<typeof PaginationSchema>;
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type Sort = z.infer<typeof SortSchema>;
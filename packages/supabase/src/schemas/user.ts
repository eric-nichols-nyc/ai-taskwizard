import { z } from 'zod';

// Base user schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).optional(),
  avatar_url: z.string().url().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Schema for creating a user
export const CreateUserSchema = UserSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Schema for updating a user
export const UpdateUserSchema = UserSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// User profile schema (public info)
export const UserProfileSchema = UserSchema.omit({
  email: true,
});

// Type exports
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
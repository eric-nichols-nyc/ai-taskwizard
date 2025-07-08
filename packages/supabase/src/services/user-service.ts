import { BaseService } from './base-service.js';
import {
  User,
  CreateUser,
  UpdateUser,
  UserProfile,
  UserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  UserProfileSchema
} from '../schemas/user.js';

export class UserService extends BaseService {
  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      const { data: user, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // User not found
        }
        this.handleError(error, 'Get user');
      }

      return UserSchema.parse(user);
    } catch (error) {
      this.handleError(error, 'Get user');
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const { data: user, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // User not found
        }
        this.handleError(error, 'Get user by email');
      }

      return UserSchema.parse(user);
    } catch (error) {
      this.handleError(error, 'Get user by email');
    }
  }

  /**
   * Create a new user
   */
  async createUser(data: CreateUser): Promise<User> {
    try {
      // Validate input
      const validatedData = CreateUserSchema.parse(data);

      const { data: user, error } = await this.supabase
        .from('users')
        .insert(validatedData)
        .select()
        .single();

      if (error) {
        this.handleError(error, 'Create user');
      }

      return UserSchema.parse(user);
    } catch (error) {
      this.handleError(error, 'Create user');
    }
  }

  /**
   * Update a user
   */
  async updateUser(id: string, data: UpdateUser): Promise<User> {
    try {
      // Validate input
      const validatedData = UpdateUserSchema.parse(data);

      const { data: user, error } = await this.supabase
        .from('users')
        .update({
          ...validatedData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.handleError(error, 'Update user');
      }

      return UserSchema.parse(user);
    } catch (error) {
      this.handleError(error, 'Update user');
    }
  }

  /**
   * Get user profile (public information)
   */
  async getUserProfile(id: string): Promise<UserProfile | null> {
    try {
      const { data: user, error } = await this.supabase
        .from('users')
        .select('id, name, avatar_url, created_at, updated_at')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // User not found
        }
        this.handleError(error, 'Get user profile');
      }

      return UserProfileSchema.parse(user);
    } catch (error) {
      this.handleError(error, 'Get user profile');
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        this.handleError(error, 'Delete user');
      }

      return true;
    } catch (error) {
      this.handleError(error, 'Delete user');
    }
  }
}

// Export singleton instance
export const userService = new UserService();
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createTaskService,
  useAuth, // Import from the correct package
  type Task,
  type CreateTaskPayload,
} from '@turbo-with-tailwind-v4/database';

// Initialize the task service
const taskService = createTaskService();

// Define query keys for caching and invalidation
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (userId: string | undefined) => [...taskKeys.lists(), { userId }] as const,
};

/**
 * Hook to fetch tasks for the current user.
 */
export function useGetTasks() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: taskKeys.list(userId),
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return taskService.getTasksByUserId(userId);
    },
    enabled: !!userId,
  });
}

/**
 * Hook to add a new task.
 */
export function useAddTask() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (newTask: CreateTaskPayload) => {
        return taskService.createTaskWithDefaults(newTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list(user?.id) });
    },
  });
}

/**
 * Hook to update an existing task.
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      taskService.updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list(user?.id) });
    },
  });
}

/**
 * Hook to delete a task.
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list(user?.id) });
    },
  });
} 
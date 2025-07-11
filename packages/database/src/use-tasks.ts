import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createTaskService,
  useAuth, // Import from the correct package
  type CreateTaskPayload,
} from '@turbo-with-tailwind-v4/database';
import { type KanbanBoardData, type Task } from './types';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';

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
export function useGetTasks(): UseQueryResult<Task[], Error> {
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
export function useAddTask(): UseMutationResult<Task, Error, CreateTaskPayload> {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (newTask: CreateTaskPayload) => {
        return taskService.createTaskWithDefaults(newTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list(user?.id) }); // updates the dashboard task list
      queryClient.invalidateQueries({ queryKey: ['kanban', { userId: user?.id }] }); // updates the Kanban board
    },
  });
}

export function useAddDefaultTask() {
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

export function useAddKanbanTask() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
      mutationFn: (newTask: Partial<Task> & { title: string; column_id: string; status: string; description?: string; position: number }) => {
          return taskService.createTask({
            ...newTask,
            user_id: user?.id ?? '',
          });
        },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list(user?.id) });
      queryClient.invalidateQueries({ queryKey: ['kanban'] });
    },
    onError: (error) => {
      console.error('Error adding kanban task:', error);
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

export function useKanbanBoard(boardId: string | undefined) {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: ['kanban', { boardId, userId }],
    queryFn: () => {
      if (!boardId || !userId) throw new Error('Missing boardId or userId');
      return taskService.getKanbanBoard(boardId, userId);
    },
    enabled: !!boardId && !!userId,
  });
}
// returns the default board columns and tasks for the user
export function useDefaultKanban(): UseQueryResult<KanbanBoardData | null, Error> {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: ['kanban', { userId }],
    queryFn: () => {
      if (!userId) throw new Error('No userId');
      return taskService.getUserDefaultBoard(userId);
    },
    enabled: !!userId,
  });

}
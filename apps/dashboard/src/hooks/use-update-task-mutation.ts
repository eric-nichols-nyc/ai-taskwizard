import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTaskService } from '@turbo-with-tailwind-v4/supabase/task-service'
import { supabase } from '../supabaseClient'
import type { Task } from '@turbo-with-tailwind-v4/supabase/types'

const taskService = createTaskService(supabase)

type UpdateTaskArgs = {
  id: string;
  updates: Partial<Task>;
}

function mapPriority(updates: Partial<Task>): Partial<Task> {
  if (updates.priority) {
    // Map 'low'|'medium'|'high' to 'Low'|'Medium'|'High'
    return {
      ...updates
    }
  }
  return updates;
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: UpdateTaskArgs) => taskService.updateTask(id, mapPriority(updates)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
} 
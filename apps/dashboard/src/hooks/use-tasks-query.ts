import { useQuery } from '@tanstack/react-query'
import { createTaskService } from '@turbo-with-tailwind-v4/supabase/task-service'
import { supabase } from '../supabaseClient'

const taskService = createTaskService(supabase)

export function useTasksQuery() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskService.getTasks(),
  })
}

import {useState, useEffect} from "react";
import { useDefaultKanban, useAddTask, useUpdateTask } from "@turbo-with-tailwind-v4/database/use-tasks";
import {  KanbanBoardData, Task } from "@turbo-with-tailwind-v4/database/types";

// Accept kanbanData as an argument
export function useKanbanBoardState() {
  const { data, isLoading, error } = useDefaultKanban();
  const addTaskMutation = useAddTask();
  const updateTaskMutation = useUpdateTask();
  const [kanbanBoard, setKanbanBoard] = useState<KanbanBoardData | null>(null);

  useEffect(() => {
    if (data) {
      setKanbanBoard(data);
    }
  }, [data]);

  const addTask = (task: Task, onSuccess?: () => void) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {id, ...rest} = task;
    addTaskMutation.mutate(rest, {
      onSuccess: () => {
        setKanbanBoard(prev => prev ? { ...prev, tasks: [...(prev.tasks ?? []), task] } : prev);
        if (onSuccess) {
          onSuccess();
        }
      },
      onError: (error) => {
        console.error('Error adding task:', error);
      }
    });
  };

  const updateTask = (task: Task, onSuccess?: () => void) => {
    updateTaskMutation.mutate({id: task.id, updates: task}, {
      onSuccess: () => {
        setKanbanBoard(prev => prev ? { ...prev, tasks: [...(prev.tasks ?? []), task] } : prev);
        if (onSuccess) {
          onSuccess();
        }
      }
    });
  };

  return {
    board: kanbanBoard?.board ?? null,
    columns: kanbanBoard?.columns ?? [],
    tasks: kanbanBoard?.tasks ?? [],
    isLoading,
    error,
    addTaskMutation,
    updateTaskMutation,
    addTask,
    updateTask,
  };
}
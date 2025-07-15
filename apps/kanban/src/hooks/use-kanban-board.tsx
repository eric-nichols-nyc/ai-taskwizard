import {useState, useEffect} from "react";
import { useAddTask, useUpdateTask } from "@turbo-with-tailwind-v4/database/use-tasks";
import {  KanbanBoardData, Task } from "@turbo-with-tailwind-v4/database/types";

// Accept kanbanData as an argument
export function useKanbanBoardState(kanbanData: KanbanBoardData | null) {
  const addTaskMutation = useAddTask();
  const updateTaskMutation = useUpdateTask();
  const [kanbanBoard, setKanbanBoard] = useState<KanbanBoardData | null>(null);

  useEffect(() => {
    if (kanbanData) {
      setKanbanBoard(kanbanData);
    }
  }, [kanbanData]);

  const addTask = (task: Task) => {
    addTaskMutation.mutate(task, {
      onSuccess: () => {
        setKanbanBoard(prev => prev ? { ...prev, tasks: [...prev.tasks, task] } : prev);
      },
      onError: (error) => {
        console.error('Error adding task:', error);
      }
    });
  };

  return {
    board: kanbanBoard?.board ?? null,
    columns: kanbanBoard?.columns ?? [],
    tasks: kanbanBoard?.tasks ?? [],
    addTaskMutation,
    updateTaskMutation,
    addTask,
  };
}
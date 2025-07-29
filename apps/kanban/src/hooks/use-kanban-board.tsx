import {useState, useEffect} from "react";
import { useDefaultKanban, useAddTask, useUpdateTask } from "@turbo-with-tailwind-v4/database/use-tasks";
import {  KanbanBoardData, Task } from "@turbo-with-tailwind-v4/database/types";
import { KanbanPositionCalculator } from "../lib/kanban-position-calculator";

// Accept kanbanData as an argument
export function useKanbanBoardState() {
  const { data, isLoading, error } = useDefaultKanban();
  const addTaskMutation = useAddTask();
  const updateTaskMutation = useUpdateTask();
  const [kanbanBoard, setKanbanBoard] = useState<KanbanBoardData | null>(null);

  useEffect(() => {
    if (data) {
        console.log('useKanbanBoardState - data', data);
      setKanbanBoard(data);
    }
  }, [data]);

  // get the column name from the column id and return a status of done, todo or in-progress
  const getColumnStatus = (columnId: string) => {
    const column = kanbanBoard?.columns?.find(c => c.id === columnId);
    if(column) {
      return column.name.toLowerCase().replace(/ /g, '_');// return the colum name to loweer case and replace spaces with underscores
    }
    return 'todo';
  }
  const addTask = (task: Task, onSuccess?: () => void) => {
    // get the position of the new task
    const position = KanbanPositionCalculator.calculatePosition({
      tasks: kanbanBoard?.tasks ?? [],
      taskId: task.id,
      targetColumnId: task.column_id,
      dropPosition: 'last',
      targetTaskId: undefined,
    });
    const {id, ...rest} = task;
    console.log('removed id', id);
    const newTask = {
      ...rest,
      position: position.newPosition,
      status: getColumnStatus(task.column_id),
    }


  // send the new task to the server
    addTaskMutation.mutate(newTask, {
      onSuccess: (createdTask) => {
        console.log('Task created successfully:', createdTask);
        setKanbanBoard(prev => prev ? {
          ...prev,
          tasks: [...(prev.tasks ?? []), createdTask]
        } : prev);
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
        setKanbanBoard(prev => prev ? {
          ...prev,
          tasks: prev.tasks?.map(t => t.id === task.id ? task : t) ?? []
        } : prev);
        if (onSuccess) {
          onSuccess();
        }
      }
    });
  };

  const deleteTask = (taskId: string, onSuccess?: () => void) => {
    console.log('deleteTask', taskId);
    if(onSuccess) {
        onSuccess();
    }
  }

  const moveTask = (
    taskId: string,
    newColumnId: string,
    targetPosition: 'first' | 'last' | 'before' | 'after',
    targetTaskId?: string,
    onSuccess?: () => void) => {
        console.log('moveTask', taskId, newColumnId, targetPosition, targetTaskId);
        const result = KanbanPositionCalculator.calculatePosition({
            tasks: kanbanBoard?.tasks ?? [],
            taskId,
            targetColumnId: newColumnId,
            dropPosition: targetPosition,
            targetTaskId: targetTaskId,
        });

        console.log('moveTask result', result);

        const updatedTask = result.updatedTasks.find(t => t.id === taskId);
        if(updatedTask) {
          // get the status of the task
          const status = getColumnStatus(newColumnId);
          updatedTask.status = status;
          updateTask(updatedTask);
        }

        // Update the local state with the new task positions
        // if (kanbanBoard && result) {
        //   setKanbanBoard({
        //     ...kanbanBoard,
        //     tasks: result.updatedTasks,
        //   });
        // }

        if(onSuccess) {
            onSuccess();
        }
        return result;
  }

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
    deleteTask,
    moveTask,
  };
}
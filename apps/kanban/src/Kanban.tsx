import React, { useState } from "react";
import { SpinLoader } from "@turbo-with-tailwind-v4/design-system/components/spin-loader";
import { useKanbanBoardState } from "./hooks/use-kanban-board";
import { KanbanBoard } from "./components/kanban/KanbanBoard";

export const Kanban = () => {
  const { board, columns, tasks, isLoading, error, moveTask } = useKanbanBoardState();
  const [localTasks, setLocalTasks] = useState(tasks);

  console.log('Kanban - board', board);
  console.log('Kanban - columns', columns);
  console.log('Kanban - tasks', tasks);
  console.log('Kanban - isLoading', isLoading);
  console.log('Kanban - error', error);

  // Update local tasks when tasks change from the hook
  React.useEffect(() => {
    console.log('Kanban - useEffect: tasks changed, updating localTasks');
    console.log('Kanban - useEffect: old localTasks', localTasks);
    console.log('Kanban - useEffect: new tasks', tasks);
    setLocalTasks(tasks);
  }, [tasks]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-screen max-w-screen-xl mx-auto overflow-y-auto p-6 flex flex-col items-center justify-center">
        <div className="flex items-center space-x-2">
          <SpinLoader />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-screen max-w-screen-xl mx-auto overflow-y-auto p-6 flex flex-col items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 text-red-600">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800">Error Loading Board</h3>
          </div>
          <p className="text-red-700">{error.message || 'Something went wrong while loading the board.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Don't render if no board data
  if (!board) {
    return (
      <div className="h-screen max-w-screen-xl mx-auto overflow-y-auto p-6 flex flex-col items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-yellow-800">No Board Found</h3>
          <p className="text-yellow-700">No board data available.</p>
        </div>
      </div>
    );
  }

  // Prepare data for the kanban board
  const kanbanData = {
    board: board,
    columns: columns,
    tasks: localTasks,
  };

  // Handle task movement
  const handleTaskMove = (taskId: string, newColumnId: string, newPosition: number) => {
    console.log('Kanban - handleTaskMove called with:', { taskId, newColumnId, newPosition });
    console.log('Kanban - handleTaskMove - current localTasks:', localTasks);

    // Update local state immediately for optimistic UI
    const updatedTasks = localTasks.map(task =>
      task.id === taskId
        ? { ...task, column_id: newColumnId, position: newPosition }
        : task
    );

    console.log('Kanban - handleTaskMove - updatedTasks:', updatedTasks);
    setLocalTasks(updatedTasks);

    // Call the moveTask function from the hook
    moveTask(taskId, newColumnId, () => {
      console.log('Kanban - moveTask callback: Task moved successfully');
    });
  };

  // Show the board (success state)
  return (
    <KanbanBoard
      data={kanbanData}
      onTaskMove={handleTaskMove}
    />
  );
};
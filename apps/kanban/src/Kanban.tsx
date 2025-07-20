// import { useState, useEffect } from "react";
import { SpinLoader } from "@turbo-with-tailwind-v4/design-system/components/spin-loader";
import { useKanbanBoardState } from "./hooks/use-kanban-board";

export const Kanban = () => {
  const { columns, tasks, isLoading, error } = useKanbanBoardState();
  console.log('Kanban - columns', columns);
  console.log('Kanban - tasks', tasks);
  console.log('Kanban - isLoading', isLoading);
  console.log('Kanban - error', error);

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

  // Show the board (success state)
  return <>I am the Kanban board</>;
};
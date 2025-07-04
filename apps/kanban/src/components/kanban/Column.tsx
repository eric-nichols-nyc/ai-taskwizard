import React from "react";

export type ColumnProps = {
  title: string;
  children?: React.ReactNode;
  // Add more props as needed (e.g., columnId, onAddTask, etc.)
};

export function Column({ title, children }: ColumnProps) {
  return (
    <div
      className="bg-white border border-blue-200 shadow-sm rounded-lg p-4 min-w-80 max-w-80 transition-colors hover:border-blue-400 hover:shadow-md"
    >
      <header className="mb-2 flex items-center justify-between">
        <h2 className="font-semibold text-blue-900 mb-3 text-lg">{title}</h2>
        {/* Add task count or actions here if needed */}
      </header>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {children}
      </div>
      {/* Add 'Add Task' button or footer here if needed */}
    </div>
  );
} 
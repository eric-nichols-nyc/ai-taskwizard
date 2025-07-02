import React from "react";

export type ColumnProps = {
  title: string;
  children?: React.ReactNode;
  // Add more props as needed (e.g., columnId, onAddTask, etc.)
};

export function Column({ title, children }: ColumnProps) {
  return (
    <div className="flex flex-col w-80 min-h-[50vh] bg-white rounded-lg shadow p-4">
      <header className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {/* Add task count or actions here if needed */}
      </header>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {children}
      </div>
      {/* Add 'Add Task' button or footer here if needed */}
    </div>
  );
} 
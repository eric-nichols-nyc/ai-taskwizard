import React from "react";

export type TaskCardProps = {
  title: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  // Add more props as needed (e.g., onEdit, onDelete, etc.)
};

export function TaskCard({ title, dueDate, priority }: TaskCardProps) {
  return (
    <div className="bg-black rounded-md shadow p-3 flex flex-col gap-1 hover:bg-gray-200 transition-colors">
      <div className="flex items-center justify-between">
        <span className="font-medium text-base">{title}</span>
        {priority && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            priority === "high"
              ? "bg-red-200 text-red-800"
              : priority === "medium"
              ? "bg-yellow-200 text-yellow-800"
              : "bg-green-200 text-green-800"
          }`}>
            {priority}
          </span>
        )}
      </div>
      {dueDate && (
        <div className="text-xs text-gray-500">Due: {dueDate}</div>
      )}
    </div>
  );
} 
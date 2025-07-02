import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type TaskCardProps = {
  id: string;
  title: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  // Add more props as needed (e.g., onEdit, onDelete, etc.)
};

export function TaskCard({ id, title, dueDate, priority }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-blue-50 border border-blue-200 shadow-sm rounded-md p-3 mb-2 transition-colors hover:bg-blue-100 hover:border-blue-400 text-blue-900"
    >
      <div className="font-medium text-sm mb-1">{title}</div>
      {dueDate && <div className="text-xs text-blue-700">Due: {dueDate}</div>}
      {priority && <div className="text-xs text-blue-700">Priority: {priority}</div>}
    </div>
  );
} 
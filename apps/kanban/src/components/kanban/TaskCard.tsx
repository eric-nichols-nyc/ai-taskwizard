import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@turbo-with-tailwind-v4/database";

export function TaskCard({ id, title, due_date, priority, position }: Task) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: 'Task',
      task: { id, title, due_date, priority, position },
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-70 overflow-hidden bg-blue-50 border border-blue-200 shadow-sm rounded-md p-3 mb-2 transition-colors hover:bg-blue-100 hover:border-blue-400 text-blue-900 cursor-grab"
    >
      <div className="font-medium text-sm mb-1">{title}</div>
      {due_date && <div className="text-xs text-blue-700">Due: {due_date}</div>}
      {priority && <div className="text-xs text-blue-700">Priority: {priority}</div>}
      <div className="text-xs text-blue-700">Position: {position}</div>
    </div>
  );
}
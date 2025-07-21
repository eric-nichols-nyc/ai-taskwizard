import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { Task } from '@turbo-with-tailwind-v4/database/types';

export const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-grab hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>

      <p className="text-sm text-gray-600">{task.description}</p>
      {import.meta.env.MODE === 'development' && <p className="text-xs text-gray-600">Position: {task.position}</p>}
    </div>
  );
};
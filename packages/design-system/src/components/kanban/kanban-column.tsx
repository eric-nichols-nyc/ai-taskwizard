import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Card } from '../ui/card';
import { KanbanTask } from './kanban-task';
import type { KanbanColumnProps, KanbanTask as KanbanTaskType } from '../../types/kanban';

export const KanbanColumn = ({
  column,
  tasks,
  onTaskAdd,
  onTaskUpdate,
  onTaskDelete,
  className = '',
  taskRenderer,
  headerRenderer,
}: KanbanColumnProps) => {
  const [showAddTask, setShowAddTask] = useState(false);

  // Make column a droppable area for tasks (attached to main Card)
  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  // Only useSortable for the column header (for column reordering)
  const {
    attributes,
    listeners,
    setNodeRef: setSortableNodeRef,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const style = {
    transition,
  };

  return (
    <Card
      ref={setDroppableNodeRef}
      style={style}
      className={`rounded-lg p-4 min-w-80 max-w-80 h-[600px] flex flex-col border-2 border-dashed border-red-900 ${isDragging ? 'opacity-50' : ''} ${className}`}
    >
      {/* Fixed Header - Only this part is sortable for column reordering */}
      <div
        className="flex items-center justify-between mb-4 cursor-grab flex-shrink-0"
        ref={setSortableNodeRef}
        {...attributes}
        {...listeners}
      >
        <div className="cursor-grab">
          <h3 className="font-semibold text-gray-900">{column.title}</h3>
          {column.description && (
            <p className="text-sm text-gray-600">{column.description}</p>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowAddTask(true)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable Tasks Area */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            taskRenderer ? (
              <div key={task.id}>{taskRenderer(task)}</div>
            ) : (
              <KanbanTask
                key={task.id}
                task={task}
                onUpdate={(updates) => onTaskUpdate?.(task.id, updates)}
                onDelete={() => onTaskDelete?.(task.id)}
              />
            )
          ))}
        </SortableContext>
      </div>

      {/* Fixed Add Button */}
      <div className="flex-shrink-0">
        {showAddTask ? (
          <div className="p-2 border rounded-lg">
            <input
              type="text"
              placeholder="Enter task title..."
              className="w-full p-2 border rounded"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const target = e.target as HTMLInputElement;
                  onTaskAdd?.({
                    title: target.value,
                    column_id: column.id,
                    status: column.id,
                  });
                  target.value = '';
                  setShowAddTask(false);
                }
              }}
              autoFocus
            />
          </div>
        ) : (
          <button
            onClick={() => setShowAddTask(true)}
            className="w-full p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add a card
          </button>
        )}
      </div>
    </Card>
  );
};
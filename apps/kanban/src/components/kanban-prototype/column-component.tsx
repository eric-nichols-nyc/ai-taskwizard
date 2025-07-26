import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, MoreHorizontal } from 'lucide-react';
import { TaskCard } from './task-card';
import { AddTaskForm } from './add-task-form';
import { Column, Task } from '@turbo-with-tailwind-v4/database/types';
import { Card } from '@turbo-with-tailwind-v4/design-system/components/ui/card';

export const ColumnComponent: React.FC<{ column: Column, tasks: Task[], addTask: (task: Partial<Task>) => void }> = ({ column, tasks, addTask }) => {
  const [showAddTask, setShowAddTask] = useState(false);
  //const allTasks = useKanbanStore(state => state.tasks);

  // Make column a droppable area for tasks
  const { setNodeRef: setDroppableNodeRef } = useDroppable({ id: column.id });

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
      className={`rounded-lg p-4 min-w-80 max-w-80 h-[600px] flex flex-col ${isDragging ? 'opacity-50' : ''}`}
    >
      {/* Fixed Header */}
      <div
        className="flex items-center justify-between mb-4 cursor-grab flex-shrink-0"
        ref={setSortableNodeRef}
        {...attributes}
        {...listeners}
      >
        <div className="cursor-grab">
          <h3 className="font-semibold text-gray-200">{column.name}</h3>
          {
            import.meta.env.MODE === 'development' && <p className="text-xs text-gray-200">ID: {column.id}</p>
          }
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
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>

      {/* Fixed Add Button */}
      <div className="flex-shrink-0">
        {showAddTask ? (
          <AddTaskForm columnId={column.id} onClose={() => setShowAddTask(false)} addTask={addTask} />
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
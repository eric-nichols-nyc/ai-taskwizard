import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanTask } from './kanban-task';
import type { KanbanTask as KanbanTaskType, KanbanColumn as KanbanColumnType } from '../../types/kanban';

export interface KanbanBoardProps {
  children: React.ReactNode;
  tasks: KanbanTaskType[];
  onTaskAdd?: (task: Partial<KanbanTaskType>) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<KanbanTaskType>) => void;
  onTaskDelete?: (taskId: string) => void;
  onColumnUpdate?: (columnId: string, updates: Partial<KanbanColumnType>) => void;
  className?: string;
  taskRenderer?: (task: KanbanTaskType) => React.ReactNode;
}

export const KanbanBoard = ({
  children,
  tasks,
  onTaskAdd,
  onTaskUpdate,
  onTaskDelete,
  onColumnUpdate,
  className = '',
  taskRenderer,
}: KanbanBoardProps) => {
  const [activeTask, setActiveTask] = React.useState<KanbanTaskType | null>(null);
  const [activeColumn, setActiveColumn] = React.useState<KanbanColumnType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.type === 'Task') {
      setActiveTask(activeData.task);
    } else if (activeData?.type === 'Column') {
      setActiveColumn(activeData.column);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle task dropping
    if (activeData?.type === 'Task' && overData?.type === 'Column') {
      const task = activeData.task;
      const newColumnId = overId as string;

      if (task.column_id !== newColumnId) {
        onTaskUpdate?.(task.id, { column_id: newColumnId });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      setActiveColumn(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) {
      setActiveTask(null);
      setActiveColumn(null);
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle task reordering within same column
    if (activeData?.type === 'Task' && overData?.type === 'Task') {
      const activeTask = activeData.task;
      const overTask = overData.task;

      if (activeTask.column_id === overTask.column_id) {
        // Reorder within same column
        const activeIndex = tasks.findIndex(t => t.id === activeTask.id);
        const overIndex = tasks.findIndex(t => t.id === overTask.id);

        if (activeIndex !== -1 && overIndex !== -1) {
          const newTasks = [...tasks];
          const [removed] = newTasks.splice(activeIndex, 1);
          if (removed) {
            newTasks.splice(overIndex, 0, removed);

            // Update positions
            newTasks.forEach((task, index) => {
              onTaskUpdate?.(task.id, { position: index });
            });
          }
        }
      }
    }

    // Handle column reordering
    if (activeData?.type === 'Column' && overData?.type === 'Column') {
      const activeColumn = activeData.column;
      const overColumn = overData.column;

      // For column reordering, we'll need to get columns from children
      // This is a simplified approach - in a real implementation you might want
      // to pass columns as a separate prop or use React.Children to extract column data
      onColumnUpdate?.(activeColumn.id, { position: 0 }); // Placeholder
    }

    setActiveTask(null);
    setActiveColumn(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={`flex gap-4 overflow-x-auto p-4 ${className}`}>
        <SortableContext items={React.Children.map(children, (child, index) => index) || []} strategy={horizontalListSortingStrategy}>
          {children}
        </SortableContext>
      </div>

      <DragOverlay>
        {activeTask && (
          <KanbanTask task={activeTask}>
            <div>
              <h4 className="font-medium text-sm mb-1">{activeTask.title}</h4>
              {activeTask.description && (
                <p className="text-xs text-gray-600">{activeTask.description}</p>
              )}
            </div>
          </KanbanTask>
        )}
        {activeColumn && (
          <div className="bg-white border rounded-lg p-4 min-w-80 max-w-80 h-[600px] opacity-50">
            <h3 className="font-semibold text-gray-900">{activeColumn.title}</h3>
            {activeColumn.description && (
              <p className="text-sm text-gray-600">{activeColumn.description}</p>
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
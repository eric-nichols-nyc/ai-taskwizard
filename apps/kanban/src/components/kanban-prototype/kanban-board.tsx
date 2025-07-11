import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useKanbanStore } from './kanban-state';
import { TaskCard } from './task-card';
import { ColumnComponent } from './column-component';

export const KanbanBoard = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const {
    columns,
    tasks,
    activeBoard,
    updateColumnPositions,
    updateTaskPositions,
  } = useKanbanStore();

  // Debug: Log all column and task IDs
  console.log('[Kanban Render] Column IDs:', columns.map(c => c.id));
  console.log('[Kanban Render] Task IDs:', tasks.map(t => t.id));

  const activeColumns = columns
    .filter(col => col.board_id === activeBoard)
    .sort((a, b) => a.position - b.position);

  // Debug: Log items passed to SortableContext for columns
  console.log('[Kanban Render] SortableContext (columns) items:', activeColumns.map(c => c.id));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    console.log('[DragStart]', { activeId: event.active.id });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;
    if (!activeData || !overData) return;

    // Dragging a task
    if (activeData.type === 'Task') {
      // Dropped over a task
      if (overData.type === 'Task') {
        const activeTask = activeData.task;
        const overTask = overData.task;
        if (activeTask.id === overTask.id) return;
        // If moving to a different column
        if (activeTask.column_id !== overTask.column_id) {
          const newTasks = tasks.map(task => {
            if (task.id === activeTask.id) {
              return { ...task, column_id: overTask.column_id };
            }
            return task;
          });
          updateTaskPositions(newTasks);
        }
      }
      // Dropped over a column
      if (overData.type === 'Column') {
        const activeTask = activeData.task;
        const overColumn = overData.column;
        if (activeTask.column_id !== overColumn.id) {
          const newTasks = tasks.map(task => {
            if (task.id === activeTask.id) {
              return { ...task, column_id: overColumn.id };
            }
            return task;
          });
          updateTaskPositions(newTasks);
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;
    if (!activeData || !overData) return;

    // Column reordering
    if (activeData.type === 'Column' && overData.type === 'Column') {
      if (active.id === over.id) return;
      const oldIndex = activeColumns.findIndex(c => c.id === active.id);
      const newIndex = activeColumns.findIndex(c => c.id === over.id);
      const newColumns = arrayMove(activeColumns, oldIndex, newIndex).map((col, index) => ({
        ...col,
        position: index,
      }));
      const updatedColumns = columns.map(col => {
        const newCol = newColumns.find(nc => nc.id === col.id);
        return newCol || col;
      });
      updateColumnPositions(updatedColumns);
      return;
    }

    // Task reordering or moving between columns
    if (activeData.type === 'Task') {
      const activeTask = activeData.task;
      // Dropped on a task
      if (overData.type === 'Task') {
        const overTask = overData.task;
        if (activeTask.id === overTask.id) return;
        const columnTasks = tasks.filter(t => t.column_id === overTask.column_id);
        const oldIndex = columnTasks.findIndex(t => t.id === activeTask.id);
        const newIndex = columnTasks.findIndex(t => t.id === overTask.id);
        let reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex).map((task, index) => ({
          ...task,
          position: index,
        }));
        // If moving to a new column, update column_id
        if (activeTask.column_id !== overTask.column_id) {
          reorderedTasks = reorderedTasks.map(task =>
            task.id === activeTask.id ? { ...task, column_id: overTask.column_id } : task
          );
        }
        const updatedTasks = [
          ...tasks.filter(task => task.column_id !== overTask.column_id),
          ...reorderedTasks,
        ];
        updateTaskPositions(updatedTasks);
        return;
      }
      // Dropped on a column
      if (overData.type === 'Column') {
        const overColumn = overData.column;
        if (activeTask.column_id !== overColumn.id) {
          const destColumnTasks = tasks
            .filter(t => t.column_id === overColumn.id)
            .sort((a, b) => a.position - b.position);
          const updatedActiveTask = {
            ...activeTask,
            column_id: overColumn.id,
            position: destColumnTasks.length,
          };
          const newTasks = tasks
            .filter(t => t.id !== activeTask.id)
            .concat(updatedActiveTask)
            .map(task => {
              // Re-index positions in both columns
              if (task.column_id === activeTask.column_id && task.id !== activeTask.id) {
                // Old column: re-index
                return {
                  ...task,
                  position: tasks
                    .filter(t => t.column_id === activeTask.column_id && t.id !== activeTask.id)
                    .sort((a, b) => a.position - b.position)
                    .findIndex(t => t.id === task.id),
                };
              }
              if (task.column_id === overColumn.id && task.id !== activeTask.id) {
                // New column: re-index
                return {
                  ...task,
                  position: tasks
                    .filter(t => t.column_id === overColumn.id && t.id !== activeTask.id)
                    .sort((a, b) => a.position - b.position)
                    .findIndex(t => t.id === task.id),
                };
              }
              return task;
            });
          updateTaskPositions(newTasks);
        }
        return;
      }
    }
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;
  const activeColumn = activeId ? columns.find(c => c.id === activeId) : null;

  return (
    <div className="h-screen p-6 flex flex-col items-center">
      <div className="mb-6 w-full max-w-screen-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-left">My Project Board</h1>
        <p className="text-gray-600 text-left">Manage your tasks with this Kanban board</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full overflow-x-auto">
          <div className="flex gap-6 min-w-fit pb-6">
            <SortableContext items={activeColumns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
              {activeColumns.map(column => (
                <ColumnComponent key={column.id} column={column} />
              ))}
            </SortableContext>
          </div>
        </div>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} />}
          {activeColumn && <ColumnComponent column={activeColumn} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
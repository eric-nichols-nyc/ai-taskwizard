//import { useState } from 'react';
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
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskCard } from './task-card';
import { ColumnComponent } from './column-component';
import { Board, Column, Task } from '@turbo-with-tailwind-v4/database/types';

interface KanbanBoardProps {
  children: React.ReactNode;
  columnIds: string[];
  board: Board | null;
  tasks: Task[];
  isLoading: boolean | null;
  error: Error | null;
  moveTask: (taskId: string, columnId: string) => void;
  addTask: (task: Task, onSuccess?: () => void) => void;
  handleDragStart: (event: DragStartEvent) => void;
  activeColumn: Column | null;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  activeId: string | null;
  activeTask: Task | null;
}
export const KanbanBoard = ({ children, board, tasks, isLoading, error, columnIds, addTask: addTaskFromHook, handleDragStart, activeColumn,handleDragOver,handleDragEnd,activeTask }: KanbanBoardProps) => {
  //const [activeId, setActiveId] = useState<string | null>(null);


  // Debug: Log all column and task IDs
  // console.log('[Kanban Render] Column IDs:', columns.map(c => c.id));
  // console.log('[Kanban Render] Task IDs:', tasks.map(t => t.id));

  // Debug: Log items passed to SortableContext for columns
 // console.log('[Kanban Render] SortableContext (columns) items:', activeColumns.map(c => c.id));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  // const handleDragStart = (event: DragStartEvent) => {
  //   setActiveId(event.active.id as string);
  //   // console.log('[DragStart]', { activeId: event.active.id });
  // };

  // const handleDragOver = (event: DragOverEvent) => {
  //   const { active, over, delta } = event;
  //   console.log('[Kanban Render] ========handleDragOver', delta, active, over);
  //   if (!over) return;

  //   const activeData = active.data.current;
  //   const overData = over.data.current;
  //   if (!activeData || !overData) return;

  //   // Dragging a task
  //   if (activeData.type === 'Task') {
  //     // Dropped over a task
  //     if (overData.type === 'Task') {
  //       const activeTask = activeData.task;
  //       const overTask = overData.task;
  //       if (activeTask.id === overTask.id) return;
  //       // If moving to a different column
  //       if (activeTask.column_id !== overTask.column_id) {
  //         moveTask(activeTask.id, overTask.column_id);
  //       }
  //     }
  //     // Dropped over a column
  //     if (overData.type === 'Column') {
  //       const activeTask = activeData.task;
  //       const overColumn = overData.column;
  //       if (activeTask.column_id !== overColumn.id) {
  //         moveTask(activeTask.id, overColumn.id);
  //       }
  //     }
  //   }
  // };

  // const handleDragEnd = (event: DragEndEvent) => {
  //   console.log('[Kanban Render] ========DragEnd');
  //   const { active, over } = event;
  //   setActiveId(null);
  //   if (!over) return;

  //   const activeData = active.data.current;
  //   const overData = over.data.current;
  //   console.log('[Kanban Render] ========activeData', activeData);
  //   console.log('[Kanban Render] ========overData', overData);
  //   if (!activeData || !overData) return;

  //   // Column reordering - not implemented in hook yet
  //   if (activeData.type === 'Column' && overData.type === 'Column') {
  //     if (active.id === over.id) return;
  //     console.log('[Kanban Render] Column reordering not implemented in hook');
  //     return;
  //   }

  //   // Task reordering or moving between columns
  //   if (activeData.type === 'Task' && overData.type === 'Column') {
  //     console.log('[Kanban Render] ========Task reordering or moving between columns');
  //     const activeTask = activeData.task;
  //     // Dropped on a task
  //     if (overData.type === 'Task') {
  //       const overTask = overData.task;
  //       if (activeTask.id === overTask.id) return;

  //       // If moving to a different column
  //       if (activeTask.column_id !== overTask.column_id) {
  //         moveTask(activeTask.id, overTask.column_id);
  //       }
  //       return;
  //     }
  //     // Dropped on a column
  //     if (overData.type === 'Column') {
  //       const overColumn = overData.column;
  //       console.log('[Kanban Render] ========Dropped on a column', overColumn);
  //       if (activeTask.column_id !== overColumn.id) {
  //         moveTask(activeTask.id, overColumn.id);
  //       }
  //       return;
  //     }
  //   }
  // };

  // const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;
  // const activeColumn = activeId ? columnIds.find(c => c === activeId) : null;

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-screen p-6 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading kanban board...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-screen p-6 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading kanban board: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen p-6 flex flex-col items-center">
      <div className="mb-6 w-full max-w-screen-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-left">
          {board?.name || 'My Project Board'}
        </h1>
        <p className="text-gray-600 text-left">
          {board?.description || 'Manage your tasks with this Kanban board'}
        </p>
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
            <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
              {/* {activeColumns.map(column => (
                <ColumnComponent
                  key={column.id}
                  column={{
                    id: column.id,
                    column_id: column.id,
                    title: column.name,
                    description: '',
                    position: column.position,
                    board_id: column.board_id,
                  }}
                  tasks={tasks.filter(t => t.column_id === column.id)}
                  addTask={(taskData) => {
                    const newTask: Task = {
                      id: '', // Will be generated by the database
                      column_id: column.id,
                      title: taskData.title || '',
                      description: taskData.description || '',
                      position: taskData.position || 0,
                      status: taskData.status || '',
                      priority: taskData.priority || null,
                      due_date: taskData.due_date || null,
                    };
                    addTaskFromHook(newTask, () => {
                      console.log('Task added successfully');
                    });
                  }}
                />
              ))} */}
              {children}
            </SortableContext>
          </div>
        </div>

        <DragOverlay>
          {activeTask && <TaskCard task={{
            id: activeTask.id,
            title: activeTask.title,
            description: activeTask.description || '',
            column_id: activeTask.column_id,
            position: activeTask.position,
            status: activeTask.status || '',
          }} />}
          {activeColumn && <ColumnComponent column={{
            id: activeColumn.id,
            column_id: activeColumn.id,
            title: activeColumn.name,
            description: '',
            position: activeColumn.position,
            board_id: activeColumn.board_id,
          }} tasks={tasks.filter(t => t.column_id === activeColumn.id)} addTask={(taskData) => {
            const newTask: Task = {
              id: '', // Will be generated by the database
              column_id: activeColumn.id,
              title: taskData.title || '',
              description: taskData.description || '',
              position: taskData.position || 0,
              status: taskData.status || '',
              priority: taskData.priority || null,
              due_date: taskData.due_date || null,
            };
            addTaskFromHook(newTask, () => {
              console.log('Task added successfully');
            });
          }} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
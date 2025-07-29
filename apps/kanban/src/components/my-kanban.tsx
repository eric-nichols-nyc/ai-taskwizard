import { useState } from 'react';
import { KanbanBoard } from "./kanban-prototype/kanban-board";
import { useKanbanBoardState } from "../hooks/use-kanban-board";
import { TaskCard } from './kanban-prototype/task-card';
import { ColumnComponent } from './kanban-prototype/column-component';
import { DragOverEvent, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { Column, Task } from '@turbo-with-tailwind-v4/database/types';


const MyActiveTask = ({ task }: { task: Task }) => {
  return <TaskCard task={task} />;
};

const MyActiveColumn = ({ column, tasks, addTaskFromHook }: { column: Column, tasks: Task[], addTaskFromHook: (task: Partial<Task>) => void }) => {
  return <ColumnComponent column={{
    id: column.id,
    name: column.name,
    position: column.position,
    board_id: column.board_id,
  }} tasks={tasks.filter(t => t.column_id === column.id)} addTask={addTaskFromHook} />;
};

export function MyKanban() {
  const { board, columns, tasks, isLoading, error, moveTask, addTask: addTaskFromHook } = useKanbanBoardState();

  // Wrapper function to handle Partial<Task> to Task conversion
  const handleAddTask = (partialTask: Partial<Task>) => {
    if (partialTask.id) {
      addTaskFromHook(partialTask as Task);
    }
  };
  const columnIds = columns.map(c => c.id);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;
  const activeColumn = activeId ? columns.find(c => c.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    //console.log('[Kanban Render] ========handleDragOver', event);
    // console.log('[Kanban Render] ========active', active);
    // console.log('[Kanban Render] ========over', over);
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
        // console.log('[Kanban Render is over a task] ========activeTask', activeTask);
        // console.log('[Kanban Render is over a task] ========activeData', activeData.sortable.index);
        // console.log('[Kanban Render is over a task] ========overData', overData.sortable.index);

        // If moving to a different column
        if (activeTask.column_id !== overTask.column_id) {
          //const targetTaskIndex = overData.sortable.index;
          console.log('Move task to different column');
          console.log('[Kanban Render is over a task] ========activeTask', activeTask);
          console.log('[Kanban Render is over a task] ========activeData', activeData.sortable.index);
          console.log('[Kanban Render is over a task] ========overData', overData.sortable.index);

          // DND Kit gives us the exact drop position
          const dropIndex = overData.sortable.index;
          console.log('Drop at index:', dropIndex);

          // If dropping at index 0, we need to determine if it's "first" or "after" the first item
          if (dropIndex === 0) {
            // Check if we're dropping at the very top or after the first item
            // You can use the monitor to get more precise positioning
            console.log('Dropping at index 0 - need to determine if first or after first item');
            // Don't call moveTask here - just log for testing
            console.log('TEST: Would call moveTask with:', {
              taskId: activeTask.id,
              columnId: overTask.column_id,
              position: 'first',
              targetTaskId: undefined
            });
          } else {
            // For other positions, use the index to determine before/after
            console.log('TEST: Would call moveTask with:', {
              taskId: activeTask.id,
              columnId: overTask.column_id,
              position: 'before',
              targetTaskId: overTask.id
            });
          }

        } else if (activeTask.column_id === overTask.column_id) {
          console.log('[Kanban Render is over a task in the same column] ========activeTask', activeTask);
          // if moving up or down
          if (activeData.sortable.index < overData.sortable.index) {
            console.log('Move task down');
            console.log('TEST: Would call moveTask with:', {
              taskId: activeTask.id,
              columnId: overTask.column_id,
              position: 'before',
              targetTaskId: overTask.id
            });
          } else {
            console.log('Move task up');
            console.log('TEST: Would call moveTask with:', {
              taskId: activeTask.id,
              columnId: overTask.column_id,
              position: 'after',
              targetTaskId: overTask.id
            });
          }
        }
      }

      if (overData.type === 'Column') {
        console.log('Dragged over a column');
        const activeTask = activeData.task;
        const overColumn = overData.column;

        if (activeTask.column_id !== overColumn.id) {
          // When dropping on a column, check if it has tasks
          const columnTasks = tasks.filter(t => t.column_id === overColumn.id);
          const dropPosition = columnTasks.length === 0 ? 'first' : 'last';
          console.log('TEST: Would call moveTask with:', {
            taskId: activeTask.id,
            columnId: overColumn.id,
            position: dropPosition,
            targetTaskId: undefined,
            columnTasksCount: columnTasks.length
          });
        }
      }
    }
  };

  const moveTaskWrapper = (taskId: string, columnId: string) => {
    moveTask(taskId, columnId, 'first'); // Default to first position
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('[Kanban Render] ========DragEnd active', active.id);
    console.log('[Kanban Render] ========DragEnd over', over?.id);
    console.log('[Kanban Render] ========DragEnd active.id', active.id);
    console.log('[Kanban Render] ========DragEnd over?.id', over?.id);
    console.log('[Kanban Render] ========DragEnd active.data.current', active.data.current);
    console.log('[Kanban Render] ========DragEnd over.data.current', over?.data.current);

    if (!over) {
      console.log('No drop target - drag cancelled');
      setActiveId(null);
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || !overData) {
      console.log('Missing data - drag cancelled');
      setActiveId(null);
      return;
    }

    // Dragging a task
    if (activeData.type === 'Task') {
      // Dropped over a task
      if (overData.type === 'Task') {
        const activeTask = activeData.task;
        const overTask = overData.task;

        if (activeTask.id === overTask.id) {
          console.log('Dropped on same task - no action needed');
          setActiveId(null);
          return;
        }

        console.log('=== FINAL MOVE TASK TEST ===');
        console.log('Active task:', activeTask.title);
        console.log('Over task:', overTask.title);
        console.log('Active index:', activeData.sortable.index);
        console.log('Over index:', overData.sortable.index);
        console.log('Column change:', activeTask.column_id !== overTask.column_id);
        console.log('Same column:', activeTask.column_id === overTask.column_id);

        // If moving to a different column
        if (activeTask.column_id !== overTask.column_id) {
          const dropIndex = overData.sortable.index;
          console.log('Drop at index:', dropIndex);

          if (dropIndex === 0) {
            console.log('ACTUAL: Calling moveTask with first position');
            moveTask(activeTask.id, overTask.column_id, 'first');
          } else {
            console.log('ACTUAL: Calling moveTask with before position');
            moveTask(activeTask.id, overTask.column_id, 'before', overTask.id);
          }
        } else if (activeTask.column_id === overTask.column_id) {
          // Same column reordering
          if (activeData.sortable.index < overData.sortable.index) {
            console.log('ACTUAL: Calling moveTask with before position (moving down)');
            moveTask(activeTask.id, overTask.column_id, 'before', overTask.id);
          } else {
            console.log('ACTUAL: Calling moveTask with after position (moving up)');
            moveTask(activeTask.id, overTask.column_id, 'after', overTask.id);
          }
        }
      }

      // Dropped over a column
      if (overData.type === 'Column') {
        const activeTask = activeData.task;
        const overColumn = overData.column;

        if (activeTask.column_id !== overColumn.id) {
          const columnTasks = tasks.filter(t => t.column_id === overColumn.id);
          const dropPosition = columnTasks.length === 0 ? 'first' : 'last';

          console.log('=== COLUMN DROP TEST ===');
          console.log('Dropping on column:', overColumn.name);
          console.log('Column has tasks:', columnTasks.length);
          console.log('Drop position:', dropPosition);
          console.log('ACTUAL: Calling moveTask with column drop');

          moveTask(activeTask.id, overColumn.id, dropPosition);
        }
      }
    }

    console.log('=== END DRAG TEST ===');
    setActiveId(null);
  };

  return (
    <KanbanBoard
      board={board}
      columnIds={columnIds}
      tasks={tasks}
      isLoading={isLoading}
      error={error} moveTask={moveTaskWrapper}
      addTask={addTaskFromHook}
      handleDragStart={handleDragStart}
      activeColumn={activeColumn as Column | null}
      handleDragOver={handleDragOver}
      handleDragEnd={handleDragEnd}
      activeId={activeId}
      activeTask={activeTask as Task | null}
      ActiveTaskComponent={<MyActiveTask task={activeTask as Task} />}
      ActiveColumnComponent={activeColumn ? <MyActiveColumn column={activeColumn} tasks={[]} addTaskFromHook={handleAddTask} /> : null}
    >
      {columns.map(column => (
          <ColumnComponent
            key={column.id}
            column={column}
            tasks={tasks.filter(t => t.column_id === column.id)}
            addTask={handleAddTask}
          />
      ))}
    </KanbanBoard>
  );
}
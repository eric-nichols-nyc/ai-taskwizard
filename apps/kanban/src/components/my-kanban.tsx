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
  console.log('[MyKanban] columnIds', columnIds);
  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;
  const activeColumn = activeId ? columns.find(c => c.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over, delta } = event;
    console.log('[Kanban Render] ========handleDragOver', delta, active, over);
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
          moveTask(activeTask.id, overTask.column_id);
        }
      }
      // Dropped over a column
      if (overData.type === 'Column') {
        const activeTask = activeData.task;
        const overColumn = overData.column;
        if (activeTask.column_id !== overColumn.id) {
          moveTask(activeTask.id, overColumn.id);
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('[Kanban Render] ========DragEnd');
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;
    console.log('[Kanban Render] ========activeData', activeData);
    console.log('[Kanban Render] ========overData', overData);
    if (!activeData || !overData) return;

    // Column reordering - not implemented in hook yet
    if (activeData.type === 'Column' && overData.type === 'Column') {
      if (active.id === over.id) return;
      console.log('[Kanban Render] Column reordering not implemented in hook');
      return;
    }

    // Task reordering or moving between columns
    if (activeData.type === 'Task' && overData.type === 'Column') {
      console.log('[Kanban Render] ========Task reordering or moving between columns');
      const activeTask = activeData.task;
      // Dropped on a task
      if (overData.type === 'Task') {
        const overTask = overData.task;
        if (activeTask.id === overTask.id) return;

        // If moving to a different column
        if (activeTask.column_id !== overTask.column_id) {
          moveTask(activeTask.id, overTask.column_id);
        }
        return;
      }
      // Dropped on a column
      if (overData.type === 'Column') {
        const overColumn = overData.column;
        console.log('[Kanban Render] ========Dropped on a column', overColumn);
        if (activeTask.column_id !== overColumn.id) {
          moveTask(activeTask.id, overColumn.id);
        }
        return;
      }
    }
  };

  return <KanbanBoard
    board={board}
    columnIds={columnIds}
    tasks={tasks}
    isLoading={isLoading}
    error={error} moveTask={moveTask}
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
      <ColumnComponent key={column.id} column={column} tasks={tasks.filter(t => t.column_id === column.id)} addTask={handleAddTask} />
    ))}
  </KanbanBoard>;
}
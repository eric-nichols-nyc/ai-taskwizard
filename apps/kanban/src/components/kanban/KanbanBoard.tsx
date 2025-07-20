import { useState } from "react";
import { Board } from "./Board";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import { KanbanBoardData, Task } from "@turbo-with-tailwind-v4/database/types";
import { KanbanDataTransformer, RawKanbanData } from "../../lib/kanban-data-transformer";

interface KanbanBoardProps {
  data: KanbanBoardData;
  onTaskMove?: (taskId: string, newColumnId: string, newPosition: number) => void;
}

export function KanbanBoard({ data, onTaskMove }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Transform data once for efficient rendering
  const transformedData = KanbanDataTransformer.transform(data as RawKanbanData);

//   console.log('KanbanBoard - data received:', data);
//   console.log('KanbanBoard - transformedData:', transformedData);

  const handleDragStart = (event: unknown) => {
    const dragEvent = event as { active: { id: string } };
    const task = transformedData.tasks?.find(t => t.id === dragEvent.active.id);
    console.log('KanbanBoard - handleDragStart:', dragEvent.active.id, 'task found:', task);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: unknown) => {
    const dragEvent = event as { active: { id: string }, over: { id: string } };
    const { active, over } = dragEvent;

    console.log('KanbanBoard - handleDragEnd:', { active, over });

    if (active && over && active.id !== over.id) {
      const taskId = active.id;
      const targetColumnId = transformedData.tasks?.find(t => t.id === over.id)?.column_id;
      if (!targetColumnId) {
        console.error('KanbanBoard - targetColumnId not found for task:', over.id);
        return;
      }

      console.log('KanbanBoard - moving task:', taskId, 'to column:', targetColumnId);

      // Calculate new position (you can implement more sophisticated positioning logic)
      const targetColumnTasks = KanbanDataTransformer.getSortedTasksForColumn(transformedData, targetColumnId);
      const newPosition = targetColumnTasks.length > 0
        ? Math.max(...targetColumnTasks.map(t => t.position)) + 1000
        : 1000;

      console.log('KanbanBoard - new position calculated:', newPosition);
      console.log('KanbanBoard - calling onTaskMove with:', { taskId, targetColumnId, newPosition });

      onTaskMove?.(taskId, targetColumnId, newPosition);
    }

    setActiveTask(null);
  };

  // Render columns with their tasks
  const columnElements = transformedData.columns?.map(column => {
    const columnTasks = KanbanDataTransformer.getSortedTasksForColumn(transformedData, column.id);

    console.log(`KanbanBoard - rendering column ${column.name} (${column.id}) with ${columnTasks.length} tasks:`, columnTasks);

    const taskElements = columnTasks.map(task => (
      <TaskCard
        key={task.id}
        {...task}
      />
    ));

    return (
      <Column
        key={column.id}
        {...column}
      >
        {taskElements}
      </Column>
    );
  }) ?? [];

  return (
    <div className="h-screen max-w-screen-xl mx-auto overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{transformedData.board?.name}</h1>
        {transformedData.board?.description && (
          <p className="text-gray-600 mt-2">{transformedData.board.description}</p>
        )}
      </div>

      <Board
        columns={columnElements}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        activeTask={activeTask ? <TaskCard {...activeTask} /> : undefined}
      />
    </div>
  );
}
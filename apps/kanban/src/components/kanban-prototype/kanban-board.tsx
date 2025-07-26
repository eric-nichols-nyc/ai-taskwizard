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
  ActiveTaskComponent: React.ReactNode;
  ActiveColumnComponent: React.ReactNode;
}
export const KanbanBoard = ({ children, board, isLoading, error, columnIds, handleDragStart, activeColumn,handleDragOver,handleDragEnd,activeTask,ActiveTaskComponent,ActiveColumnComponent }: KanbanBoardProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

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
              {children}
            </SortableContext>
          </div>
        </div>

        <DragOverlay>
          {activeTask && ActiveTaskComponent}
          {activeColumn && ActiveColumnComponent}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
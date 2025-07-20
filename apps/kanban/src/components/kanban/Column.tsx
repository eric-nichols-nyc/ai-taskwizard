import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanColumn } from "@turbo-with-tailwind-v4/database/types";

export type ColumnProps = KanbanColumn & {
  children?: React.ReactNode;
};

export function Column({ id, name, children }: ColumnProps) {
  // Make column a droppable area for tasks
  const { setNodeRef: setDroppableNodeRef } = useDroppable({ id });

  // Make column header sortable for column reordering
  const {
    attributes,
    listeners,
    setNodeRef: setSortableNodeRef,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'Column',
      column: { id, name },
    },
  });

  const style = {
    transition,
  };

  // Extract task IDs from children for SortableContext
  const taskIds = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.props && typeof child.props === 'object' && 'id' in child.props) {
      return child.props.id as string;
    }
    return null;
  })?.filter((id): id is string => id !== null) || [];

  return (
    <div
      ref={setDroppableNodeRef}
      style={style}
      className={`column bg-white border border-blue-200 shadow-sm rounded-lg p-4 min-w-80 max-w-80 transition-colors hover:border-blue-400 hover:shadow-md h-[500px] ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <header
        className="mb-2 flex flex-col items-center justify-between cursor-grab"
        ref={setSortableNodeRef}
        {...attributes}
        {...listeners}
      >
        <h2 className="font-semibold text-blue-900 mb-3 text-sm">{name}</h2>
        <p className="text-xs text-gray-500">{id}</p>
        {/* Add task count or actions here if needed */}
      </header>
      <div className="flex-1 space-y-2 overflow-y-auto">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </div>
      {/* Add 'Add Task' button or footer here if needed */}
    </div>
  );
}
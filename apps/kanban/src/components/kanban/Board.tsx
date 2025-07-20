import React from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";

// If you have a design system container, import it here
// import { Card } from "@your-design-system";

export type BoardProps = {
  columns: React.ReactNode[];
  onDragStart?: (event: DragStartEvent) => void;
  onDragOver?: (event: unknown) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  activeTask?: React.ReactNode;
  activeColumn?: React.ReactNode;
};

function getElementKey(node: React.ReactNode): string | undefined {
  if (React.isValidElement(node) && node.key != null) {
    return String(node.key);
  }
  return undefined;
}

export function Board({
  columns,
  onDragStart,
  onDragOver,
  onDragEnd,
  activeTask,
  activeColumn,
}: BoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    })
  );

  const columnKeys = columns.map(getElementKey).filter(Boolean) as string[];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-6 justify-center items-start w-full">
        <SortableContext
          items={columnKeys}
          strategy={horizontalListSortingStrategy}
        >
          {columns}
        </SortableContext>
      </div>
      <DragOverlay>
        {activeTask}
        {activeColumn}
      </DragOverlay>
    </DndContext>
  );
}

// Export default if you want default import
// export default Board;
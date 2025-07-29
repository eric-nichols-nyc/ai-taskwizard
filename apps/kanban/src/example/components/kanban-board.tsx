'use client';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Task, useTaskStore, type ColumnId } from '../utils/store';
import { hasDraggableData } from '../utils';
import {
  Announcements,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import type { Column } from './board-column';
import { BoardColumn, BoardContainer } from './board-column';
import NewSectionDialog from './new-section-dialog';
import { TaskCard } from './task-card';
// import { coordinateGetter } from "./multipleContainersKeyboardPreset";

export function KanbanBoard() {
  // const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columns = useTaskStore((state) => state.columns);
  const setColumns = useTaskStore((state) => state.setCols);
  const pickedUpTaskColumn = useRef<ColumnId | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  // const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const tasks = useTaskStore((state) => state.tasks);
  const setTasks = useTaskStore((state) => state.setTasks);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Debug logging
  console.log('Columns:', columns);
  console.log('Tasks:', tasks);
  console.log('Columns length:', columns.length);
  console.log('Tasks length:', tasks.length);

  // Function to log move operations
  const logMoveOperation = (moveData: {
    taskId: string;
    fromPosition: number;
    toPosition: number;
    fromColumnId: UniqueIdentifier;
    toColumnId: UniqueIdentifier;
    taskTitle: string;
  }) => {
    console.log('🎯 MOVE OPERATION:', {
      task: moveData.taskTitle,
      taskId: moveData.taskId,
      from: {
        position: moveData.fromPosition,
        columnId: moveData.fromColumnId
      },
      to: {
        position: moveData.toPosition,
        columnId: moveData.toColumnId
      },
      timestamp: new Date().toISOString()
    });

    // Log the database object that would be sent
    const databaseObject = {
      id: moveData.taskId,
      column_id: moveData.toColumnId,
      position: moveData.toPosition,
      status: moveData.toColumnId // Using column_id as status for now
    };

    console.log('📊 DATABASE UPDATE:', databaseObject);
  };

  // Function to calculate gap-based position
  const calculateGapPosition = (tasks: Task[], targetIndex: number, columnId: UniqueIdentifier): number => {
    // Get tasks in the same column, sorted by position
    const columnTasks = tasks
      .filter(task => task.column_id === columnId)
      .sort((a, b) => a.position - b.position);

    if (targetIndex === 0) {
      // Moving to the top: position = first item's position - 100
      return columnTasks[0]?.position - 100 || 0;
    }

    if (targetIndex >= columnTasks.length) {
      // Moving to the bottom: position = last item's position + 100
      return columnTasks[columnTasks.length - 1]?.position + 100 || 100;
    }

    // Moving between items: position = average of surrounding items
    const beforeItem = columnTasks[targetIndex - 1];
    const afterItem = columnTasks[targetIndex];

    return (beforeItem.position + afterItem.position) / 2;
  };

  // Function to log gap position calculation
  const logGapPositionCalculation = (
    taskId: string,
    taskTitle: string,
    fromIndex: number,
    toIndex: number,
    columnId: UniqueIdentifier,
    newPosition: number
  ) => {
    console.log('🎯 GAP POSITION CALCULATION:', {
      task: taskTitle,
      taskId: taskId,
      fromIndex: fromIndex,
      toIndex: toIndex,
      columnId: columnId,
      newPosition: newPosition,
      timestamp: new Date().toISOString()
    });
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: coordinateGetter,
    // }),
  );

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  useEffect(() => {
    useTaskStore.persist.rehydrate();
  }, []);
  if (!isMounted) return;

  function getDraggingTaskData(taskId: UniqueIdentifier, columnId: ColumnId) {
    const tasksInColumn = tasks.filter((task) => task.column_id === columnId);
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
    const column = columns.find((col) => col.id === columnId);
    return {
      tasksInColumn,
      taskPosition,
      column
    };
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === 'Column') {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.title} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`;
      } else if (active.data.current?.type === 'Task') {
        pickedUpTaskColumn.current = active.data.current.task.column_id;
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id,
          pickedUpTaskColumn.current
        );
        return `Picked up Task ${active.data.current.task.title} at position: ${
          taskPosition + 1
        } of ${tasksInColumn.length} in column ${column?.title}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === 'Column' &&
        over.data.current?.type === 'Column'
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === 'Task' &&
        over.data.current?.type === 'Task'
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.column_id
        );
        if (over.data.current.task.column_id !== pickedUpTaskColumn.current) {
          return `Task ${
            active.data.current.task.title
          } was moved over column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was moved over position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragEnd({ active, over }) {
      console.log('OVER = ', over)
       console.log('Active = ', active)
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = null;
        return;
      }
      if (
        active.data.current?.type === 'Column' &&
        over.data.current?.type === 'Column'
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);

        return `Column ${
          active.data.current.column.title
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`;
      } else if (
        active.data.current?.type === 'Task' &&
        over.data.current?.type === 'Task'
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.column_id
        );
        if (over.data.current.task.column_id !== pickedUpTaskColumn.current) {
          return `Task was dropped into column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was dropped into position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
      pickedUpTaskColumn.current = null;
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    }
  };

  return (
    <DndContext
      accessibility={{
        announcements
      }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <BoardContainer>
        <SortableContext items={columnsId}>
          {columns?.map((col, index) => (
            <Fragment key={col.id}>
              <BoardColumn
                column={col}
                tasks={tasks.filter((task) => task.column_id === col.id)}
              />
              {index === columns?.length - 1 && (
                <div className='w-[300px] hidden'>
                  <NewSectionDialog />
                </div>
              )}
            </Fragment>
          ))}
          {!columns.length && <NewSectionDialog />}
        </SortableContext>
      </BoardContainer>

      {'document' in window &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                tasks={tasks.filter((task) => task.column_id === activeColumn.id)}
              />
            )}
            {activeTask && <TaskCard task={activeTask} isOverlay />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === 'Column') {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === 'Task') {
      setActiveTask(data.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === 'Column';
    if (!isActiveAColumn) return;

    const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

    const overColumnIndex = columns.findIndex((col) => col.id === overId);

    setColumns(arrayMove(columns, activeColumnIndex, overColumnIndex));
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === 'Task';
    const isOverATask = overData?.type === 'Task';

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);
      const activeTask = tasks[activeIndex];
      const overTask = tasks[overIndex];

      if (activeTask && overTask) {
        // Log the move operation
        logMoveOperation({
          taskId: activeTask.id,
          fromPosition: activeIndex,
          toPosition: overIndex,
          fromColumnId: activeTask.column_id,
          toColumnId: overTask.column_id,
          taskTitle: activeTask.title
        });

        // If moving to a different column
        if (activeTask.column_id !== overTask.column_id) {
          activeTask.status = overTask.status;
          activeTask.column_id = overTask.column_id;

          // Calculate new position in the target column
          const targetColumnTasks = tasks.filter(t => t.column_id === overTask.column_id);
          const newPosition = calculateGapPosition(tasks, targetColumnTasks.length, overTask.column_id);
          activeTask.position = newPosition;

          logGapPositionCalculation(
            activeTask.id,
            activeTask.title,
            activeIndex,
            targetColumnTasks.length,
            overTask.column_id,
            newPosition
          );
        } else {
          // Moving within the same column - calculate gap position
          const columnTasks = tasks.filter(t => t.column_id === activeTask.column_id);
          const targetIndex = columnTasks.findIndex(t => t.id === overTask.id);
          const newPosition = calculateGapPosition(tasks, targetIndex, activeTask.column_id);

          logGapPositionCalculation(
            activeTask.id,
            activeTask.title,
            activeIndex,
            targetIndex,
            activeTask.column_id,
            newPosition
          );

          activeTask.position = newPosition;
        }

        // Update the tasks array with the new position
        const newTasks = tasks.map(task =>
          task.id === activeTask.id ? activeTask : task
        );

        setTasks(newTasks);
      }
    }

    const isOverAColumn = overData?.type === 'Column';

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const activeTask = tasks[activeIndex];
      if (activeTask) {
        const newColumnId = overId as ColumnId;

        // Log the move operation
        logMoveOperation({
          taskId: activeTask.id,
          fromPosition: activeIndex,
          toPosition: activeIndex, // Same position, different column
          fromColumnId: activeTask.column_id,
          toColumnId: newColumnId,
          taskTitle: activeTask.title
        });

        // Calculate new position in the target column
        const targetColumnTasks = tasks.filter(t => t.column_id === newColumnId);
        const newPosition = calculateGapPosition(tasks, targetColumnTasks.length, newColumnId);

        logGapPositionCalculation(
          activeTask.id,
          activeTask.title,
          activeIndex,
          targetColumnTasks.length,
          newColumnId,
          newPosition
        );

        activeTask.status = newColumnId;
        activeTask.column_id = newColumnId;
        activeTask.position = newPosition;

        // Update the tasks array with the new position
        const newTasks = tasks.map(task =>
          task.id === activeTask.id ? activeTask : task
        );

        setTasks(newTasks);
      }
    }
  }
}

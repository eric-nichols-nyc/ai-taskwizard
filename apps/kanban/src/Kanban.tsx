import React, { useState, useEffect } from "react";
import { Column } from "./components/kanban/Column";
import { TaskCard } from "./components/kanban/TaskCard";
import { useKanbanStore } from "./store/useKanbanStore";
import { signInWithGoogle } from '@turbo-with-tailwind-v4/database';
import { useDefaultKanban } from "@turbo-with-tailwind-v4/database/use-tasks"; // adjust import path as needed
import { KanbanColumn } from "@turbo-with-tailwind-v4/database/types";

import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableColumn({ column, children }: { column: KanbanColumn; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: column.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export const Kanban = () => {
  const {
    tasks,
    updateColumnPositions,
    updateTaskPositions,
  } = useKanbanStore();

  const { kanban: columns, kanbanLoading, kanbanError } = useDefaultKanban();

  console.log('Kanban - kanban columns', columns);

  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      async function maybeSignIn() {
        try {
          const sessionData = await signInWithGoogle();
          setUserId(sessionData?.user?.id);
          setAccessToken(sessionData?.access_token ?? null);
          console.log('Dev sign-in successful, user from session data:', sessionData);
        } catch (error) {
          console.error('Error during dev sign-in:', error);
        }
      }
      maybeSignIn();
      // Get access token from localStorage

    } else {
      setUserId('prod-user'); // Placeholder for production, replace as needed
    }
  }, []);



  const [showAddTask, setShowAddTask] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");

  // DnD state
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'task' | 'column' | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    })
  );

  const activeColumns = (columns ?? [])
    .sort((a, b) => a.position - b.position);

  const today = new Date().toISOString().slice(0, 10);

  const getColumnTasks = (columnId: string) =>
    (columns ?? [])
      .find((col) => col.id === columnId)?.tasks
      ?.filter((task) => task.due_date === today) ?? [];

  // DnD Handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    if (event.active.data.current?.type === 'column') setActiveType('column');
    else setActiveType('task');
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.active || !event.over) return;
    if (activeType === 'task') {
      const activeTask = tasks.find((t) => t.id === event.active.id);
      const overTask = tasks.find((t) => t.id === event.over?.id);
      const overColumn = (columns ?? []).find((c) => c.id === event.over?.id);
      if (!activeTask) return;
      // If dropped over a task
      if (overTask && activeTask.column_id !== overTask.column_id) {
        // Move to new column
        updateTaskPositions(
          tasks.map((task) =>
            task.id === activeTask.id
              ? { ...task, column_id: overTask.column_id, position: 0 }
              : task
          )
        );
      }
      // If dropped over a column
      if (overColumn && activeTask.column_id !== overColumn.id) {
        updateTaskPositions(
          tasks.map((task) =>
            task.id === activeTask.id
              ? { ...task, column_id: overColumn.id, position: 0 }
              : task
          )
        );
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setActiveType(null);
    if (!event.active || !event.over) return;
    if (activeType === 'column') {
      const oldIndex = activeColumns.findIndex((c) => c.id === event.active.id);
      const newIndex = activeColumns.findIndex((c) => c.id === event.over?.id);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newColumns = arrayMove(activeColumns, oldIndex, newIndex).map((col, idx) => ({ ...col, position: idx }));
        updateColumnPositions(
          (columns ?? []).map((col) => {
            const nc = newColumns.find((nc) => nc.id === col.id) || col;
            return {
              ...nc,
              column_id: nc.id,
              title: nc.name
            };
          })
        );
      }
    } else if (activeType === 'task') {
      const activeTask = tasks.find((t) => t.id === event.active.id);
      const overTask = tasks.find((t) => t.id === event.over?.id);
      if (activeTask && overTask && activeTask.column_id === overTask.column_id) {
        const columnTasks = getColumnTasks(activeTask.column_id);
        const oldIndex = columnTasks.findIndex((t) => t.id === activeTask.id);
        const newIndex = columnTasks.findIndex((t) => t.id === overTask.id);
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const reordered = arrayMove(columnTasks, oldIndex, newIndex).map((task, idx) => ({ ...task, position: idx }));
          const updatedTasks = [
            ...tasks.filter((t) => t.column_id !== activeTask.column_id),
            ...reordered,
          ];
          updateTaskPositions(updatedTasks);
        }
      }
    }
  };

  if (kanbanLoading) {
    return <div>Loading Kanban board...</div>;
  }
  if (kanbanError) {
    return <div>Error loading Kanban board: {kanbanError.message}</div>;
  }

  if (!userId) return <div>...loading</div>;

  return (
    <div className="h-screen max-w-screen-xl mx-auto p-6 flex flex-col items-center">
          {
          process.env.NODE_ENV === 'development' && (
            // show user id and access token
            <div className="text-gray-600 text-left flex flex-col w-full">
              <div>User ID: {userId}</div>
              <div>Access Token: {accessToken ?? '(none found)'}</div>
            </div>
          )
        }
      <div className="mb-6 w-full max-w-screen-lg mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-left">My Pesonal Board</h1>
          <p className="text-gray-600 text-left">Manage your tasks with this Kanban board</p>
        </div>

      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-row gap-6 overflow-x-auto pb-6 justify-start items-start w-full max-w-screen-lg">
          <SortableContext items={activeColumns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
            {activeColumns.map((column) => (
              <SortableColumn key={column.id} column={column}>
                <Column {...column}>
                  <SortableContext items={getColumnTasks(column.id).map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-2 w-80">
                      {getColumnTasks(column.id).map((task) => (
                        <TaskCard key={task.id} id={task.id} title={task.title} dueDate={undefined} priority={undefined} />
                      ))}
                      {showAddTask === column.id ? (
                        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 mt-2">
                          <input
                            type="text"
                            placeholder="Task title"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            className="w-full p-2 mb-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <textarea
                            placeholder="Task description"
                            value={newTaskDesc}
                            onChange={(e) => setNewTaskDesc(e.target.value)}
                            className="w-full p-2 mb-2 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                if (newTaskTitle.trim()) {
                                  useKanbanStore.getState().addTask(column.id, newTaskTitle, newTaskDesc);
                                  setNewTaskTitle("");
                                  setNewTaskDesc("");
                                  setShowAddTask(null);
                                }
                              }}
                              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                            >
                              Add Task
                            </button>
                            <button
                              onClick={() => setShowAddTask(null)}
                              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAddTask(column.id)}
                          className="w-full p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center gap-2 mt-2"
                        >
                          + Add a card
                        </button>
                      )}
                    </div>
                  </SortableContext>
                </Column>
              </SortableColumn>
            ))}
          </SortableContext>
          <DragOverlay>
            {activeType === 'task' && activeId ? (
              (() => {
                const task = tasks.find((t) => t.id === activeId);
                return task ? <TaskCard id={task.id} title={task.title} dueDate={undefined} priority={undefined} /> : null;
              })()
            ) : activeType === 'column' && activeId ? (
              (() => {
                const column = columns?.find((c) => c.id === activeId);
                return column ? <Column {...column} /> : null;
              })()
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  );
};
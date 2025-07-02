import React, { useState, useEffect } from "react";
import { Column } from "./components/kanban/Column";
import { TaskCard } from "./components/kanban/TaskCard";
import { useKanbanStore } from "./store/useKanbanStore";
import { signInWithEmail } from '@turbo-with-tailwind-v4/database';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";

export const Kanban = () => {
  const {
    columns,
    tasks,
    addTask,
    addColumn,
    activeBoard,
  } = useKanbanStore();

  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      async function maybeSignIn() {
        try {
          const sessionData = await signInWithEmail();
          setUserId(sessionData?.user?.id);
          console.log('Dev sign-in successful, user from session data:', sessionData?.user?.id);
        } catch (error) {
          console.error('Error during dev sign-in:', error);
        }
      }
      maybeSignIn();
    } else {
      setUserId('prod-user'); // Placeholder for production, replace as needed
    }
  }, []);

  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [newColumnDesc, setNewColumnDesc] = useState("");
  const [showAddTask, setShowAddTask] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    })
  );

  const activeColumns = columns
    .filter((col) => col.board_id === activeBoard)
    .sort((a, b) => a.position - b.position);

  const getColumnTasks = (columnId: string) =>
    tasks
      .filter((task) => task.column_id === columnId)
      .sort((a, b) => a.position - b.position);

  const handleDragStart = () => {};
  const handleDragOver = () => {};
  const handleDragEnd = () => {};

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      addColumn(activeBoard!, newColumnTitle, newColumnDesc);
      setNewColumnTitle("");
      setNewColumnDesc("");
      setShowAddColumn(false);
    }
  };

  const handleAddTask = (columnId: string) => {
    if (newTaskTitle.trim()) {
      addTask(columnId, newTaskTitle, newTaskDesc);
      setNewTaskTitle("");
      setNewTaskDesc("");
      setShowAddTask(null);
    }
  };

  if (!userId) return <div>...loading</div>;

  return (
    <div className="h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 flex flex-col items-center">
      <div className="mb-6 w-full max-w-screen-lg mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-left">My Project Board</h1>
          <p className="text-gray-600 text-left">Manage your tasks with this Kanban board</p>
        </div>
        <div>
          {showAddColumn ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Column title"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <input
                type="text"
                placeholder="Description"
                value={newColumnDesc}
                onChange={(e) => setNewColumnDesc(e.target.value)}
                className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddColumn}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddColumn(false)}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddColumn(true)}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Column
            </button>
          )}
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-6 justify-center items-start w-full max-w-screen-lg">
          <SortableContext items={activeColumns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
            {activeColumns.map((column) => (
              <Column key={column.id} title={column.title}>
                <div className="flex flex-col gap-2">
                  {getColumnTasks(column.id).map((task) => (
                    <TaskCard key={task.id} title={task.title} dueDate={undefined} priority={undefined} />
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
                          onClick={() => handleAddTask(column.id)}
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
              </Column>
            ))}
          </SortableContext>
        </div>
        <DragOverlay>
          {/* Optionally render a preview of the dragged item */}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
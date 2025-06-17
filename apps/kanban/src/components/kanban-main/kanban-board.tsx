import React, { useState } from 'react';
import { create } from 'zustand';
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
  arrayMove,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { Plus, MoreHorizontal } from 'lucide-react';

// Types
interface Task {
  id: string;
  column_id: string;
  title: string;
  description: string;
  position: number;
  status: string;
}

interface Column {
  id: string;
  board_id: string;
  column_id: string;
  title: string;
  description: string;
  position: number;
}

interface Board {
  id: string;
  user_id: string;
  title: string;
  description: string;
}

interface KanbanState {
  boards: Board[];
  columns: Column[];
  tasks: Task[];
  activeBoard: string | null;
  setActiveBoard: (boardId: string) => void;
  addColumn: (boardId: string, title: string, description: string) => void;
  addTask: (columnId: string, title: string, description: string) => void;
  updateColumnPositions: (columns: Column[]) => void;
  updateTaskPositions: (tasks: Task[]) => void;
  moveTask: (taskId: string, newColumnId: string, newPosition: number) => void;
}

// Zustand Store
const useKanbanStore = create<KanbanState>((set, get) => ({
  boards: [
    {
      id: 'board-1',
      user_id: 'user-1',
      title: 'My Project Board',
      description: 'Main project management board',
    },
  ],
  columns: [
    {
      id: 'col-1',
      board_id: 'board-1',
      column_id: 'col-1',
      title: 'To Do',
      description: 'Tasks to be started',
      position: 0,
    },
    {
      id: 'col-2',
      board_id: 'board-1',
      column_id: 'col-2',
      title: 'In Progress',
      description: 'Currently working on',
      position: 1,
    },
    {
      id: 'col-3',
      board_id: 'board-1',
      column_id: 'col-3',
      title: 'Done',
      description: 'Completed tasks',
      position: 2,
    },
  ],
  tasks: [
    {
      id: 'task-1',
      column_id: 'col-1',
      title: 'Design homepage',
      description: 'Create wireframes and mockups',
      position: 0,
      status: 'todo',
    },
    {
      id: 'task-2',
      column_id: 'col-1',
      title: 'Setup project structure',
      description: 'Initialize React app with required dependencies',
      position: 1,
      status: 'todo',
    },
    {
      id: 'task-3',
      column_id: 'col-2',
      title: 'Implement authentication',
      description: 'Add login and signup functionality',
      position: 0,
      status: 'in-progress',
    },
    {
      id: 'task-4',
      column_id: 'col-3',
      title: 'Setup CI/CD pipeline',
      description: 'Configure GitHub Actions for deployment',
      position: 0,
      status: 'done',
    },
  ],
  activeBoard: 'board-1',
  setActiveBoard: (boardId) => set({ activeBoard: boardId }),
  addColumn: (boardId, title, description) => {
    const { columns } = get();
    const boardColumns = columns.filter(col => col.board_id === boardId);
    const newColumn: Column = {
      id: `col-${Date.now()}`,
      board_id: boardId,
      column_id: `col-${Date.now()}`,
      title,
      description,
      position: boardColumns.length,
    };
    set(state => ({ columns: [...state.columns, newColumn] }));
  },
  addTask: (columnId, title, description) => {
    const { tasks } = get();
    const columnTasks = tasks.filter(task => task.column_id === columnId);
    const newTask: Task = {
      id: `task-${Date.now()}`,
      column_id: columnId,
      title,
      description,
      position: columnTasks.length,
      status: 'todo',
    };
    set(state => ({ tasks: [...state.tasks, newTask] }));
  },
  updateColumnPositions: (columns) => set({ columns }),
  updateTaskPositions: (tasks) => set({ tasks }),
  moveTask: (taskId, newColumnId, newPosition) => {
    const { tasks } = get();
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, column_id: newColumnId, position: newPosition };
      }
      return task;
    });
    set({ tasks: updatedTasks });
  },
}));

// Task Card Component
const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-grab hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
      <p className="text-sm text-gray-600">{task.description}</p>
    </div>
  );
};

// Add Task Form
const AddTaskForm: React.FC<{ columnId: string; onClose: () => void }> = ({ columnId, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const addTask = useKanbanStore(state => state.addTask);

  const handleSubmit = () => {
    if (title.trim()) {
      addTask(columnId, title, description);
      setTitle('');
      setDescription('');
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-full p-2 mb-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoFocus
      />
      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 mb-2 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={2}
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Add Task
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Column Component
const ColumnComponent: React.FC<{ column: Column }> = ({ column }) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const allTasks = useKanbanStore(state => state.tasks);
  const tasks = allTasks
    .filter(task => task.column_id === column.id)
    .sort((a, b) => a.position - b.position);

  // Make column a droppable area for tasks
  const { setNodeRef: setDroppableNodeRef } = useDroppable({ id: column.id });

  // Only useSortable for the column header (for column reordering)
  const {
    attributes,
    listeners,
    setNodeRef: setSortableNodeRef,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const style = {
    transition,
  };

  return (
    <div
      ref={setDroppableNodeRef}
      style={style}
      className={`bg-gray-100 rounded-lg p-4 min-w-80 max-w-80 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div
        className="flex items-center justify-between mb-4 cursor-grab"
        ref={setSortableNodeRef}
        {...attributes}
        {...listeners}
      >
        <div className="cursor-grab">
          <h3 className="font-semibold text-gray-900">{column.title}</h3>
          <p className="text-sm text-gray-600">{column.description}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowAddTask(true)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>

      {showAddTask ? (
        <AddTaskForm columnId={column.id} onClose={() => setShowAddTask(false)} />
      ) : (
        <button
          onClick={() => setShowAddTask(true)}
          className="w-full p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add a card
        </button>
      )}
    </div>
  );
};

// Main Kanban Board Component
export const KanbanBoard: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const { 
    columns, 
    tasks, 
    activeBoard, 
    updateColumnPositions, 
    updateTaskPositions, 
  } = useKanbanStore();

  // Debug: Log all column and task IDs
  console.log('[Kanban Render] Column IDs:', columns.map(c => c.id));
  console.log('[Kanban Render] Task IDs:', tasks.map(t => t.id));

  const activeColumns = columns
    .filter(col => col.board_id === activeBoard)
    .sort((a, b) => a.position - b.position);

  // Debug: Log items passed to SortableContext for columns
  console.log('[Kanban Render] SortableContext (columns) items:', activeColumns.map(c => c.id));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    console.log('[DragStart]', { activeId: event.active.id });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
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
          const newTasks = tasks.map(task => {
            if (task.id === activeTask.id) {
              return { ...task, column_id: overTask.column_id };
            }
            return task;
          });
          updateTaskPositions(newTasks);
        }
      }
      // Dropped over a column
      if (overData.type === 'Column') {
        const activeTask = activeData.task;
        const overColumn = overData.column;
        if (activeTask.column_id !== overColumn.id) {
          const newTasks = tasks.map(task => {
            if (task.id === activeTask.id) {
              return { ...task, column_id: overColumn.id };
            }
            return task;
          });
          updateTaskPositions(newTasks);
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;
    if (!activeData || !overData) return;

    // Column reordering
    if (activeData.type === 'Column' && overData.type === 'Column') {
      if (active.id === over.id) return;
      const oldIndex = activeColumns.findIndex(c => c.id === active.id);
      const newIndex = activeColumns.findIndex(c => c.id === over.id);
      const newColumns = arrayMove(activeColumns, oldIndex, newIndex).map((col, index) => ({
        ...col,
        position: index,
      }));
      const updatedColumns = columns.map(col => {
        const newCol = newColumns.find(nc => nc.id === col.id);
        return newCol || col;
      });
      updateColumnPositions(updatedColumns);
      return;
    }

    // Task reordering or moving between columns
    if (activeData.type === 'Task') {
      const activeTask = activeData.task;
      // Dropped on a task
      if (overData.type === 'Task') {
        const overTask = overData.task;
        if (activeTask.id === overTask.id) return;
        const columnTasks = tasks.filter(t => t.column_id === overTask.column_id);
        const oldIndex = columnTasks.findIndex(t => t.id === activeTask.id);
        const newIndex = columnTasks.findIndex(t => t.id === overTask.id);
        let reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex).map((task, index) => ({
          ...task,
          position: index,
        }));
        // If moving to a new column, update column_id
        if (activeTask.column_id !== overTask.column_id) {
          reorderedTasks = reorderedTasks.map(task =>
            task.id === activeTask.id ? { ...task, column_id: overTask.column_id } : task
          );
        }
        const updatedTasks = [
          ...tasks.filter(task => task.column_id !== overTask.column_id),
          ...reorderedTasks,
        ];
        updateTaskPositions(updatedTasks);
        return;
      }
      // Dropped on a column
      if (overData.type === 'Column') {
        const overColumn = overData.column;
        if (activeTask.column_id !== overColumn.id) {
          const destColumnTasks = tasks
            .filter(t => t.column_id === overColumn.id)
            .sort((a, b) => a.position - b.position);
          const updatedActiveTask = {
            ...activeTask,
            column_id: overColumn.id,
            position: destColumnTasks.length,
          };
          const newTasks = tasks
            .filter(t => t.id !== activeTask.id)
            .concat(updatedActiveTask)
            .map(task => {
              // Re-index positions in both columns
              if (task.column_id === activeTask.column_id && task.id !== activeTask.id) {
                // Old column: re-index
                return {
                  ...task,
                  position: tasks
                    .filter(t => t.column_id === activeTask.column_id && t.id !== activeTask.id)
                    .sort((a, b) => a.position - b.position)
                    .findIndex(t => t.id === task.id),
                };
              }
              if (task.column_id === overColumn.id && task.id !== activeTask.id) {
                // New column: re-index
                return {
                  ...task,
                  position: tasks
                    .filter(t => t.column_id === overColumn.id && t.id !== activeTask.id)
                    .sort((a, b) => a.position - b.position)
                    .findIndex(t => t.id === task.id),
                };
              }
              return task;
            });
          updateTaskPositions(newTasks);
        }
        return;
      }
    }
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;
  const activeColumn = activeId ? columns.find(c => c.id === activeId) : null;

  return (
    <div className="h-screen bg-gradient-to-br p-6 flex flex-col items-center">
      <div className="mb-6 w-full max-w-screen-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-left">My Project Board</h1>
        <p className="text-gray-600 text-left">Manage your tasks with this Kanban board</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-6 justify-center items-start w-full">
          <SortableContext items={activeColumns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
            {activeColumns.map(column => (
              <ColumnComponent key={column.id} column={column} />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} />}
          {activeColumn && <ColumnComponent column={activeColumn} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
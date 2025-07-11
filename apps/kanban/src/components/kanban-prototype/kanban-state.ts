import { create } from 'zustand';
import type { KanbanState, Board, Column, Task } from './task-types';

export const useKanbanStore = create<KanbanState>((set, get) => ({
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
import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { persist } from 'zustand/middleware';
import { UniqueIdentifier } from '@dnd-kit/core';
import { Column } from '../components/board-column';

export type Status = (typeof defaultCols)[number]['id'];

const defaultCols = [
  {
    id: uuid(),
    title: 'Todo'
  },
  {
    id: uuid(),
    title: 'In Progress'
  },
  {
    id: uuid(),
    title: 'Done'
  }
] satisfies Column[];

export type ColumnId = (typeof defaultCols)[number]['id'];

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: Status;
  position: number;
  column_id: UniqueIdentifier;
};

export type State = {
  tasks: Task[];
  columns: Column[];
  draggedTask: string | null;
};

// We need to create the initial tasks after the columns are defined
// so we can use the actual column IDs
const createInitialTasks = (): Task[] => {
  const todoCol = defaultCols[0];
  const inProgressCol = defaultCols[1];
  const doneCol = defaultCols[2];

  return [
    {
      id: 'task1',
      status: todoCol.id,
      title: 'Project initiation and planning',
      position: 100,
      column_id: todoCol.id
    },
    {
      id: 'task2',
      status: todoCol.id,
      title: 'Gather requirements from stakeholders',
      position: 200,
      column_id: todoCol.id
    },
    {
      id: 'task3',
      status: inProgressCol.id,
      title: 'Design system architecture',
      position: 100,
      column_id: inProgressCol.id
    },
    {
      id: 'task4',
      status: doneCol.id,
      title: 'Set up development environment',
      position: 100,
      column_id: doneCol.id
    }
  ];
};

const initialTasks = createInitialTasks();

export type Actions = {
  addTask: (title: string, description?: string) => void;
  addCol: (title: string) => void;
  dragTask: (id: string | null) => void;
  removeTask: (title: string) => void;
  removeCol: (id: UniqueIdentifier) => void;
  setTasks: (updatedTask: Task[]) => void;
  setCols: (cols: Column[]) => void;
  updateCol: (id: UniqueIdentifier, newName: string) => void;
  resetStore: () => void;
};

export const useTaskStore = create<State & Actions>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      columns: defaultCols,
      draggedTask: null,
      addTask: (title: string, description?: string) =>
        set((state) => {
          // Find the highest position in the first column and add 1
          const firstColumnId = state.columns[0]?.id;
          if (!firstColumnId) return state;

          const tasksInFirstColumn = state.tasks.filter(task => task.status === firstColumnId);
          const nextPosition = tasksInFirstColumn.length > 0
            ? Math.max(...tasksInFirstColumn.map(task => task.position)) + 1
            : 0;

          return {
            tasks: [
              ...state.tasks,
              { id: uuid(), title, description, status: firstColumnId, position: nextPosition, column_id: firstColumnId }
            ]
          };
        }),
      updateCol: (id: UniqueIdentifier, newName: string) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === id ? { ...col, title: newName } : col
          )
        })),
      addCol: (title: string) =>
        set((state) => ({
          columns: [
            ...state.columns,
            { title, id: uuid() }
          ]
        })),
      dragTask: (id: string | null) => set({ draggedTask: id }),
      removeTask: (id: string) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        })),
      removeCol: (id: UniqueIdentifier) =>
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id)
        })),
      setTasks: (newTasks: Task[]) => set({ tasks: newTasks.sort((a, b) => a.position - b.position) }),
      setCols: (newCols: Column[]) => set({ columns: newCols }),
      resetStore: () => set({ tasks: initialTasks, columns: defaultCols, draggedTask: null })
    }),
    { name: 'task-store', skipHydration: false }
  )
);

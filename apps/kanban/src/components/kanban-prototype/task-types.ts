// Task, Column, Board, and KanbanState interfaces for Kanban prototype

export interface Task {
  id: string;
  column_id: string;
  title: string;
  description: string;
  position: number;
  status: string;
}

export interface Column {
  id: string;
  board_id: string;
  column_id: string;
  title: string;
  description: string;
  position: number;
}

export interface Board {
  id: string;
  user_id: string;
  title: string;
  description: string;
}

export interface KanbanState {
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
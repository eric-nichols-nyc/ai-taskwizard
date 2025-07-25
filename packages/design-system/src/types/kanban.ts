export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  column_id: string;
  position: number;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  description?: string;
  position: number;
}

export interface KanbanBoardData {
  columns: KanbanColumn[];
  tasks: KanbanTask[];
}

export interface KanbanBoardProps {
  tasks: KanbanTask[];
  columns: KanbanColumn[];
  onTaskAdd?: (task: Partial<KanbanTask>) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<KanbanTask>) => void;
  onTaskDelete?: (taskId: string) => void;
  onColumnAdd?: (column: Partial<KanbanColumn>) => void;
  onColumnUpdate?: (columnId: string, updates: Partial<KanbanColumn>) => void;
  onColumnDelete?: (columnId: string) => void;
  className?: string;
  taskRenderer?: (task: KanbanTask) => React.ReactNode;
  columnHeaderRenderer?: (column: KanbanColumn) => React.ReactNode;
}

export interface KanbanColumnProps {
  column: KanbanColumn;
  tasks: KanbanTask[];
  onTaskAdd?: (task: Partial<KanbanTask>) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<KanbanTask>) => void;
  onTaskDelete?: (taskId: string) => void;
  className?: string;
  taskRenderer?: (task: KanbanTask) => React.ReactNode;
  headerRenderer?: (column: KanbanColumn) => React.ReactNode;
}

export interface KanbanTaskProps {
  task: KanbanTask;
  onUpdate?: (updates: Partial<KanbanTask>) => void;
  onDelete?: () => void;
  className?: string;
  children?: React.ReactNode;
}
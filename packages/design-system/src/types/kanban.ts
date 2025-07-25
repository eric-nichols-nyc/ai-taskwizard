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

export interface KanbanColumnProps {
  column: KanbanColumn;
  tasks: KanbanTask[];
  onTaskAdd?: (task: Partial<KanbanTask>) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<KanbanTask>) => void;
  onTaskDelete?: (taskId: string) => void;
  className?: string;
  taskRenderer?: (task: KanbanTask) => React.ReactNode;
  headerRenderer?: (column: KanbanColumn) => React.ReactNode;
  onAddTaskToColumn?: (task: Partial<KanbanTask>) => void;
}

export interface KanbanTaskProps {
  task: KanbanTask;
  onUpdate?: (updates: Partial<KanbanTask>) => void;
  onDelete?: () => void;
  className?: string;
  children?: React.ReactNode;
}
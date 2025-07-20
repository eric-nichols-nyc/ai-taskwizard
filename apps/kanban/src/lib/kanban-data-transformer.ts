import { KanbanBoardData, KanbanColumn, Task } from "@turbo-with-tailwind-v4/database/types";

export interface RawKanbanData {
  board: {
    id: string;
    name: string;
    description: string;
  };
  columns: Array<{
    id: string;
    board_id: string;
    name: string;
    position: number;
  }>;
  tasks: Array<{
    id: string;
    column_id: string;
    title: string;
    description: string | null;
    position: number;
    status: string;
    priority: string;
    due_date: string;
  }>;
}

export class KanbanDataTransformer {
  /**
   * Transforms raw DB data into the format expected by kanban components
   * This is the most efficient approach as it processes data once
   */
  static transform(rawData: RawKanbanData): KanbanBoardData {
    // Sort columns by position for consistent ordering
    const sortedColumns = rawData.columns.sort((a, b) => a.position - b.position);

    return {
      board: rawData.board,
      columns: sortedColumns as KanbanColumn[],
      tasks: rawData.tasks as Task[],
    };
  }

  /**
   * Gets tasks for a specific column efficiently
   */
  static getTasksForColumn(data: KanbanBoardData, columnId: string): Task[] {
    return data.tasks?.filter(task => task.column_id === columnId) ?? [];
  }

  /**
   * Gets sorted tasks for a specific column
   */
  static getSortedTasksForColumn(data: KanbanBoardData, columnId: string): Task[] {
    return (data.tasks ?? [])
      .filter(task => task.column_id === columnId)
      .sort((a, b) => a.position - b.position);
  }
}
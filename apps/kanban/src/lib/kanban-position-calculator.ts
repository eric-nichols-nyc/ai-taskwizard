// Kanban Position Calculator
import { Task } from "@turbo-with-tailwind-v4/database";


interface PositionCalculatorParams {
    tasks: Omit<Task, 'created_at' | 'updated_at'>[];
    taskId: string;
    targetColumnId: string;
    dropPosition: 'first' | 'last' | 'before' | 'after';
    targetTaskId?: string;
  }

  interface PositionResult {
    newPosition: number;
    needsRebalancing: boolean;
    updatedTasks: Omit<Task, 'created_at' | 'updated_at'>[];
  }


export class KanbanPositionCalculator {
    private static readonly MIN_GAP = 0.000001;
    private static readonly REBALANCE_THRESHOLD = 0.001;
    private static readonly INITIAL_POSITION_GAP = 1000;

    static calculatePosition(params: PositionCalculatorParams): PositionResult {
      const { tasks, taskId, targetColumnId, dropPosition, targetTaskId } = params;

      const columnTasks = tasks
        .filter(task => task.column_id === targetColumnId && task.id !== taskId)
        .sort((a, b) => a.position - b.position);

      let newPosition: number;
      let needsRebalancing = false;

      switch (dropPosition) {
        case 'first':
          newPosition = this.calculateFirstPosition(columnTasks);
          break;
        case 'last':
          newPosition = this.calculateLastPosition(columnTasks);
          break;
        case 'before': {
          if (!targetTaskId) throw new Error('targetTaskId is required for "before" position');
          const beforeResult = this.calculateBeforePosition(columnTasks, targetTaskId);
          newPosition = beforeResult.position;
          needsRebalancing = beforeResult.needsRebalancing;
          break;
        }
        case 'after': {
          if (!targetTaskId) throw new Error('targetTaskId is required for "after" position');
          const afterResult = this.calculateAfterPosition(columnTasks, targetTaskId);
          newPosition = afterResult.position;
          needsRebalancing = afterResult.needsRebalancing;
          break;
        }
        default:
          throw new Error(`Invalid drop position: ${dropPosition}`);
      }

      const updatedTasks = tasks.map(task =>
        task.id === taskId
          ? { ...task, column_id: targetColumnId, position: newPosition }
          : task
      );

      if (needsRebalancing) {
        return this.rebalanceColumn(updatedTasks, targetColumnId, taskId);
      }

      return { newPosition, needsRebalancing: false, updatedTasks };
    }

    private static calculateFirstPosition(columnTasks: Omit<Task, 'created_at' | 'updated_at'>[]): number {
      if (columnTasks.length === 0) return this.INITIAL_POSITION_GAP;
      return columnTasks[0].position / 2;
    }

    private static calculateLastPosition(columnTasks: Omit<Task, 'created_at' | 'updated_at'>[]): number {
      if (columnTasks.length === 0) return this.INITIAL_POSITION_GAP;
      return columnTasks[columnTasks.length - 1].position + this.INITIAL_POSITION_GAP;
    }

    private static calculateBeforePosition(columnTasks: Omit<Task, 'created_at' | 'updated_at'>[], targetTaskId: string): { position: number; needsRebalancing: boolean } {
      const targetIndex = columnTasks.findIndex(task => task.id === targetTaskId);
      if (targetIndex === -1) throw new Error(`Target task ${targetTaskId} not found`);

      const targetTask = columnTasks[targetIndex];

      if (targetIndex === 0) {
        return { position: targetTask.position / 2, needsRebalancing: false };
      }

      const prevTask = columnTasks[targetIndex - 1];
      const gap = targetTask.position - prevTask.position;

      if (gap <= this.REBALANCE_THRESHOLD) {
        return { position: targetTask.position, needsRebalancing: true };
      }

      return { position: prevTask.position + (gap / 2), needsRebalancing: false };
    }

    private static calculateAfterPosition(columnTasks: Omit<Task, 'created_at' | 'updated_at'>[], targetTaskId: string): { position: number; needsRebalancing: boolean } {
      const targetIndex = columnTasks.findIndex(task => task.id === targetTaskId);
      if (targetIndex === -1) throw new Error(`Target task ${targetTaskId} not found`);

      const targetTask = columnTasks[targetIndex];

      if (targetIndex === columnTasks.length - 1) {
        return { position: targetTask.position + this.INITIAL_POSITION_GAP, needsRebalancing: false };
      }

      const nextTask = columnTasks[targetIndex + 1];
      const gap = nextTask.position - targetTask.position;

      if (gap <= this.REBALANCE_THRESHOLD) {
        return { position: targetTask.position, needsRebalancing: true };
      }

      return { position: targetTask.position + (gap / 2), needsRebalancing: false };
    }

    private static rebalanceColumn(tasks: Omit<Task, 'created_at' | 'updated_at'>[], columnId: string, excludeTaskId?: string): PositionResult {
      const columnTasks = tasks
        .filter(task => task.column_id === columnId)
        .sort((a, b) => a.position - b.position);

      const rebalancedTasks = columnTasks.map((task, index) => ({
        ...task,
        position: (index + 1) * this.INITIAL_POSITION_GAP
      }));

      const updatedTasks = tasks.map(task => {
        if (task.column_id === columnId) {
          const rebalancedTask = rebalancedTasks.find(rt => rt.id === task.id);
          return rebalancedTask || task;
        }
        return task;
      });

      const movedTask = updatedTasks.find(task => task.id === excludeTaskId);

      return {
        newPosition: movedTask?.position || 0,
        needsRebalancing: true,
        updatedTasks
      };
    }

    static getNewTaskPosition(tasks: Task[], columnId: string): number {
      const columnTasks = tasks
        .filter(task => task.column_id === columnId)
        .sort((a, b) => a.position - b.position);

      if (columnTasks.length === 0) return this.INITIAL_POSITION_GAP;
      return columnTasks[columnTasks.length - 1].position + this.INITIAL_POSITION_GAP;
    }
  }

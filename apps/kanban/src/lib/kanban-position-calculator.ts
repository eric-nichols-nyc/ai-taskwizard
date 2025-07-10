// Kanban Position Calculator
import { Task } from "@turbo-with-tailwind-v4/database";

/**
 * Parameters for calculating new task positions in the kanban board
 */
interface PositionCalculatorParams {
    tasks: Omit<Task, 'created_at' | 'updated_at'>[];
    taskId: string;
    targetColumnId: string;
    dropPosition: 'first' | 'last' | 'before' | 'after';
    targetTaskId?: string; // Required for 'before' and 'after' positions
}

/**
 * Result of position calculation including the new position and updated tasks array
 */
interface PositionResult {
    newPosition: number;
    needsRebalancing: boolean;
    updatedTasks: Omit<Task, 'created_at' | 'updated_at'>[];
}

/**
 * Calculates optimal positions for kanban tasks during drag and drop operations.
 * Uses fractional positioning to minimize database writes and avoid cascading updates.
 *
 * Position Strategy:
 * - Uses decimal positions (e.g., 1000, 1500, 2000) for easy insertion
 * - Inserts between tasks using midpoint calculation
 * - Triggers rebalancing when gaps become too small
 * - Maintains proper ordering while minimizing position updates
 */
export class KanbanPositionCalculator {
    /** Minimum gap between positions to prevent precision issues */
    private static readonly MIN_GAP = 0.000001;

    /** When position gaps get smaller than this, trigger rebalancing */
    private static readonly REBALANCE_THRESHOLD = 0.001;

    /** Default gap between positions for new tasks and rebalancing */
    private static readonly INITIAL_POSITION_GAP = 1000;

    /**
     * Calculate the optimal position for a task being moved in the kanban board
     *
     * @param params - Configuration object containing task info and target position
     * @returns Result object with new position and updated tasks array
     *
     * @example
     * ```typescript
     * const result = KanbanPositionCalculator.calculatePosition({
     *   tasks: allTasks,
     *   taskId: 'task-123',
     *   targetColumnId: 'column-456',
     *   dropPosition: 'before',
     *   targetTaskId: 'task-789'
     * });
     * ```
     */
    static calculatePosition(params: PositionCalculatorParams): PositionResult {
      const { tasks, taskId, targetColumnId, dropPosition, targetTaskId } = params;

      // Get all tasks in the target column (excluding the task being moved)
      // Sort by position to maintain proper ordering
      const columnTasks = tasks
        .filter(task => task.column_id === targetColumnId && task.id !== taskId)
        .sort((a, b) => a.position - b.position);

      let newPosition: number;
      let needsRebalancing = false;

      // Calculate position based on the drop strategy
      switch (dropPosition) {
        case 'first':
          // Place at the beginning of the column
          newPosition = this.calculateFirstPosition(columnTasks);
          break;

        case 'last':
          // Place at the end of the column
          newPosition = this.calculateLastPosition(columnTasks);
          break;

        case 'before': {
          // Place before a specific task
          if (!targetTaskId) throw new Error('targetTaskId is required for "before" position');
          const beforeResult = this.calculateBeforePosition(columnTasks, targetTaskId);
          newPosition = beforeResult.position;
          needsRebalancing = beforeResult.needsRebalancing;
          break;
        }

        case 'after': {
          // Place after a specific task
          if (!targetTaskId) throw new Error('targetTaskId is required for "after" position');
          const afterResult = this.calculateAfterPosition(columnTasks, targetTaskId);
          newPosition = afterResult.position;
          needsRebalancing = afterResult.needsRebalancing;
          break;
        }

        default:
          throw new Error(`Invalid drop position: ${dropPosition}`);
      }

      // Create updated tasks array with the moved task's new position and column
      const updatedTasks = tasks.map(task =>
        task.id === taskId
          ? { ...task, column_id: targetColumnId, position: newPosition }
          : task
      );

      // If gaps are too small, rebalance the entire column
      if (needsRebalancing) {
        return this.rebalanceColumn(updatedTasks, targetColumnId, taskId);
      }

      return { newPosition, needsRebalancing: false, updatedTasks };
    }

    /**
     * Calculate position for placing a task at the beginning of a column
     *
     * Strategy: Use half of the first task's position, or default gap if column is empty
     *
     * @param columnTasks - Sorted array of tasks in the target column
     * @returns Position value for the first position
     */
    private static calculateFirstPosition(columnTasks: Omit<Task, 'created_at' | 'updated_at'>[]): number {
      // If column is empty, use the default initial position
      if (columnTasks.length === 0) return this.INITIAL_POSITION_GAP;

      // Place before the first task by using half its position
      // Example: first task at 1000 → new task at 500
      return columnTasks[0].position / 2;
    }

    /**
     * Calculate position for placing a task at the end of a column
     *
     * Strategy: Add default gap to the last task's position
     *
     * @param columnTasks - Sorted array of tasks in the target column
     * @returns Position value for the last position
     */
    private static calculateLastPosition(columnTasks: Omit<Task, 'created_at' | 'updated_at'>[]): number {
      // If column is empty, use the default initial position
      if (columnTasks.length === 0) return this.INITIAL_POSITION_GAP;

      // Place after the last task by adding the default gap
      // Example: last task at 3000 → new task at 4000
      return columnTasks[columnTasks.length - 1].position + this.INITIAL_POSITION_GAP;
    }

    /**
     * Calculate position for placing a task before another specific task
     *
     * Strategy: Use midpoint between previous task and target task
     * If no previous task exists, use half of target task's position
     *
     * @param columnTasks - Sorted array of tasks in the target column
     * @param targetTaskId - ID of the task to place the new task before
     * @returns Object containing the new position and whether rebalancing is needed
     */
    private static calculateBeforePosition(
      columnTasks: Omit<Task, 'created_at' | 'updated_at'>[],
      targetTaskId: string
    ): { position: number; needsRebalancing: boolean } {
      const targetIndex = columnTasks.findIndex(task => task.id === targetTaskId);
      if (targetIndex === -1) throw new Error(`Target task ${targetTaskId} not found`);

      const targetTask = columnTasks[targetIndex];

      // If inserting before the first task, use half of its position
      if (targetIndex === 0) {
        return { position: targetTask.position / 2, needsRebalancing: false };
      }

      // Calculate the gap between the previous task and target task
      const prevTask = columnTasks[targetIndex - 1];
      const gap = targetTask.position - prevTask.position;

      // If the gap is too small, we need to rebalance the entire column
      if (gap <= this.REBALANCE_THRESHOLD) {
        return { position: targetTask.position, needsRebalancing: true };
      }

      // Use the midpoint between previous and target tasks
      // Example: prevTask at 1000, targetTask at 2000 → new position at 1500
      return { position: prevTask.position + (gap / 2), needsRebalancing: false };
    }

    /**
     * Calculate position for placing a task after another specific task
     *
     * Strategy: Use midpoint between target task and next task
     * If no next task exists, add default gap to target task's position
     *
     * @param columnTasks - Sorted array of tasks in the target column
     * @param targetTaskId - ID of the task to place the new task after
     * @returns Object containing the new position and whether rebalancing is needed
     */
    private static calculateAfterPosition(
      columnTasks: Omit<Task, 'created_at' | 'updated_at'>[],
      targetTaskId: string
    ): { position: number; needsRebalancing: boolean } {
      const targetIndex = columnTasks.findIndex(task => task.id === targetTaskId);
      if (targetIndex === -1) throw new Error(`Target task ${targetTaskId} not found`);

      const targetTask = columnTasks[targetIndex];

      // If inserting after the last task, add the default gap
      if (targetIndex === columnTasks.length - 1) {
        return { position: targetTask.position + this.INITIAL_POSITION_GAP, needsRebalancing: false };
      }

      // Calculate the gap between target task and next task
      const nextTask = columnTasks[targetIndex + 1];
      const gap = nextTask.position - targetTask.position;

      // If the gap is too small, we need to rebalance the entire column
      if (gap <= this.REBALANCE_THRESHOLD) {
        return { position: targetTask.position, needsRebalancing: true };
      }

      // Use the midpoint between target and next tasks
      // Example: targetTask at 2000, nextTask at 3000 → new position at 2500
      return { position: targetTask.position + (gap / 2), needsRebalancing: false };
    }

    /**
     * Rebalance all positions in a column when gaps become too small
     *
     * This redistributes all tasks in the column with proper gaps to prevent
     * future precision issues and maintain clean, predictable positions.
     *
     * Strategy: Assign positions as multiples of INITIAL_POSITION_GAP
     * (1000, 2000, 3000, etc.)
     *
     * @param tasks - Complete array of all tasks
     * @param columnId - ID of the column to rebalance
     * @param excludeTaskId - ID of the task that was just moved (for result tracking)
     * @returns Complete position result with rebalanced tasks
     */
    private static rebalanceColumn(
      tasks: Omit<Task, 'created_at' | 'updated_at'>[],
      columnId: string,
      excludeTaskId?: string
    ): PositionResult {
      // Get all tasks in the column that needs rebalancing
      const columnTasks = tasks
        .filter(task => task.column_id === columnId)
        .sort((a, b) => a.position - b.position);

      // Reassign positions with proper gaps (1000, 2000, 3000, etc.)
      const rebalancedTasks = columnTasks.map((task, index) => ({
        ...task,
        position: (index + 1) * this.INITIAL_POSITION_GAP
      }));

      // Update the complete tasks array with rebalanced positions
      const updatedTasks = tasks.map(task => {
        if (task.column_id === columnId) {
          const rebalancedTask = rebalancedTasks.find(rt => rt.id === task.id);
          return rebalancedTask || task;
        }
        return task;
      });

      // Find the position of the task that was moved (for return value)
      const movedTask = updatedTasks.find(task => task.id === excludeTaskId);

      return {
        newPosition: movedTask?.position || 0,
        needsRebalancing: true,
        updatedTasks
      };
    }

    /**
     * Get the position for a new task being added to a column
     *
     * Used when creating new tasks - places them at the end of the specified column
     *
     * @param tasks - Array of all existing tasks
     * @param columnId - ID of the column where the new task will be added
     * @returns Position value for the new task
     *
     * @example
     * ```typescript
     * const newTaskPosition = KanbanPositionCalculator.getNewTaskPosition(
     *   allTasks,
     *   'todo-column'
     * );
     *
     * const newTask = {
     *   id: generateId(),
     *   column_id: 'todo-column',
     *   title: 'New Task',
     *   position: newTaskPosition
     * };
     * ```
     */
    static getNewTaskPosition(tasks: Task[], columnId: string): number {
      // Get all tasks in the target column, sorted by position
      const columnTasks = tasks
        .filter(task => task.column_id === columnId)
        .sort((a, b) => a.position - b.position);

      // If column is empty, use the default initial position
      if (columnTasks.length === 0) return this.INITIAL_POSITION_GAP;

      // Place the new task after the last existing task
      return columnTasks[columnTasks.length - 1].position + this.INITIAL_POSITION_GAP;
    }
}
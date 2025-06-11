import type {
  TaskFields,
  CreateTaskData,
  UpdateTaskData,
  TaskListener,
  FirestoreTask,
} from "../types/index";
class TaskService {
  private tasks: TaskFields[] = [];
  private listeners: Set<TaskListener> = new Set();

  constructor() {
    this.tasks = [];
    this.listeners = new Set();
  }

  generateTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getUserId() {
    return "kxR3TTSxxEcOwQ1w6hKZhDl7ZZz1";
  }
  /**
   * Subscribe to real-time task updates
   */
  subscribe(callback: TaskListener): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all subscribers of changes
   */
  private notifyListeners(): void {
    this.listeners.forEach((callback) => callback([...this.tasks]));
  }

  /**
   * Create a new task with Firestore-compatible structure
   */
  async createTask(taskData: CreateTaskData): Promise<TaskFields> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date().toISOString();
        const taskId = this.generateTaskId();

        const newTask: TaskFields = {
          dueDate: taskData.dueDate,
          userId: this.getUserId(),
          completed: false,
          task: taskData.task,
          taskId: taskId,
          priority: taskData.priority,
          createdAt: now,
          sectionId: null,
          createTime: now,
          updateTime: now,
        };

        this.tasks.push(newTask);
        this.notifyListeners();
        resolve(newTask);
      }, 300); // Simulate network delay
    });
  }

  /**
   * Update an existing task
   */
  async updateTask(
    taskId: string,
    updates: UpdateTaskData
  ): Promise<FirestoreTask | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const taskIndex = this.tasks.findIndex(
          (task) => task.taskId === taskId
        );

        if (taskIndex === -1) {
          resolve(null);
          return;
        }

        const now = new Date().toISOString();
        const task = this.tasks[taskIndex];

        // Update fields with proper typing
        Object.entries(updates).forEach(([key, value]) => {
          if (key === "completed" && typeof value === "boolean") {
            task.completed =  value ;
          } else if (key === "task" && typeof value === "string") {
            task.task = value
          } else if (key === "priority" && typeof value === "string") {
            task.priority = value;
          } else if (key === "dueDate" && typeof value === "string") {
            task.dueDate = value;
          }
        });

        task.updateTime = now;
        this.notifyListeners();
        resolve(task);
      }, 200);
    });
  }

  /**
   * Get tasks for a specific date
   */
  getTasksForDate(date: Date): FirestoreTask[] {
    const targetYear = date.getFullYear();
    const targetMonth = date.getMonth();
    const targetDay = date.getDate();

    return this.tasks.filter((task) => {
      const taskDate = new Date(task.dueDate!);
      return (
        taskDate.getFullYear() === targetYear &&
        taskDate.getMonth() === targetMonth &&
        taskDate.getDate() === targetDay
      );
    });
  }

  getAllTasks() {
    return [...this.tasks];
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const taskIndex = this.tasks.findIndex(
          (task) => task.taskId === taskId
        );

        if (taskIndex !== -1) {
          this.tasks.splice(taskIndex, 1);
          this.notifyListeners();
          resolve(true);
        } else {
          resolve(false);
        }
      }, 200);
    });
  }

  /**
   * Get tasks by priority
   */
  getTasksByPriority(priority: "low" | "medium" | "high"): FirestoreTask[] {
    return this.tasks.filter((task) => task.priority === priority);
  }

  /**
   * Get completed tasks
   */
  getCompletedTasks(): FirestoreTask[] {
    return this.tasks.filter((task) => task.completed === true);
  }

  /**
   * Get pending tasks
   */
  getPendingTasks(): FirestoreTask[] {
    return this.tasks.filter((task) => task.completed === false);
  }

  /**
   * Helper to extract string value from Firestore field
   */
  static getStringValue(field?: { stringValue?: string }): string {
    return field?.stringValue || "";
  }
  /**
   * Helper to extract boolean value from Firestore field
   */
  static getBooleanValue(field?: { booleanValue?: boolean }): boolean {
    return field?.booleanValue || false;
  }

  /**
   * Helper to extract timestamp value from Firestore field
   */
  static getTimestampValue(field?: { timestampValue?: string }): string {
    return field?.timestampValue || "";
  }
}

// Create and export singleton instance
export const taskService = new TaskService();

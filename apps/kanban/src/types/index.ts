export type Timer = {
  id: number
  name: string
  time: string
}

export interface TaskFields {
  dueDate: string;
  userId: string;
  completed: boolean;
  task: string;
  taskId: string;
  priority: string;
  createdAt: string;
  sectionId: null;
  createTime: string;
  updateTime: string;
}

export interface FirestoreTask extends TaskFields {
  createTime: string;
  updateTime: string;
}

export interface CreateTaskData {
  task: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UpdateTaskData {
  completed?: boolean;
  task?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export type TaskListener = (tasks: TaskFields[]) => void;
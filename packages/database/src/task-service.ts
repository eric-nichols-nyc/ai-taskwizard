import { supabase } from './supabaseClient';
import type { Task, Board, KanbanColumn, KanbanBoardData } from './types';
import { TaskCreateSchema } from './schemas';

export type CreateTaskPayload = Partial<Omit<Task, 'id' | 'created_at' | 'updated_at' | 'column_id' | 'position' | 'user_id'>> & { title: string };

export interface TaskService {
  getTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | null>;
  createTask(data: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | null>;
  deleteTask(id: string): Promise<boolean>;
  createTaskWithDefaults(data: CreateTaskPayload): Promise<Task>;
  getTasksByUserId(userId: string): Promise<Task[]>;
  getKanbanBoard(boardId: string, userId: string): Promise<KanbanColumn[]>;
  getUserDefaultBoard(userId: string): Promise<KanbanBoardData | null>;
  getBoardsByUser(userId: string): Promise<Board[]>;
  getTasksByUserIdAndDate(userId: string, date: string): Promise<Task[]>;
  // Add more methods as needed (e.g., getTasksByDate, getTasksByPriority)
}

export function createTaskService(): TaskService {
  return {
    async getTasks() {
      const { data, error } = await supabase.from('tasks').select('*');
      if (error) throw error;
      return data as Task[];
    },

    async getTaskById(id) {
      const { data, error } = await supabase.from('tasks').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Task;
    },

    async createTask(taskData) {
      console.log('service: createTask', taskData);
      try {
        // Validate input using TaskCreateSchema
        const parseResult = TaskCreateSchema.safeParse(taskData);
        if (!parseResult.success) {
          throw new Error(`Invalid task data: ${parseResult.error.message}`);
        }

        const { data, error } = await supabase.from('tasks').insert([parseResult.data]).select().single();

        if (error) {
          if (error.code === '23505') { // Unique constraint violation
            throw new Error('A task with these details already exists');
          }
          throw new Error(`Failed to create task: ${error.message}`);
        }

        if (!data) {
          throw new Error('No task data returned after creation');
        }

        return data as Task;

      } catch (err) {
        if (err instanceof Error) {
          throw err;
        }
        throw new Error('An unexpected error occurred while creating the task');
      }
    },

    async updateTask(id, updates) {
      const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as Task;
    },

    async deleteTask(id) {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      return true;
    },

    async createTaskWithDefaults({ title, ...rest }: CreateTaskPayload): Promise<Task> {
      // 1. Get the 'Todo' column id
      const { data: columns, error: columnError } = await supabase
        .from('columns')
        .select('id')
        .eq('name', 'Todo')
        .single();
      if (columnError || !columns?.id) {
        throw new Error("Could not find 'Todo' column");
      }
      const column_id = columns.id;

      // 2. Get max position in this column
      const { data: tasksInColumn, error: tasksError } = await supabase
        .from('tasks')
        .select('position')
        .eq('column_id', column_id)
        .order('position', { ascending: false })
        .limit(1);
      if (tasksError) {
        throw new Error('Could not fetch tasks for position calculation');
      }
      const position = (tasksInColumn?.[0]?.position ?? 0) + 1;

      // 3. Get user_id from session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.id) {
        throw new Error('Could not get user from session');
      }
      const user_id = user.id;

      // 4. Set defaults
      const status = rest.status ?? 'todo';
      const priority = rest.priority ?? 'Medium';
      const due_date = rest.due_date ?? new Date().toISOString().split('T')[0];

      // 5. Construct task
      const task = {
        title,
        column_id,
        position,
        status,
        priority,
        due_date,
        user_id,
        ...rest,
      };

      // 6. Insert into DB
      const { data, error } = await supabase.from('tasks').insert([task]).select().single();
      if (error) {
        throw new Error(error.message || 'Failed to insert task');
      }
      return data as Task;
    },

    async getTasksByUserId(userId) {
      try {
        const { data, error } = await supabase.from('tasks').select('*').eq('user_id', userId);
        if (error) {
          console.error('Error fetching tasks by user id:', error.message);
          throw new Error('Failed to fetch tasks for the user.');
        }
        return data ? (data as Task[]) : [];
      } catch (err) {
        console.error('Unexpected error in getTasksByUserId:', err);
        throw err;
      }
    },

    async getKanbanBoard(boardId: string, userId: string): Promise<KanbanColumn[]> {
      const { data: columns, error: columnsError } = await supabase
        .from('columns')
        .select('*')
        .eq('board_id', boardId)
        .order('position', { ascending: true });
      //console.log('getKanbanBoard - boardId:', boardId, 'userId:', userId, 'columns:', columns, 'columnsError:', columnsError);
      if (columnsError) throw new Error(columnsError.message);
      if (!columns || columns.length === 0) return [];

      const columnIds = columns.map((col: KanbanColumn) => col.id);
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .in('column_id', columnIds)
        .eq('user_id', userId)
        .order('position', { ascending: true });
      //console.log('getKanbanBoard - columnIds:', columnIds, 'tasks:', tasks, 'tasksError:', tasksError);
      if (tasksError) throw new Error(tasksError.message);

      const grouped = columns.map((column: KanbanColumn) => ({
        ...column,
        tasks: (tasks ?? []).filter((task: Task) => task.column_id === column.id),
      }));
      console.log('getKanbanBoard - grouped Kanban:', grouped);
      return grouped;
    },
// return the default board for the user (Personal)
    async getUserDefaultBoard(userId: string): Promise<KanbanBoardData | null> {
      const boardName = 'Personal';
      const { data, error } = await supabase
        .from('boards')
        .select(`
          id,
          name,
          description,
          columns!inner (
            id,
            name,
            position,
            board_id,
            tasks (
              id,
              title,
              description,
              position,
              column_id
            )
          )
        `)
        .eq('user_id', userId)
        .eq('name', boardName)
        .order('position', { referencedTable: 'columns', ascending: true })
        .order('position', { referencedTable: 'columns.tasks', ascending: true });

      console.log('getUserDefaultBoard - data:', data, 'error:', error);

      if (error) {
        throw new Error(error.message);
      }
      return transformNestedToFlat(data[0]);
    },
// return all boards for the user
    async getBoardsByUser(userId: string): Promise<Board[]> {
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      console.log('getBoardsByUser - userId:', userId, 'data:', data, 'error:', error);
      if (error) {
        throw new Error(error.message);
      }
      return data as Board[];
    },

    async getTasksByUserIdAndDate(userId, date) {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', userId)
          .eq('due_date', date);
        if (error) {
          console.error('Error fetching tasks by user id and date:', error.message);
          throw new Error('Failed to fetch tasks for the user and date.');
        }
        return data ? (data as Task[]) : [];
      } catch (err) {
        console.error('Unexpected error in getTasksByUserIdAndDate:', err);
        throw err;
      }
    },

  };

}

/**
 * Transform nested Supabase result to flat structure
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformNestedToFlat(boardData: any): KanbanBoardData {
  const board: Board = {
    id: boardData.id,
    name: boardData.name,
    description: boardData.description,
    user_id: boardData.user_id
  };

  const columns: KanbanColumn[] = boardData.columns.map((col: KanbanColumn) => ({
    id: col.id,
    board_id: col.board_id,
    name: col.name,
    position: col.position,
    user_id: boardData.user_id
  }));

  const tasks: Task[] = boardData.columns.flatMap((col: KanbanColumn) =>
    col.tasks.map((task: Task) => ({
      id: task.id,
      column_id: task.column_id,
      title: task.title,
      description: task.description,
      position: task.position,
      user_id: boardData.user_id
    }))
  );

  return { board, columns, tasks };
}

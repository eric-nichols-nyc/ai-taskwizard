import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateUser } from '../middleware/authenticateUser';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
//import { supabaseClient } from '@turbo-with-tailwind-v4/supabase';
import dotenv from 'dotenv';

dotenv.config();

const router: Router = Router();

// Example route
router.get('/users', asyncHandler(async (req, res) => {
  // Simulate async operation
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];

  res.json({
    success: true,
    data: users,
    message: 'Users fetched successfully'
  });
}));

router.post('/users', asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Simulate user creation
    const newUser = {
      id: Date.now(),
      name,
      email,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully'
    });
  }));

// Protected route: /user
router.get('/user', authenticateUser, (req, res) => {
  const user = (req as any).user;
  res.json({
    message: 'Authenticated! Here is your user info:',
    user: {
      id: user.id,
      email: user.email,
      aud: user.aud,
      role: user.role,
    }
  });
});

// Schemas
const CardSchema = z.object({
  id: z.string().uuid().optional(),
  column_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  position: z.number().int(),
  priority: z.enum(['Low', 'Medium', 'High']).nullable().optional(),
  due_date: z.string().nullable().optional(),
  user_id: z.string().uuid().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

const ColumnSchema = z.object({
  id: z.string().uuid().optional(),
  board_id: z.string().uuid(),
  name: z.string().min(1),
  position: z.number().int(),
  color: z.string().nullable().optional(),
  created_at: z.string().optional(),
});

const UpdateTaskSchema = z.object({
  column_id: z.string().uuid().optional(),
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  position: z.number().int().optional(),
  priority: z.enum(['Low', 'Medium', 'High']).nullable().optional(),
  due_date: z.string().nullable().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
});

// ==================== TASK ROUTES ====================

// Post a new task
router.post('/tasks', authenticateUser, asyncHandler(async (req, res) => {
    const parsedReq = CardSchema.safeParse(req.body);
    if (!parsedReq.success) {
        return res.status(400).json({ error: 'Invalid request body', details: parsedReq.error });
    }

    const { data } = parsedReq;
    const user = (req as any).user;


    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    try {
        const { data: inserted, error } = await supabase
            .from('tasks')
            .insert({
                ...data,
                user_id: user.id // Ensure task belongs to authenticated user
            })
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(201).json(inserted);
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
}));

// Get all tasks for authenticated user
router.get('/tasks', authenticateUser, asyncHandler(async (req, res) => {
    const user = (req as any).user;
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true });

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
}));

// Get tasks for a specific column (Kanban view)
router.get('/columns/:columnId/tasks', authenticateUser, asyncHandler(async (req, res) => {
    const { columnId } = req.params;
    const user = (req as any).user;
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // Validate columnId is UUID
    if (!z.string().uuid().safeParse(columnId).success) {
        return res.status(400).json({ error: 'Invalid column ID' });
    }

    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('column_id', columnId)
        .eq('user_id', user.id)
        .order('position', { ascending: true });

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
}));

// Update a task (for drag and drop, status changes, etc.)
router.put('/tasks/:taskId', authenticateUser, asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const user = (req as any).user;

    // Validate taskId is UUID
    if (!z.string().uuid().safeParse(taskId).success) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }

    const parsedReq = UpdateTaskSchema.safeParse(req.body);
    if (!parsedReq.success) {
        return res.status(400).json({ error: 'Invalid request body', details: parsedReq.error });
    }

    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    try {
        const { data: updated, error } = await supabase
            .from('tasks')
            .update({
                ...parsedReq.data,
                updated_at: new Date().toISOString()
            })
            .eq('id', taskId)
            .eq('user_id', user.id) // Ensure user owns the task
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (!updated) {
            return res.status(404).json({ error: 'Task not found or access denied' });
        }

        res.json(updated);
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
}));

// Delete a task
router.delete('/tasks/:taskId', authenticateUser, asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const user = (req as any).user;

    // Validate taskId is UUID
    if (!z.string().uuid().safeParse(taskId).success) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }

    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    try {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId)
            .eq('user_id', user.id); // Ensure user owns the task

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.status(204).send(); // No content response for successful deletion
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
}));

// ==================== COLUMN ROUTES ====================

// Get all columns for a board
router.get('/boards/:boardId/columns', authenticateUser, asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const user = (req as any).user;

    // Validate boardId is UUID
    if (!z.string().uuid().safeParse(boardId).success) {
        return res.status(400).json({ error: 'Invalid board ID' });
    }

    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    const { data, error } = await supabase
        .from('columns')
        .select('*')
        .eq('board_id', boardId)
        .order('position', { ascending: true });

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
}));

// Get Kanban data (columns with their tasks) - RECOMMENDED ENDPOINT
router.get('/boards/:boardId/kanban', authenticateUser, asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const user = (req as any).user;

    // Validate boardId is UUID
    if (!z.string().uuid().safeParse(boardId).success) {
        return res.status(400).json({ error: 'Invalid board ID' });
    }

    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    try {
        // Get columns for the board
        const { data: columns, error: columnsError } = await supabase
            .from('columns')
            .select('*')
            .eq('board_id', boardId)
            .order('position', { ascending: true });

        if (columnsError) {
            return res.status(500).json({ error: columnsError.message });
        }

        // Get all tasks for this board's columns that belong to the user
        const columnIds = columns.map(col => col.id);

        const { data: tasks, error: tasksError } = await supabase
            .from('tasks')
            .select('*')
            .in('column_id', columnIds)
            .eq('user_id', user.id)
            .order('position', { ascending: true });

        if (tasksError) {
            return res.status(500).json({ error: tasksError.message });
        }

        // Group tasks by column
        const kanbanData = columns.map(column => ({
            ...column,
            tasks: tasks.filter(task => task.column_id === column.id)
        }));

        res.json(kanbanData);
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
}));

// Create a new column
router.post('/columns', authenticateUser, asyncHandler(async (req, res) => {
    const parsedReq = ColumnSchema.safeParse(req.body);
    if (!parsedReq.success) {
        return res.status(400).json({ error: 'Invalid request body', details: parsedReq.error });
    }

    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    try {
        const { data: inserted, error } = await supabase
            .from('columns')
            .insert(parsedReq.data)
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(201).json(inserted);
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
}));

// ==================== BOARD ROUTES ====================

// Get user's boards
router.get('/boards', authenticateUser, asyncHandler(async (req, res) => {
    const user = (req as any).user;
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
}));

// Get Kanban data for the user's first board
router.get('/kanban/first', authenticateUser, asyncHandler(async (req, res) => {
    const user = (req as any).user;
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
// log user is
  console.log('user ======== ', user.id);
    // 1. Get the user's first board
    const { data: board, error: boardError } = await supabase
        .from('boards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();
    if (boardError) {
        return res.status(500).json({ error: boardError.message });
    }
    if (!board) {
        return res.status(404).json({ error: 'No boards found for user' });
    }
    const boardId = board.id;

    // 2. Get columns for the board
    const { data: columns, error: columnsError } = await supabase
        .from('columns')
        .select('*')
        .eq('board_id', boardId)
        .order('position', { ascending: true });
    if (columnsError) {
        return res.status(500).json({ error: columnsError.message });
    }
    if (!columns || columns.length === 0) {
        return res.json([]); // No columns, return empty array
    }

    // 3. Get all tasks for these columns and user
    const columnIds = columns.map(col => col.id);
    const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .in('column_id', columnIds)
        .eq('user_id', user.id)
        .order('position', { ascending: true });
    if (tasksError) {
        return res.status(500).json({ error: tasksError.message });
    }

    // 4. Group tasks by column
    const kanbanData = columns.map(column => ({
        ...column,
        tasks: (tasks ?? []).filter(task => task.column_id === column.id)
    }));

    res.json(kanbanData);
}));

export default router
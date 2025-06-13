import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateUser } from '../middleware/authenticateUser';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
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

// Protected route: /tasks
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

// CardSchema recreated locally
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

// Post a new task
router.post('/tasks', authenticateUser, asyncHandler(async (req, res) => {
    const parsedReq = CardSchema.safeParse(req.body);
    if (!parsedReq.success) {
        return res.status(400).json({ error: 'Invalid request body' });
    }
    const { data } = parsedReq;
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    try {
        const { data: inserted, error } = await supabase.from('tasks').insert(data).select().single();
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(201).json(inserted);
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
}));

// Get all tasks
router.get('/tasks', authenticateUser, asyncHandler(async (req, res) => {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
}));

export default router
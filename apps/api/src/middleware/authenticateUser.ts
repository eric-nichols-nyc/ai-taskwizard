import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role for server-side operations
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // For client auth verification

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables');
}

// Client for auth verification (respects RLS)
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Middleware to authenticate user via Supabase JWT
export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  console.log('[Auth] Authorization header:', authHeader);
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

  const token = authHeader.split(' ')[1];
  console.log('[Auth] Extracted token:', token);
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser(token);
    console.log('[Auth] Supabase user:', user, 'Error:', error);
    if (error || !user) return res.status(401).json({ error: 'Invalid token' });
    (req as any).user = user;
    next();
  } catch (err) {
    console.error('[Auth] Token verification failed:', err);
    return res.status(401).json({ error: 'Token verification failed' });
  }
} 
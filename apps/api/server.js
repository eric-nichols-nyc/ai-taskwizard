// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 8000;
// Initialize Supabase with service role key (server-side)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role for server-side operations
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // For client auth verification

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables');
}

// Server-side client with service role (bypasses RLS for admin operations)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Client for auth verification (respects RLS)
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Middleware

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory data store (replace with database later)
let items = [
  { id: 1, name: 'Sample Item 1', description: 'This is a sample item', createdAt: new Date().toISOString() },
  { id: 2, name: 'Sample Item 2', description: 'Another sample item', createdAt: new Date().toISOString() }
];
let nextId = 3;

// Middleware to authenticate user via Supabase JWT
async function authenticateUser(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token verification failed' });
  }
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// GET all items
app.get('/api/items', (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    let filteredItems = items;
    
    // Search functionality
    if (search) {
      filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);
    
    res.json({
      data: paginatedItems,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredItems.length / limit),
        totalItems: filteredItems.length,
        hasNext: endIndex < filteredItems.length,
        hasPrev: startIndex > 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items', message: error.message });
  }
});

// GET single item by ID
app.get('/api/items/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = items.find(item => item.id === id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ data: item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item', message: error.message });
  }
});

// POST create new item
app.post('/api/items', (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Validation
    if (!name || !description) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'Name and description are required' 
      });
    }
    
    const newItem = {
      id: nextId++,
      name: name.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    items.push(newItem);
    res.status(201).json({ data: newItem, message: 'Item created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item', message: error.message });
  }
});

// PUT update item by ID
app.put('/api/items/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Validation
    if (!name || !description) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'Name and description are required' 
      });
    }
    
    items[itemIndex] = {
      ...items[itemIndex],
      name: name.trim(),
      description: description.trim(),
      updatedAt: new Date().toISOString()
    };
    
    res.json({ data: items[itemIndex], message: 'Item updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item', message: error.message });
  }
});

// PATCH partial update item by ID
app.patch('/api/items/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Apply only provided updates
    const updatedItem = {
      ...items[itemIndex],
      ...updates,
      id: items[itemIndex].id, // Prevent ID change
      createdAt: items[itemIndex].createdAt, // Prevent createdAt change
      updatedAt: new Date().toISOString()
    };
    
    items[itemIndex] = updatedItem;
    res.json({ data: updatedItem, message: 'Item updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item', message: error.message });
  }
});

// DELETE item by ID
app.delete('/api/items/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const deletedItem = items.splice(itemIndex, 1)[0];
    res.json({ data: deletedItem, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item', message: error.message });
  }
});

// DELETE all items (bulk delete)
app.delete('/api/items', (req, res) => {
  try {
    const deletedCount = items.length;
    items = [];
    nextId = 1;
    
    res.json({ 
      message: `Successfully deleted ${deletedCount} items`,
      deletedCount 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete items', message: error.message });
  }
});

// Example protected route: /api/tasks
app.get('/api/tasks', authenticateUser, (req, res) => {
  // For now, just return some user info
  res.json({
    message: 'Authenticated! Here is your user info:',
    user: {
      id: req.user.id,
      email: req.user.email,
      aud: req.user.aud,
      role: req.user.role,
      // Add more fields as needed
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
});

module.exports = app;
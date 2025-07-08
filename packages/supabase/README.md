# @turbo-with-tailwind-v4/database-core

A pure Node.js/TypeScript package that provides database clients, schemas, services, and utilities for your monorepo. This package contains no React dependencies and can be safely imported by both server-side applications (like your Express API) and client-side applications.

## Features

- 🔧 **Database Clients**: Pre-configured Supabase and Prisma clients
- 📋 **Schemas**: Zod schemas for validation and type safety
- 🛠️ **Services**: Business logic layer with error handling
- 🔍 **Types**: Comprehensive TypeScript types
- 🚀 **Utilities**: Helper functions for common operations

## Installation

This package is part of your monorepo workspace. To use it in other packages:

```json
{
  "dependencies": {
    "@turbo-with-tailwind-v4/database-core": "workspace:*"
  }
}
```

## Usage

### In Your API (Express/Node.js)

```typescript
import { taskService, TaskSchema } from '@turbo-with-tailwind-v4/database-core';

// Create a new task
const newTask = await taskService.createTask({
  column_id: 'uuid-here',
  title: 'New Task',
  description: 'Task description',
  position: 1,
  priority: 'High'
});

// Get tasks with filtering and pagination
const result = await taskService.getTasks({
  column_id: 'uuid-here',
  page: 1,
  limit: 10,
  sort_by: 'created_at',
  sort_order: 'desc'
});
```

### Schema Validation

```typescript
import { CreateTaskSchema, TaskSchema } from '@turbo-with-tailwind-v4/database-core/schemas';

// Validate input data
const result = CreateTaskSchema.safeParse(requestBody);
if (!result.success) {
  // Handle validation errors
  console.error(result.error);
}
```

### Custom Service Usage

```typescript
import { TaskService } from '@turbo-with-tailwind-v4/database-core/services';
import { createServiceClient } from '@turbo-with-tailwind-v4/database-core/clients';

// Create a custom service instance with your own Supabase client
const customSupabase = createServiceClient();
const taskService = new TaskService(customSupabase);
```

## Package Structure

```
src/
├── clients/           # Database client configurations
│   ├── supabase.ts   # Supabase client setup
│   ├── prisma.ts     # Prisma client setup
│   └── index.ts
├── schemas/          # Zod validation schemas
│   ├── task.ts       # Task-related schemas
│   ├── user.ts       # User-related schemas
│   ├── common.ts     # Common/shared schemas
│   └── index.ts
├── services/         # Business logic layer
│   ├── base-service.ts    # Base service class
│   ├── task-service.ts    # Task operations
│   ├── user-service.ts    # User operations
│   └── index.ts
├── types/            # TypeScript type definitions
│   └── index.ts
├── utils/            # Utility functions
│   └── index.ts
└── index.ts          # Main package exports
```

## Environment Variables

Make sure these environment variables are set:

```bash
# Required
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key

# Required for server-side operations
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional (if using Prisma)
DATABASE_URL=your_database_url
```

## Available Services

### TaskService

- `createTask(data)` - Create a new task
- `getTaskById(id)` - Get task by ID
- `getTasks(query)` - Get tasks with filtering/pagination
- `updateTask(id, data)` - Update a task
- `deleteTask(id)` - Delete a task
- `updateTaskPositions(updates)` - Bulk update positions
- `getTasksByColumn(columnId)` - Get tasks for a column

### UserService

- `createUser(data)` - Create a new user
- `getUserById(id)` - Get user by ID
- `getUserByEmail(email)` - Get user by email
- `updateUser(id, data)` - Update a user
- `getUserProfile(id)` - Get public user profile
- `deleteUser(id)` - Delete a user

## Type Safety

All services return properly typed data based on Zod schemas:

```typescript
import type { Task, CreateTask, User } from '@turbo-with-tailwind-v4/database-core';

const task: Task = await taskService.getTaskById('uuid');
const newTask: CreateTask = {
  column_id: 'uuid',
  title: 'New Task',
  position: 1
};
```

## Error Handling

Services include built-in error handling and will throw descriptive errors:

```typescript
try {
  const task = await taskService.createTask(invalidData);
} catch (error) {
  // Handle validation or database errors
  console.error(error.message);
}
```
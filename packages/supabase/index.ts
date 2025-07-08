// Main exports for the database-core package

// Clients
export * from './clients/index.ts';

// Schemas and validation
export * from './schemas/index.ts';

// Services
export * from './services/index.ts';

// Types
export * from './types/index.ts';

// Utilities
export * from './utils/index.ts';

// Convenience re-exports for most common use cases
export { taskService } from './services/task-service.js';
export { userService } from './services/user-service.js';
export { supabaseClient, createServiceClient } from './clients/supabase.js';
export { prismaClient } from './clients/prisma.js';
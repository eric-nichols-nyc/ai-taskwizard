// Main exports for the database-core package

// Clients
export * from './src/clients/index.ts';

// Schemas and validation
export * from './src/schemas/index.ts';

// Services
export * from './src/services/index.ts';

// Types
export * from './src/types/index.ts';

// Utilities
export * from './src/utils/index.ts';

// Convenience re-exports for most common use cases
export { taskService } from './src/services/task-service.js';
export { userService } from './src/services/user-service.js';
export { supabaseClient, createServiceClient } from './src/clients/supabase.js';
export { prismaClient } from './src/clients/prisma.js';
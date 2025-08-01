import { PrismaClient } from '@prisma/client';

// Singleton pattern for Prisma client
declare global {
  var __prisma: PrismaClient | undefined;
}

export const prismaClient = globalThis.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prismaClient;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prismaClient.$disconnect();
});
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Cache Prisma client in global object to prevent multiple instances in serverless environments
// This is important for Vercel and other serverless platforms
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}


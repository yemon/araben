/**
 * Prisma client singleton for araben
 * Prevents multiple instances in development (Next.js hot reload)
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Every SQL query is printed only when PRISMA_LOG_QUERIES=1: the content
// loader runs a couple of dozen per load, which would bury the dev log.
const logQueries = process.env.PRISMA_LOG_QUERIES === '1';

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? [...(logQueries ? (['query'] as const) : []), 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

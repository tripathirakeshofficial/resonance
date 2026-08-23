import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from './env';

/**
 * Create a PostgreSQL adapter for Prisma.
 *
 * Prisma uses the DATABASE_URL environment variable
 * to connect to the PostgreSQL database.
 */
const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

/**
 * Extend the global object with an optional Prisma instance.
 *
 * This allows us to reuse the same Prisma Client instance
 * during development instead of creating a new instance
 * every time the application is reloaded.
 */
const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

/**
 * Reuse the existing Prisma Client if one already exists.
 *
 * If no client exists, create a new Prisma Client using
 * the PostgreSQL adapter.
 */
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

/**
 * In development, store the Prisma Client on the global object.
 *
 * Next.js can reload modules frequently during development.
 * Reusing the same Prisma instance prevents creating too many
 * database connections.
 *
 * In production, we don't need this global caching because
 * the application lifecycle is handled differently.
 */
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Export the Prisma Client so it can be reused throughout
 * the application for database queries.
 */
export { prisma };

import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function hasDatabaseContents(filename: string): boolean {
  if (!fs.existsSync(filename)) return false;
  try {
    return fs.statSync(filename).size > 0;
  } catch (error) {
    console.warn('[Vercel Demo DB] Could not inspect database file:', filename, error);
    return false;
  }
}

function copyBundledDatabase(source: string, destination: string): boolean {
  if (!hasDatabaseContents(source)) return false;
  try {
    fs.copyFileSync(source, destination);
    console.log(`[Vercel Demo DB] Successfully initialized /tmp/dev.db from ${source}`);
    return true;
  } catch (error) {
    console.error('[Vercel Demo DB] Error copying candidate to /tmp:', error);
    return false;
  }
}

function prepareDemoDatabase(): string | undefined {
  const tmpDir = process.env.VERCEL ? '/tmp' : os.tmpdir();
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const tmpDbPath = path.join(tmpDir, 'dev.db');
  if (hasDatabaseContents(tmpDbPath)) return tmpDbPath;

  const candidates = [
    path.join(process.cwd(), 'prisma', 'dev.db'),
    path.join(process.cwd(), 'dev.db'),
    path.resolve('./prisma/dev.db'),
    path.resolve('./dev.db'),
  ];
  if (candidates.some(candidate => copyBundledDatabase(candidate, tmpDbPath))) return tmpDbPath;
  return undefined;
}

function createPrismaClient(): PrismaClient {
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION);
  const databaseUrl = process.env.DATABASE_URL || '';

  if (isServerless && (!databaseUrl || databaseUrl.startsWith('file:'))) {
    try {
      const tmpDbPath = prepareDemoDatabase();
      if (tmpDbPath) return new PrismaClient({
        datasources: { db: { url: `file:${tmpDbPath}` } },
        log: ['error'],
      });
    } catch (error) {
      console.error('[Vercel Demo DB] Fallback initialization error:', error);
    }
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;


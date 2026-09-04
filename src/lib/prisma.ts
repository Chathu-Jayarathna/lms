import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * High-performance database query execution wrapper with short timeout fallback.
 * Prevents page hangs when PostgreSQL socket is connecting or offline.
 */
export async function executeDbQuery<T>(queryPromise: Promise<T>, timeoutMs = 150): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("DB_TIMEOUT")), timeoutMs);
  });

  try {
    return await Promise.race([queryPromise, timeoutPromise]);
  } finally {
    // @ts-ignore
    if (timer) clearTimeout(timer);
  }
}

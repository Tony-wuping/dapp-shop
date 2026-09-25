import { PrismaClient } from '@prisma/client';

// 创建一个全局的 PrismaClient 实例，防止在开发环境下重复创建连接导致内存溢出
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
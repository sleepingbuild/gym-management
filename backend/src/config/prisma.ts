import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
});

// Tạm thời comment phần middleware để tránh lỗi TypeScript
// if (process.env.NODE_ENV === 'development') {
//   prisma.$use(async (params, next) => {
//     const before = Date.now();
//     const result = await next(params);
//     const after = Date.now();
//     const duration = after - before;
//     
//     if (duration > 100) {
//       console.log(`⚠️ Slow query: ${params.model}.${params.action} took ${duration}ms`);
//     }
//     return result;
//   });
// }

export { prisma };

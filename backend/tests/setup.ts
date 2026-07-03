import dotenv from 'dotenv';
import { prisma } from '../src/config/prisma';

// Load test environment
dotenv.config({ path: '.env.test' });

beforeAll(async () => {
    await prisma.$connect();
});

afterAll(async () => {
    await prisma.$disconnect();
});

// Tạm thời comment để không xóa dữ liệu giữa các test
// afterEach(async () => {
//   const tables = ['Notification', 'Payment', 'ChatHistory', 'UserMembership', 'User', 'BodyProgress'];
//   for (const table of tables) {
//     try {
//       await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
//     } catch (error) {
//       // Table might not exist
//     }
//   }
// });
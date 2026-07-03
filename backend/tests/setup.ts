import dotenv from 'dotenv';
import { prisma } from '../src/config/prisma';

// Load test environment
dotenv.config({ path: '.env.test' });

// Global setup
beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Clean database after each test
afterEach(async () => {
  const tables = ['Notification', 'Payment', 'ChatHistory', 'UserMembership', 'User'];
  
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
    } catch (error) {
      // Table might not exist
    }
  }
});

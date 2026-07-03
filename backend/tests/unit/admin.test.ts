import request from 'supertest';
import app from '../../src/server';
import { prisma } from '../../src/config/prisma';
import bcrypt from 'bcryptjs';

describe('Admin API Tests', () => {
  const baseUrl = '/api/admin';
  let adminToken: string;

  beforeAll(async () => {
    // 1. Tạo admin user trực tiếp trong database
    const hashedPassword = await bcrypt.hash('Admin123456', 12);
    
    // Xóa user cũ nếu có (để tránh conflict)
    await prisma.user.deleteMany({
      where: { email: 'admin@test.com' },
    });

    // Tạo admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: hashedPassword,
        fullName: 'Admin Test',
        role: 'ADMIN',
        isActive: true,
      },
    });

    // 2. Login để lấy token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'Admin123456',
      });

    // Debug: log response nếu lỗi
    if (!loginRes.body.success) {
      console.error('Login failed:', loginRes.body);
    }

    adminToken = loginRes.body.data?.tokens?.accessToken;
  });

  describe('GET /api/admin/users', () => {
    it('should return users for admin', async () => {
      expect(adminToken).toBeDefined();

      const response = await request(app)
        .get(`${baseUrl}/users`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toBeDefined();
      expect(response.body.data.users.length).toBeGreaterThan(0);
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get(`${baseUrl}/users`)
        .expect(401);
    });
  });
});
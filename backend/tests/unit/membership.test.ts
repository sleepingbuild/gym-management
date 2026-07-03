import request from 'supertest';
import app from '../../src/server';

describe('Membership API Tests', () => {
  const baseUrl = '/api/memberships';

  describe('GET /api/memberships/plans', () => {
    it('should return all active plans', async () => {
      const response = await request(app)
        .get(`${baseUrl}/plans`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.plans).toBeDefined();
      expect(response.body.data.plans.length).toBeGreaterThan(0);
      
      const plan = response.body.data.plans[0];
      expect(plan).toHaveProperty('name');
      expect(plan).toHaveProperty('price');
      expect(plan).toHaveProperty('aiDailyLimit');
    });
  });
});
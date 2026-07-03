import request from 'supertest';
import app from '../../src/server';
import { TestHelpers } from '../helpers/testDb';

describe('API Integration Tests', () => {
    describe('End-to-End Flow', () => {
        it('should complete full user flow: register -> login -> create progress -> get stats', async () => {
            // 1. Register
            const registerRes = await request(app)
                .post('/api/auth/register')
                .send({
                    fullName: 'Flow Test User',
                    email: 'flow@test.com',
                    password: 'Test123456',
                    phone: '0123456789',
                })
                .expect(201);

            expect(registerRes.body.success).toBe(true);

            // 2. Login
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'flow@test.com',
                    password: 'Test123456',
                })
                .expect(200);

            const token = loginRes.body.data.tokens.accessToken;
            const headers = { Authorization: `Bearer ${token}` };

            // 3. Get plans
            const plansRes = await request(app)
                .get('/api/memberships/plans')
                .expect(200);

            const planId = plansRes.body.data.plans[0].id;

            // 4. Buy membership
            await request(app)
                .post('/api/memberships/buy')
                .send({ planId })
                .set(headers)
                .expect(201);

            // 5. Create progress record
            const progressRes = await request(app)
                .post('/api/body-progress')
                .send({
                    weight: 70.5,
                    height: 175,
                    notes: 'Integration test',
                })
                .set(headers)
                .expect(201);

            expect(progressRes.body.data.bmi).toBe(23);

            // 6. Get stats
            const statsRes = await request(app)
                .get('/api/body-progress/stats')
                .set(headers)
                .expect(200);

            expect(statsRes.body.data.totalRecords).toBeGreaterThan(0);
        });
    });

    describe('Error Handling', () => {
        it('should return 404 for non-existent route', async () => {
            const response = await request(app)
                .get('/api/non-existent-route')
                .expect(404);

            expect(response.body.errorCode).toBe('NOT_FOUND_001');
        });
    });

    describe('Response Format', () => {
        it('should follow standard response format for success', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect(200);

            // Health check response không có field 'success'
            expect(response.body).toHaveProperty('status');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('services');
            expect(response.body.services).toHaveProperty('database');
            expect(response.body.services).toHaveProperty('api');
        });

        it('should follow standard response format for error', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'wrong@test.com', password: 'wrong' })
                .expect(404);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('statusCode');
            expect(response.body).toHaveProperty('errorCode');
            expect(response.body).toHaveProperty('message');
        });
    });
});
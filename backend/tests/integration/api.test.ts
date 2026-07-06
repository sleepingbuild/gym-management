import request from "supertest";
import app from "../../src/server";
import { prisma } from "../../src/config/prisma";

describe("API Integration Tests", () => {
    // 👇 Dùng beforeEach
    beforeEach(async () => {
        const plans = [
            {
                id: "plan_basic",
                name: "Basic",
                price: 0,
                duration: 30,
                aiLimit: 10,
                aiDailyLimit: 1,
                description: "Test",
                isActive: true,
            },
            {
                id: "plan_premium",
                name: "Premium",
                price: 9.99,
                duration: 30,
                aiLimit: 100,
                aiDailyLimit: 10,
                description: "Test",
                isActive: true,
            },
        ];
        for (const plan of plans) {
            await prisma.membershipPlan.upsert({
                where: { id: plan.id },
                update: plan,
                create: plan,
            });
        }
    });

    describe("End-to-End Flow", () => {
        it("should complete full user flow: register → login → create progress → get stats", async () => {
            // 1. Register
            const registerRes = await request(app)
                .post("/api/auth/register")
                .send({
                    fullName: "Flow Test User",
                    email: "flow@test.com",
                    password: "Test123456",
                    phone: "0123456789",
                })
                .expect(201);

            expect(registerRes.body.success).toBe(true);

            // 2. Login
            const loginRes = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "flow@test.com",
                    password: "Test123456",
                })
                .expect(200);

            const token = loginRes.body.data.tokens.accessToken;
            const headers = { Authorization: `Bearer ${token}` };

            // 3. Get plans
            const plansRes = await request(app)
                .get("/api/memberships/plans")
                .expect(200);

            // Debug log
            console.log(
                "📦 Plans response:",
                JSON.stringify(plansRes.body, null, 2),
            );

            const planId = plansRes.body.data.plans.plans[0].id;

            // 4. Buy membership
            await request(app)
                .post("/api/memberships/buy")
                .send({ planId })
                .set(headers)
                .expect(201);

            // 5. Create progress record
            const progressRes = await request(app)
                .post("/api/body-progress")
                .send({
                    weight: 70.5,
                    height: 175,
                    notes: "Integration test",
                })
                .set(headers)
                .expect(201);

            expect(progressRes.body.data.bmi).toBe(23);

            // 6. Get stats
            const statsRes = await request(app)
                .get("/api/body-progress/stats")
                .set(headers)
                .expect(200);

            expect(statsRes.body.data.totalRecords).toBeGreaterThan(0);
        });
    });
});

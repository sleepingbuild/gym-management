import request from "supertest";
import app from "../../src/server";
import { prisma } from "../../src/config/prisma";
import bcrypt from "bcryptjs";

describe("Body Progress API Tests", () => {
    const baseUrl = "/api/body-progress";
    let headers: Record<string, string>;
    let userId: string;
    let testPlanId: string;

    // Tạo user và membership cho MỖI test
    beforeEach(async () => {
        // 1. Create test user
        const hashedPassword = await bcrypt.hash("Test123456", 12);
        const user = await prisma.user.create({
            data: {
                email: `progress-${Date.now()}@test.com`,
                password: hashedPassword,
                fullName: "Progress Test",
                role: "MEMBER",
                isActive: true,
            },
        });
        userId = user.id;

        // 2. Get or create plan
        let plan = await prisma.membershipPlan.findFirst({
            where: { name: "Basic" },
        });
        if (!plan) {
            plan = await prisma.membershipPlan.create({
                data: {
                    id: "plan_basic",
                    name: "Basic",
                    price: 0,
                    duration: 30,
                    aiLimit: 10,
                    aiDailyLimit: 1,
                    description: "Test plan",
                    isActive: true,
                },
            });
        }
        testPlanId = plan.id;

        // 3. Create membership
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        await prisma.userMembership.create({
            data: {
                userId: user.id,
                planId: testPlanId,
                expiryDate,
                status: "ACTIVE",
                aiUsageCount: 0,
                aiDailyCount: 0,
                aiUsageReset: new Date(),
                aiDailyReset: new Date(),
            },
        });

        // 4. Login
        const loginRes = await request(app).post("/api/auth/login").send({
            email: user.email,
            password: "Test123456",
        });

        headers = {
            Authorization: `Bearer ${loginRes.body.data.tokens.accessToken}`,
            "Content-Type": "application/json",
        };
    });

    // Cleanup sau mỗi test
    afterEach(async () => {
        await prisma.userMembership.deleteMany({ where: { userId } });
        await prisma.bodyProgress.deleteMany({ where: { userId } });
        await prisma.user.delete({ where: { id: userId } });
    });

    afterAll(async () => {
        try {
            await prisma.userMembership.deleteMany({ where: { userId } });
            await prisma.bodyProgress.deleteMany({ where: { userId } });
            await prisma.user.delete({ where: { id: userId } });
            await prisma.membershipPlan.delete({ where: { id: testPlanId } });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // Ignore cleanup errors
        }
    });

    it("should create a progress record with BMI calculation", async () => {
        const response = await request(app)
            .post(baseUrl)
            .send({
                weight: 70.5,
                height: 175,
                bodyFat: 18.5,
                muscleMass: 32.0,
                notes: "Test measurement",
            })
            .set(headers)
            .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty("id");
        expect(response.body.data.weight).toBe(70.5);
        expect(response.body.data.bmi).toBe(23);
    });

    it("should get all progress records", async () => {
        // Create a record with fresh headers
        const response = await request(app)
            .post(baseUrl)
            .send({ weight: 71, height: 175, notes: "Another" })
            .set(headers)
            .expect(201);

        expect(response.body.success).toBe(true);

        // Get all records
        const getResponse = await request(app)
            .get(baseUrl)
            .set(headers)
            .expect(200);

        expect(getResponse.body.success).toBe(true);
        expect(getResponse.body.data.records).toBeDefined();
        expect(getResponse.body.data.records.length).toBeGreaterThan(0);
    });

    it("should get latest progress record", async () => {
        const response = await request(app)
            .get(baseUrl + "/latest")
            .set(headers)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    });

    it("should get progress stats", async () => {
        const response = await request(app)
            .get(baseUrl + "/stats")
            .set(headers)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        if (response.body.data) {
            expect(response.body.data.totalRecords).toBeGreaterThan(0);
        }
    });

    it("should get chart data", async () => {
        const response = await request(app)
            .get(baseUrl + "/chart?days=30")
            .set(headers)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty("labels");
        expect(response.body.data).toHaveProperty("datasets");
    });

    it("should return 401 without authentication", async () => {
        const response = await request(app)
            .post(baseUrl)
            .send({ weight: 70 })
            .expect(401);

        expect(response.body.success).toBe(false);
    });
});

import request from "supertest";
import app from "../../src/server";
import { prisma } from "../../src/config/prisma";

describe("Membership API Tests", () => {
    const baseUrl = "/api/memberships";

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

    it("should return all active plans", async () => {
        const response = await request(app).get("/api/memberships/plans");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        // sửa chỗ này
        const plans = response.body.data.plans.plans;

        expect(Array.isArray(plans)).toBe(true);
        expect(plans.length).toBeGreaterThan(0);

        const plan = plans[0];

        expect(plan).toHaveProperty("name");
        expect(plan).toHaveProperty("price");
        expect(plan).toHaveProperty("aiDailyLimit");
    });
});

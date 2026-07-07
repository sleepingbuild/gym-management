import dotenv from "dotenv";
import { prisma } from "../src/config/prisma";

// Load test environment
dotenv.config({ path: ".env.test" });

beforeAll(async () => {
    await prisma.$connect();
});

afterAll(async () => {
    await prisma.$disconnect();
});

afterEach(async () => {
    const tables = [
        "Attendance",
        "BodyGoal",
        "BodyProgress",
        "ChatHistory",
        "Notification",
        "Payment",
        "UserMembership",
        "User",
    ];

    for (const table of tables) {
        try {
            await prisma.$executeRawUnsafe(
                `TRUNCATE TABLE "${table}" CASCADE;`,
            );
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // Table might not exist
        }
    }
});

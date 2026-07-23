/* eslint-disable prettier/prettier */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding membership plans...");

    // Upsert để tránh duplicate khi chạy seed nhiều lần
    const basic = await prisma.membershipPlan.upsert({
        where: { id: "plan_basic" },
        update: {},
        create: {
            id: "plan_basic",
            name: "Basic",
            price: 0,
            duration: 30,
            aiLimit: -1,
            aiDailyLimit: 10,
            description: "Gói miễn phí — tối đa 10 tin/ngày",
            isActive: true,
        },
    });

    const premium = await prisma.membershipPlan.upsert({
        where: { id: "plan_premium" },
        update: {},
        create: {
            id: "plan_premium",
            name: "Premium",
            price: 199000,
            duration: 30,
            aiLimit: -1,
            aiDailyLimit: 100,
            description: "Gói tiêu chuẩn — tối đa 100 tin/ngày",
            isActive: true,
        },
    });

    const elite = await prisma.membershipPlan.upsert({
        where: { id: "plan_elite" },
        update: {},
        create: {
            id: "plan_elite",
            name: "Elite",
            price: 599000,
            duration: 30,
            aiLimit: -1, // -1 = Unlimited
            aiDailyLimit: -1,
            description: "Gói cao cấp — Không giới hạn AI, đầy đủ tính năng",
            isActive: true,
        },
    });

    console.log("✅ Seeded plans:", { basic, premium, elite });
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

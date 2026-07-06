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
            aiLimit: 10,
            aiDailyLimit: 1,
            description:
                "Gói miễn phí — 10 tin nhắn AI/tháng, tối đa 1 tin/ngày",
            isActive: true,
        },
    });

    const premium = await prisma.membershipPlan.upsert({
        where: { id: "plan_premium" },
        update: {},
        create: {
            id: "plan_premium",
            name: "Premium",
            price: 9.99,
            duration: 30,
            aiLimit: 100,
            aiDailyLimit: 10,
            description:
                "Gói tiêu chuẩn — 100 tin nhắn AI/tháng, tối đa 10 tin/ngày",
            isActive: true,
        },
    });

    const elite = await prisma.membershipPlan.upsert({
        where: { id: "plan_elite" },
        update: {},
        create: {
            id: "plan_elite",
            name: "Elite",
            price: 29.99,
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

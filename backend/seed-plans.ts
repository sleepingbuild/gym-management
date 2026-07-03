import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding membership plans...');

  const plans = [
    {
      id: 'plan_basic',
      name: 'Basic',
      price: 0,
      duration: 30,
      aiLimit: 10,
      aiDailyLimit: 1,
      description: 'Goi mien phi - 10 tin nhan AI/thang, toi da 1 tin/ngay',
      isActive: true,
    },
    {
      id: 'plan_premium',
      name: 'Premium',
      price: 9.99,
      duration: 30,
      aiLimit: 100,
      aiDailyLimit: 10,
      description: 'Goi tieu chuan - 100 tin nhan AI/thang, toi da 10 tin/ngay',
      isActive: true,
    },
    {
      id: 'plan_elite',
      name: 'Elite',
      price: 29.99,
      duration: 30,
      aiLimit: -1,
      aiDailyLimit: -1,
      description: 'Goi cao cap - Khong gioi han AI, day du tinh nang',
      isActive: true,
    },
  ];

  for (const plan of plans) {
    const existing = await prisma.membershipPlan.findUnique({
      where: { id: plan.id },
    });

    if (!existing) {
      await prisma.membershipPlan.create({
        data: plan,
      });
      console.log('Created plan:', plan.name);
    } else {
      console.log('Plan already exists:', plan.name);
    }
  }

  const count = await prisma.membershipPlan.count();
  console.log('Total plans:', count);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.());

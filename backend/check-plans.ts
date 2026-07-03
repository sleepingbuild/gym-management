import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Kiểm tra plans
  const plans = await prisma.membershipPlan.findMany();
  console.log('📊 Plans in database:', JSON.stringify(plans, null, 2));
  
  if (plans.length === 0) {
    console.log('⚠️ No plans found! Seeding...');
    
    // Seed plans
    const seedPlans = [
      { id: 'plan_basic', name: 'Basic', price: 0, duration: 30, aiLimit: 10, aiDailyLimit: 1, description: 'Gói miễn phí', isActive: true },
      { id: 'plan_premium', name: 'Premium', price: 9.99, duration: 30, aiLimit: 100, aiDailyLimit: 10, description: 'Gói tiêu chuẩn', isActive: true },
      { id: 'plan_elite', name: 'Elite', price: 29.99, duration: 30, aiLimit: -1, aiDailyLimit: -1, description: 'Gói cao cấp', isActive: true },
    ];
    
    for (const plan of seedPlans) {
      await prisma.membershipPlan.upsert({
        where: { id: plan.id },
        update: plan,
        create: plan,
      });
      console.log(\✅ Created: \\);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.\());

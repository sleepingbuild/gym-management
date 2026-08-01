import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const adminPass = await bcrypt.hash('Admin123456', 10);
  const memberPass = await bcrypt.hash('Member123456', 10);
  const ptPass = await bcrypt.hash('Trainer123456', 10);

  // 1. Admin
  await prisma.user.upsert({
    where: { email: 'admin@ironfit.com' },
    update: {},
    create: {
      email: 'admin@ironfit.com',
      password: adminPass,
      fullName: 'Admin',
      role: 'ADMIN',
      emailVerified: true,
      agreedToTermsAt: now,
    },
  });

  // 2. Membership plan mặc định (để gán cho member) — tạo nếu chưa có
  let plan = await prisma.membershipPlan.findFirst();
  if (!plan) {
    plan = await prisma.membershipPlan.create({
      data: {
        name: 'Gói Cơ Bản',
        price: 300000,
        duration: 30,
        aiLimit: 100,
        aiDailyLimit: 5,
        description: 'Gói test seed',
        isActive: true,
      },
    });
  }

  // 3. Member đợt 1 (member1-3)
  const memberBatch1 = ['Hội Viên Test 1', 'Hội Viên Test 2', 'Hội Viên Test 3'];
  const members1 = [];
  for (let i = 0; i < memberBatch1.length; i++) {
    const email = `member${i + 1}@ironfit.com`;
    const m = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: memberPass,
        fullName: memberBatch1[i],
        role: 'MEMBER',
        emailVerified: true,
        agreedToTermsAt: now,
      },
    });
    members1.push(m);
  }

  // 4. Member đợt 2 (member4-10)
  const memberBatch2 = [
    'Nguyễn Thị Lan', 'Trần Văn Bình', 'Lê Thị Hoa',
    'Phạm Văn Nam', 'Vũ Thị Thu', 'Đặng Văn Long', 'Bùi Thị Ngọc',
  ];
  const members2 = [];
  for (let i = 0; i < memberBatch2.length; i++) {
    const email = `member${i + 4}@ironfit.com`;
    const m = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: memberPass,
        fullName: memberBatch2[i],
        role: 'MEMBER',
        emailVerified: true,
        agreedToTermsAt: now,
      },
    });
    members2.push(m);
  }

  // 5. Gán membership cho vài member (đợt 1: 2 người, đợt 2: 4 người đầu)
  const membersWithPlan = [...members1.slice(0, 2), ...members2.slice(0, 4)];
  for (const m of membersWithPlan) {
    const existing = await prisma.userMembership.findUnique({ where: { userId: m.id } });
    if (!existing) {
      await prisma.userMembership.create({
        data: {
          userId: m.id,
          planId: plan.id,
          expiryDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          status: 'ACTIVE',
        },
      });
    }
  }

  // 6. PT — pt.demo + pt2, pt3 + pt4, pt5, pt6
  const trainerConfigs = [
    { email: 'pt.demo@ironfit.com', fullName: 'Trần Văn Huấn', specialties: 'Gym cơ bản, Tăng cơ, Giảm cân' },
    { email: 'pt2@ironfit.com', fullName: 'Lê Minh Đức', specialties: 'Powerlifting, Sức mạnh' },
    { email: 'pt3@ironfit.com', fullName: 'Trần Thị Mai', specialties: 'Yoga, Giảm cân' },
    { email: 'pt4@ironfit.com', fullName: 'Hoàng Văn Sơn', specialties: 'Cardio, Giảm cân' },
    { email: 'pt5@ironfit.com', fullName: 'Ngô Thị Duyên', specialties: 'Yoga, Pilates' },
    { email: 'pt6@ironfit.com', fullName: 'Đỗ Văn Kiên', specialties: 'Tăng cơ, Powerlifting' },
  ];
  const trainers = [];
  for (const cfg of trainerConfigs) {
    const t = await prisma.user.upsert({
      where: { email: cfg.email },
      update: {},
      create: {
        email: cfg.email,
        password: ptPass,
        fullName: cfg.fullName,
        role: 'PT',
        emailVerified: true,
        agreedToTermsAt: now,
        trainerProfile: {
          create: { specialties: cfg.specialties, status: 'ACTIVE' },
        },
      },
    });
    trainers.push(t);

    // Lịch làm việc cho mỗi PT (bỏ qua nếu đã có)
    const existingSchedule = await prisma.trainerSchedule.findFirst({ where: { trainerId: t.id } });
    if (!existingSchedule) {
      await prisma.trainerSchedule.create({
        data: { trainerId: t.id, type: 'RECURRING', dayOfWeek: 2, startTime: '07:00', endTime: '11:00' },
      });
      const specificDate = new Date(now);
      specificDate.setDate(specificDate.getDate() + 3);
      await prisma.trainerSchedule.create({
        data: {
          trainerId: t.id, type: 'SPECIFIC_DATE', specificDate,
          startTime: '14:00', endTime: '18:00', notes: 'Ca đặc biệt cuối tuần',
        },
      });
    }
  }

  // 7. Booking test đa dạng — chỉ tạo nếu chưa có booking nào (tránh nhân bản mỗi lần chạy lại)
  const existingBookingCount = await prisma.booking.count();
  if (existingBookingCount === 0) {
    const allMembers = [...members1, ...members2];
    const statuses: ('PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED')[] = [
      'COMPLETED', 'COMPLETED', 'CONFIRMED', 'CONFIRMED', 'PENDING', 'PENDING', 'CANCELLED',
      'COMPLETED', 'CONFIRMED', 'PENDING',
    ];
    const dayOffsets = [-4, -2, 0, 1, 2, 3, 5, -1, 4, 6];
    const timeSlots = ['07:00-08:00', '09:00-10:00', '17:00-18:00', '18:00-19:00', '19:00-20:00'];

    for (let i = 0; i < allMembers.length; i++) {
      const trainer = trainers[i % trainers.length];
      const date = new Date(now);
      date.setDate(date.getDate() + dayOffsets[i % dayOffsets.length]);

      await prisma.booking.create({
        data: {
          memberId: allMembers[i].id,
          trainerId: trainer.id,
          date,
          timeSlot: timeSlots[i % timeSlots.length],
          status: statuses[i % statuses.length],
          age: 22 + i,
        },
      });
    }
  }

  console.log('✅ Seed hoàn tất');
  console.log(`Admin: admin@ironfit.com / Admin123456`);
  console.log(`Members: ${members1.length + members2.length} tài khoản, password: Member123456`);
  console.log(`Trainers: ${trainers.length} tài khoản, password: Trainer123456`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
import { prisma } from './src/config/prisma';

async function testPerformance() {
  console.log('Testing query performance...');
  console.log('');

  // 1. Test User query by email
  console.log('1. Query User by email:');
  const start1 = Date.now();
  const user = await prisma.user.findUnique({
    where: { email: 'admin@ironfit.com' },
  });
  const time1 = Date.now() - start1;
  console.log('   Found:', user?.email || 'Not found');
  console.log('   Time:', time1 + 'ms');
  console.log('');

  // 2. Test UserMembership query
  console.log('2. Query UserMembership by status:');
  const start2 = Date.now();
  const memberships = await prisma.userMembership.findMany({
    where: { status: 'ACTIVE' },
    take: 10,
  });
  const time2 = Date.now() - start2;
  console.log('   Found:', memberships.length + ' records');
  console.log('   Time:', time2 + 'ms');
  console.log('');

  // 3. Test BodyProgress query with order
  console.log('3. Query BodyProgress by userId with order:');
  const start3 = Date.now();
  const progress = await prisma.bodyProgress.findMany({
    where: { userId: user?.id || '' },
    orderBy: { recordedAt: 'desc' },
    take: 10,
  });
  const time3 = Date.now() - start3;
  console.log('   Found:', progress.length + ' records');
  console.log('   Time:', time3 + 'ms');
  console.log('');

  console.log('Performance Summary:');
  console.log('   User query:', time1 + 'ms');
  console.log('   Membership query:', time2 + 'ms');
  console.log('   Progress query:', time3 + 'ms');

  await prisma.$disconnect();
}

testPerformance();
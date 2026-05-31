import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("1. Bắt đầu seed");

  console.log("2. Kết nối DB");
  await prisma.$connect();

  console.log("3. Chuẩn bị insert");

  await prisma.membershipPackage.createMany({
    data: [
      {
        name: "Basic",
        description: "Gói cơ bản",
        price: 300000,
        duration: 30,
      },
      {
        name: "Premium",
        description: "Gói nâng cao",
        price: 600000,
        duration: 30,
      },
      {
        name: "VIP",
        description: "Gói VIP",
        price: 1000000,
        duration: 30,
      },
    ],
  });

  console.log("4. Seed thành công");
}

main()
  .catch((error) => {
    console.error("Lỗi:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("5. Đã ngắt kết nối");
  });
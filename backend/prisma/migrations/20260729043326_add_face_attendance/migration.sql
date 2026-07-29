-- CreateEnum
CREATE TYPE "CheckInMethod" AS ENUM ('MANUAL', 'QR', 'FACE');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "checkInMethod" "CheckInMethod",
ADD COLUMN     "checkInTime" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "TrainerCheckIn" ADD COLUMN     "method" "CheckInMethod" NOT NULL DEFAULT 'MANUAL';

-- CreateTable
CREATE TABLE "FaceProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "descriptor" DOUBLE PRECISION[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FaceProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FaceProfile_userId_key" ON "FaceProfile"("userId");

-- AddForeignKey
ALTER TABLE "FaceProfile" ADD CONSTRAINT "FaceProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

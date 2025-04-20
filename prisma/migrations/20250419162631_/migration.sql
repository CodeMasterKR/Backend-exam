/*
  Warnings:

  - You are about to drop the column `masterServiceId` on the `Master` table. All the data in the column will be lost.
  - You are about to drop the column `toolId` on the `MasterService` table. All the data in the column will be lost.
  - Made the column `experience` on table `Master` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `Master` required. This step will fail if there are existing NULL values in that column.
  - Made the column `passportImage` on table `Master` required. This step will fail if there are existing NULL values in that column.
  - Made the column `about` on table `Master` required. This step will fail if there are existing NULL values in that column.
  - Made the column `masterCategoryId` on table `Master` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `masterId` to the `MasterService` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Master" DROP CONSTRAINT "Master_masterCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Master" DROP CONSTRAINT "Master_masterServiceId_fkey";

-- AlterTable
ALTER TABLE "Master" DROP COLUMN "masterServiceId",
ALTER COLUMN "experience" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "passportImage" SET NOT NULL,
ALTER COLUMN "about" SET NOT NULL,
ALTER COLUMN "masterCategoryId" SET NOT NULL;

-- AlterTable
ALTER TABLE "MasterService" DROP COLUMN "toolId",
ADD COLUMN     "masterId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Master" ADD CONSTRAINT "Master_masterCategoryId_fkey" FOREIGN KEY ("masterCategoryId") REFERENCES "MasterCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterService" ADD CONSTRAINT "MasterService_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "Master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

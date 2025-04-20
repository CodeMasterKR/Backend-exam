/*
  Warnings:

  - You are about to drop the `levelItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "levelItem" DROP CONSTRAINT "levelItem_levelId_fkey";

-- DropForeignKey
ALTER TABLE "levelItem" DROP CONSTRAINT "levelItem_masterCategoryId_fkey";

-- AlterTable
ALTER TABLE "Level" ADD COLUMN     "masterCategoryId" TEXT;

-- DropTable
DROP TABLE "levelItem";

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_masterCategoryId_fkey" FOREIGN KEY ("masterCategoryId") REFERENCES "MasterCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

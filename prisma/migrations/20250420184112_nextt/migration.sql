/*
  Warnings:

  - You are about to drop the column `toolId` on the `toolItem` table. All the data in the column will be lost.
  - Added the required column `levelId` to the `masterCategoryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toolAttributeId` to the `toolItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "masterCategoryItem" DROP CONSTRAINT "masterCategoryItem_masterCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "toolItem" DROP CONSTRAINT "toolItem_toolId_fkey";

-- AlterTable
ALTER TABLE "masterCategoryItem" ADD COLUMN     "levelId" TEXT NOT NULL,
ALTER COLUMN "masterCategoryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "toolItem" DROP COLUMN "toolId",
ADD COLUMN     "toolAttributeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "toolItem" ADD CONSTRAINT "toolItem_toolAttributeId_fkey" FOREIGN KEY ("toolAttributeId") REFERENCES "toolAttribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "masterCategoryItem" ADD CONSTRAINT "masterCategoryItem_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "masterCategoryItem" ADD CONSTRAINT "masterCategoryItem_masterCategoryId_fkey" FOREIGN KEY ("masterCategoryId") REFERENCES "MasterCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `professionId` on the `Level` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Level" DROP COLUMN "professionId";

-- CreateTable
CREATE TABLE "levelItem" (
    "id" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "masterCategoryId" TEXT NOT NULL,

    CONSTRAINT "levelItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "levelItem" ADD CONSTRAINT "levelItem_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "levelItem" ADD CONSTRAINT "levelItem_masterCategoryId_fkey" FOREIGN KEY ("masterCategoryId") REFERENCES "MasterCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `masterCategoryId` on the `masterCategoryItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "masterCategoryItem" DROP CONSTRAINT "masterCategoryItem_masterCategoryId_fkey";

-- AlterTable
ALTER TABLE "masterCategoryItem" DROP COLUMN "masterCategoryId";

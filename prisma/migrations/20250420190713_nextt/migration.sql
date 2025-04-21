/*
  Warnings:

  - You are about to drop the column `masterCategoryId` on the `Cart` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_masterCategoryId_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "masterCategoryId";

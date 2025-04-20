/*
  Warnings:

  - You are about to drop the column `masterCategoryId` on the `Master` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Master" DROP CONSTRAINT "Master_masterCategoryId_fkey";

-- AlterTable
ALTER TABLE "Master" DROP COLUMN "masterCategoryId";

/*
  Warnings:

  - You are about to drop the column `levelId` on the `MasterCategory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MasterCategory" DROP CONSTRAINT "MasterCategory_levelId_fkey";

-- AlterTable
ALTER TABLE "MasterCategory" DROP COLUMN "levelId";

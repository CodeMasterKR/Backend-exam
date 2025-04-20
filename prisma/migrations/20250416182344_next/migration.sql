/*
  Warnings:

  - Made the column `icon` on table `MasterCategory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `minWorkingHourlyPrice` on table `MasterCategory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `minPriceDaily` on table `MasterCategory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MasterCategory" ALTER COLUMN "icon" SET NOT NULL,
ALTER COLUMN "minWorkingHourlyPrice" SET NOT NULL,
ALTER COLUMN "minPriceDaily" SET NOT NULL;

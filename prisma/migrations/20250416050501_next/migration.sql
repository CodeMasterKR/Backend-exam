-- CreateEnum
CREATE TYPE "userStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userStatus" "userStatus" NOT NULL DEFAULT 'INACTIVE';

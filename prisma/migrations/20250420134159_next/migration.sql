/*
  Warnings:

  - You are about to drop the column `attributeId` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `parentCategoryId` on the `ToolCategory` table. All the data in the column will be lost.
  - Added the required column `name` to the `Attribute` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attribute" DROP CONSTRAINT "Attribute_productId_fkey";

-- DropForeignKey
ALTER TABLE "ToolCategory" DROP CONSTRAINT "ToolCategory_parentCategoryId_fkey";

-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "attributeId",
DROP COLUMN "productId",
DROP COLUMN "value",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ToolCategory" DROP COLUMN "parentCategoryId";

-- CreateTable
CREATE TABLE "toolAttribute" (
    "id" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "toolAttribute_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "toolAttribute" ADD CONSTRAINT "toolAttribute_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toolAttribute" ADD CONSTRAINT "toolAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

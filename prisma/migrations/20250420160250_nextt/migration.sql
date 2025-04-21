/*
  Warnings:

  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_toolId_fkey";

-- DropTable
DROP TABLE "CartItem";

-- CreateTable
CREATE TABLE "toolItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "toolItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "masterCategoryItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "masterCategoryId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "masterCategoryItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "toolItem" ADD CONSTRAINT "toolItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toolItem" ADD CONSTRAINT "toolItem_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "masterCategoryItem" ADD CONSTRAINT "masterCategoryItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "masterCategoryItem" ADD CONSTRAINT "masterCategoryItem_masterCategoryId_fkey" FOREIGN KEY ("masterCategoryId") REFERENCES "MasterCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

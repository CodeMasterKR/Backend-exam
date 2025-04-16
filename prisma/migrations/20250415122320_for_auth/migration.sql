-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('ADMIN', 'SUPERADMIN', 'VIEWERADMIN', 'JISMONIY', 'YURIDIK');

-- CreateEnum
CREATE TYPE "paymentStatus" AS ENUM ('PENDING', 'PAID', 'NOTPAID', 'REFUSED');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "userRole" "userRole" NOT NULL,
    "TIN" TEXT,
    "bankCode" TEXT,
    "bankAccountNumber" TEXT,
    "economicActivityCode" TEXT,
    "bankName" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "paymentStatus" "paymentStatus" NOT NULL DEFAULT 'PENDING',
    "withDelivery" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL,
    "commentToDelivery" TEXT,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Carts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "masterCategoryId" TEXT NOT NULL,

    CONSTRAINT "Carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItems" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "CartItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tools" (
    "id" TEXT NOT NULL,
    "name_uz" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "desc_uz" TEXT,
    "desc_en" TEXT,
    "desc_ru" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "brand" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "image" TEXT,
    "toolSubCategoryId" TEXT NOT NULL,
    "toolReviewId" TEXT,

    CONSTRAINT "Tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolCategory" (
    "id" TEXT NOT NULL,
    "name_uz" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "desc_uz" TEXT,
    "desc_en" TEXT,
    "desc_ru" TEXT,
    "icon" TEXT,
    "parentCategoryId" TEXT,

    CONSTRAINT "ToolCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attributes" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterCategory" (
    "id" TEXT NOT NULL,
    "name_uz" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "icon" TEXT,
    "minWorkingHourlyPrice" DOUBLE PRECISION,
    "minPriceDaily" DOUBLE PRECISION,
    "toolId" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,

    CONSTRAINT "MasterCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Masters" (
    "id" TEXT NOT NULL,
    "masterServiceId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "dateBirth" TIMESTAMP(3) NOT NULL,
    "experience" INTEGER,
    "image" TEXT,
    "passportImage" TEXT,
    "star" DOUBLE PRECISION,
    "about" TEXT,
    "masterCategoryId" TEXT,

    CONSTRAINT "Masters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterService" (
    "id" TEXT NOT NULL,
    "masterCategoryId" TEXT NOT NULL,
    "minWorkingHours" INTEGER,
    "priceHourly" DOUBLE PRECISION,
    "priceDaily" DOUBLE PRECISION,
    "experience" INTEGER,
    "toolId" TEXT,

    CONSTRAINT "MasterService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Level" (
    "id" TEXT NOT NULL,
    "name_uz" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "professionId" TEXT NOT NULL,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carts" ADD CONSTRAINT "Carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carts" ADD CONSTRAINT "Carts_masterCategoryId_fkey" FOREIGN KEY ("masterCategoryId") REFERENCES "MasterCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tools" ADD CONSTRAINT "Tools_toolSubCategoryId_fkey" FOREIGN KEY ("toolSubCategoryId") REFERENCES "ToolCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolCategory" ADD CONSTRAINT "ToolCategory_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "ToolCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attributes" ADD CONSTRAINT "Attributes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Tools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterCategory" ADD CONSTRAINT "MasterCategory_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Masters" ADD CONSTRAINT "Masters_masterServiceId_fkey" FOREIGN KEY ("masterServiceId") REFERENCES "MasterService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Masters" ADD CONSTRAINT "Masters_masterCategoryId_fkey" FOREIGN KEY ("masterCategoryId") REFERENCES "MasterCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterService" ADD CONSTRAINT "MasterService_masterCategoryId_fkey" FOREIGN KEY ("masterCategoryId") REFERENCES "MasterCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

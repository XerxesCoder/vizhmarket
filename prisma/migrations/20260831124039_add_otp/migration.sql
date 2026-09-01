/*
  Warnings:

  - A unique constraint covering the columns `[zarinpalref]` on the table `StoreOrder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[zarinpalauth]` on the table `StoreOrder` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "StoreOrder" ADD COLUMN     "note" TEXT,
ADD COLUMN     "zarinpalauth" TEXT,
ADD COLUMN     "zarinpalref" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "OtpToken" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OtpToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OtpToken_phone_key" ON "OtpToken"("phone");

-- CreateIndex
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_isActive_idx" ON "Product"("isActive");

-- CreateIndex
CREATE INDEX "Product_categoryId_isActive_idx" ON "Product"("categoryId", "isActive");

-- CreateIndex
CREATE INDEX "Product_isExpress_idx" ON "Product"("isExpress");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE INDEX "ProductVariant_isDefault_idx" ON "ProductVariant"("isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "StoreOrder_zarinpalref_key" ON "StoreOrder"("zarinpalref");

-- CreateIndex
CREATE UNIQUE INDEX "StoreOrder_zarinpalauth_key" ON "StoreOrder"("zarinpalauth");

-- CreateIndex
CREATE INDEX "StoreOrder_userId_idx" ON "StoreOrder"("userId");

-- CreateIndex
CREATE INDEX "StoreOrder_status_idx" ON "StoreOrder"("status");

-- CreateIndex
CREATE INDEX "StoreOrder_customerPhone_idx" ON "StoreOrder"("customerPhone");

-- CreateIndex
CREATE INDEX "StoreOrderItem_orderId_idx" ON "StoreOrderItem"("orderId");

-- CreateIndex
CREATE INDEX "StoreOrderItem_productId_idx" ON "StoreOrderItem"("productId");

-- CreateIndex
CREATE INDEX "StoreOrderItem_variantId_idx" ON "StoreOrderItem"("variantId");

-- CreateIndex
CREATE INDEX "VariantAttribute_variantId_idx" ON "VariantAttribute"("variantId");

-- CreateIndex
CREATE INDEX "VariantAttribute_key_value_idx" ON "VariantAttribute"("key", "value");

-- CreateIndex
CREATE INDEX "WebOrder_userId_idx" ON "WebOrder"("userId");

-- CreateIndex
CREATE INDEX "WebOrder_status_idx" ON "WebOrder"("status");

-- CreateIndex
CREATE INDEX "WebOrder_customerPhone_idx" ON "WebOrder"("customerPhone");

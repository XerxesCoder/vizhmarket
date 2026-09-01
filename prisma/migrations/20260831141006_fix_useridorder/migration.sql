/*
  Warnings:

  - The primary key for the `StoreOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customerEmail` on the `StoreOrder` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `StoreOrder` table. All the data in the column will be lost.
  - You are about to drop the column `customerPhone` on the `StoreOrder` table. All the data in the column will be lost.
  - The `id` column on the `StoreOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `customerEmail` on the `WebOrder` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `WebOrder` table. All the data in the column will be lost.
  - You are about to drop the column `customerPhone` on the `WebOrder` table. All the data in the column will be lost.
  - Changed the type of `orderId` on the `StoreOrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "StoreOrderItem" DROP CONSTRAINT "StoreOrderItem_orderId_fkey";

-- DropIndex
DROP INDEX "StoreOrder_customerPhone_idx";

-- DropIndex
DROP INDEX "WebOrder_customerPhone_idx";

-- AlterTable
ALTER TABLE "StoreOrder" DROP CONSTRAINT "StoreOrder_pkey",
DROP COLUMN "customerEmail",
DROP COLUMN "customerName",
DROP COLUMN "customerPhone",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "StoreOrder_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "StoreOrderItem" DROP COLUMN "orderId",
ADD COLUMN     "orderId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WebOrder" DROP COLUMN "customerEmail",
DROP COLUMN "customerName",
DROP COLUMN "customerPhone";

-- CreateIndex
CREATE INDEX "StoreOrderItem_orderId_idx" ON "StoreOrderItem"("orderId");

-- AddForeignKey
ALTER TABLE "StoreOrderItem" ADD CONSTRAINT "StoreOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "StoreOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

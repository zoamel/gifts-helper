/*
  Warnings:

  - You are about to drop the column `name` on the `Wishlist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ownerId]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_wishlistId_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_ownerId_fkey";

-- AlterTable
ALTER TABLE "Wishlist" DROP COLUMN "name";

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_ownerId_key" ON "Wishlist"("ownerId");

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

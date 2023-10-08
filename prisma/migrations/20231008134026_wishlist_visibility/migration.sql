-- CreateEnum
CREATE TYPE "WishlistVisiblityStatus" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Wishlist" ADD COLUMN     "visibility" "WishlistVisiblityStatus" NOT NULL DEFAULT 'PRIVATE';

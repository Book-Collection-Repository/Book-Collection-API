/*
  Warnings:

  - You are about to drop the column `createCollectionId` on the `Historic` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Historic" DROP CONSTRAINT "Historic_bookId_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "Historic" DROP CONSTRAINT "Historic_createCollectionId_fkey";

-- AlterTable
ALTER TABLE "Historic" DROP COLUMN "createCollectionId";

-- AddForeignKey
ALTER TABLE "Historic" ADD CONSTRAINT "Historic_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historic" ADD CONSTRAINT "Historic_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

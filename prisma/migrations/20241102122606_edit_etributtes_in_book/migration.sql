-- DropForeignKey
ALTER TABLE "BookCollection" DROP CONSTRAINT "BookCollection_bookId_fkey";

-- AddForeignKey
ALTER TABLE "BookCollection" ADD CONSTRAINT "BookCollection_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

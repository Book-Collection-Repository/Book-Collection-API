-- CreateEnum
CREATE TYPE "TypeComplaint" AS ENUM ('COMMENT', 'AVALIATION', 'PUBLICATION', 'READING_DIARY');

-- CreateEnum
CREATE TYPE "TypeHistoric" AS ENUM ('ENJOY', 'COMMENT', 'COMPLAINT', 'AVALIATION', 'BOOK_COLLECTION', 'CREATE_COLLECTION');

-- CreateTable
CREATE TABLE "Historic" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TypeHistoric" NOT NULL,
    "bookId" TEXT,
    "collectionId" TEXT,
    "createCollectionId" TEXT,
    "publicationId" TEXT,
    "avaliationId" TEXT,
    "complaintId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Historic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TypeComplaint" NOT NULL,
    "text" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Historic" ADD CONSTRAINT "Historic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historic" ADD CONSTRAINT "Historic_bookId_collectionId_fkey" FOREIGN KEY ("bookId", "collectionId") REFERENCES "BookCollection"("bookId", "collectionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historic" ADD CONSTRAINT "Historic_createCollectionId_fkey" FOREIGN KEY ("createCollectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historic" ADD CONSTRAINT "Historic_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historic" ADD CONSTRAINT "Historic_avaliationId_fkey" FOREIGN KEY ("avaliationId") REFERENCES "Avaliation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historic" ADD CONSTRAINT "Historic_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

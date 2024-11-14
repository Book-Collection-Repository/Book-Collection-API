/*
  Warnings:

  - A unique constraint covering the columns `[defaultType,userId]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Collection_defaultType_key";

-- CreateIndex
CREATE UNIQUE INDEX "Collection_defaultType_userId_key" ON "Collection"("defaultType", "userId");

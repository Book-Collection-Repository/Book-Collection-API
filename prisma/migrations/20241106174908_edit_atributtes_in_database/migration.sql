/*
  Warnings:

  - The `visibility` column on the `Collection` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[defaultType]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EntityVisibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "visibility",
ADD COLUMN     "visibility" "EntityVisibility" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "ReadingDiary" ADD COLUMN     "visibility" "EntityVisibility" NOT NULL DEFAULT 'PRIVATE';

-- CreateIndex
CREATE UNIQUE INDEX "Collection_defaultType_key" ON "Collection"("defaultType");

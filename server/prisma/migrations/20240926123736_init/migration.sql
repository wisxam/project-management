/*
  Warnings:

  - You are about to drop the column `uploadedByUserId` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `assigneeUserId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `uploadedById` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_uploadedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assigneeUserId_fkey";

-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "uploadedByUserId",
ADD COLUMN     "uploadedById" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "assigneeUserId",
ADD COLUMN     "assignedUserId" INTEGER;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

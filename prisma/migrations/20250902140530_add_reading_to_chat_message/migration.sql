/*
  Warnings:

  - You are about to drop the column `reading` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "reading";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "reading" TEXT;

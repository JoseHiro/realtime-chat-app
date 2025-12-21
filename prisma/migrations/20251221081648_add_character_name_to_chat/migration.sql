/*
  Warnings:

  - You are about to drop the `UsageEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsageEvent" DROP CONSTRAINT "UsageEvent_chatId_fkey";

-- DropForeignKey
ALTER TABLE "UsageEvent" DROP CONSTRAINT "UsageEvent_userId_fkey";

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "characterName" TEXT;

-- DropTable
DROP TABLE "UsageEvent";

-- DropEnum
DROP TYPE "ApiType";

-- DropEnum
DROP TYPE "EventStatus";

-- DropEnum
DROP TYPE "Provider";

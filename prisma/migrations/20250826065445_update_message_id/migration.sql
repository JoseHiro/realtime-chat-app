/*
  Warnings:

  - You are about to drop the column `message` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "message",
ADD COLUMN     "title" TEXT;

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "chatId" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

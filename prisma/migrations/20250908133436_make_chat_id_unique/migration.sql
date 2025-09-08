/*
  Warnings:

  - A unique constraint covering the columns `[chatId]` on the table `Analysis` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Analysis_chatId_key" ON "Analysis"("chatId");

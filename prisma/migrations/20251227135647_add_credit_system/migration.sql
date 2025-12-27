-- CreateEnum
CREATE TYPE "CreditTransactionType" AS ENUM ('ALLOCATION', 'USAGE', 'TOPUP', 'REFUND', 'ADJUSTMENT');

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "creditsUsed" INTEGER,
ADD COLUMN     "voiceProvider" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "creditsRemaining" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastCreditResetAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "CreditTransaction" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "chatId" INTEGER,
    "type" "CreditTransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreditTransaction_userId_createdAt_idx" ON "CreditTransaction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CreditTransaction_chatId_idx" ON "CreditTransaction"("chatId");

-- CreateIndex
CREATE INDEX "CreditTransaction_type_idx" ON "CreditTransaction"("type");

-- CreateIndex
CREATE INDEX "CreditTransaction_createdAt_idx" ON "CreditTransaction"("createdAt");

-- AddForeignKey
ALTER TABLE "CreditTransaction" ADD CONSTRAINT "CreditTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditTransaction" ADD CONSTRAINT "CreditTransaction_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('OPENAI', 'AZURE', 'ELEVENLABS');

-- CreateEnum
CREATE TYPE "ApiType" AS ENUM ('CHAT', 'SUMMARY', 'TTS', 'STT', 'READING_TRANSLATION');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('SUCCESS', 'ERROR', 'TIMEOUT', 'RATE_LIMITED');

-- CreateTable
CREATE TABLE "UsageEvent" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "chatId" INTEGER,
    "provider" "Provider" NOT NULL,
    "apiType" "ApiType" NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'SUCCESS',
    "model" TEXT,
    "voice" TEXT,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "characters" INTEGER,
    "audioSeconds" INTEGER,
    "costUsd" DECIMAL(10,6) NOT NULL,
    "requestId" TEXT,
    "responseTime" INTEGER,
    "messageCount" INTEGER,
    "errorCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UsageEvent_userId_createdAt_idx" ON "UsageEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "UsageEvent_chatId_idx" ON "UsageEvent"("chatId");

-- CreateIndex
CREATE INDEX "UsageEvent_provider_apiType_idx" ON "UsageEvent"("provider", "apiType");

-- CreateIndex
CREATE INDEX "UsageEvent_createdAt_idx" ON "UsageEvent"("createdAt");

-- CreateIndex
CREATE INDEX "UsageEvent_status_idx" ON "UsageEvent"("status");

-- AddForeignKey
ALTER TABLE "UsageEvent" ADD CONSTRAINT "UsageEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageEvent" ADD CONSTRAINT "UsageEvent_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/**
 * Utility to log usage events to the database
 * Handles all API call tracking with proper error handling
 */

import { PrismaClient, Provider, ApiType, EventStatus } from "@prisma/client";
import {
  calculateOpenAICost,
  calculateAzureTTSCost,
  calculateElevenLabsCost,
} from "./calculateCost";

const prisma = new PrismaClient();

export interface LogOpenAIEventParams {
  userId: string;
  chatId?: number;
  apiType: ApiType;
  model: string;
  inputTokens: number;
  outputTokens: number;
  messageCount?: number;
  status?: EventStatus;
  errorCode?: string;
  requestId?: string;
  responseTime?: number;
}

export interface LogTTSEventParams {
  userId: string;
  chatId?: number;
  provider: "AZURE" | "ELEVENLABS";
  voice: string;
  characters: number;
  audioSeconds?: number;
  status?: EventStatus;
  errorCode?: string;
  requestId?: string;
  responseTime?: number;
}

/**
 * Log an OpenAI API call event
 */
export async function logOpenAIEvent(
  params: LogOpenAIEventParams
): Promise<void> {
  try {
    const cost = calculateOpenAICost(params.inputTokens, params.outputTokens);

    await prisma.usageEvent.create({
      data: {
        userId: params.userId,
        chatId: params.chatId,
        provider: Provider.OPENAI,
        apiType: params.apiType,
        status: params.status || EventStatus.SUCCESS,
        model: params.model,
        inputTokens: params.inputTokens,
        outputTokens: params.outputTokens,
        costUsd: cost,
        messageCount: params.messageCount,
        errorCode: params.errorCode,
        requestId: params.requestId,
        responseTime: params.responseTime,
      },
    });
  } catch (error) {
    // Log error but don't throw - we don't want to break the main flow
    console.error("Failed to log OpenAI usage event:", error);
  }
}

/**
 * Log a TTS API call event (Azure or ElevenLabs)
 */
export async function logTTSEvent(params: LogTTSEventParams): Promise<void> {
  try {
    const cost =
      params.provider === "AZURE"
        ? calculateAzureTTSCost(params.characters)
        : calculateElevenLabsCost(params.characters);

    await prisma.usageEvent.create({
      data: {
        userId: params.userId,
        chatId: params.chatId,
        provider: params.provider === "AZURE" ? Provider.AZURE : Provider.ELEVENLABS,
        apiType: ApiType.TTS,
        status: params.status || EventStatus.SUCCESS,
        voice: params.voice,
        characters: params.characters,
        audioSeconds: params.audioSeconds,
        costUsd: cost,
        errorCode: params.errorCode,
        requestId: params.requestId,
        responseTime: params.responseTime,
      },
    });
  } catch (error) {
    // Log error but don't throw - we don't want to break the main flow
    console.error("Failed to log TTS usage event:", error);
  }
}

/**
 * Log a failed API call event
 */
export async function logFailedEvent(
  userId: string,
  chatId: number | undefined,
  provider: Provider,
  apiType: ApiType,
  errorCode: string,
  errorMessage?: string
): Promise<void> {
  try {
    await prisma.usageEvent.create({
      data: {
        userId,
        chatId,
        provider,
        apiType,
        status: EventStatus.ERROR,
        errorCode,
        costUsd: 0, // Failed calls typically don't cost, but track them anyway
      },
    });
  } catch (error) {
    console.error("Failed to log error event:", error);
  }
}

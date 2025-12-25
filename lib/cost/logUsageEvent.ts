/**
 * Utility to log usage events to the database
 * Handles all API call tracking with proper error handling
 */

import { PrismaClient } from "@prisma/client";
import { Provider, ApiType, EventStatus } from "./constants";
import type {
  Provider as ProviderType,
  ApiType as ApiTypeType,
  EventStatus as EventStatusType,
} from "./constants";
import {
  calculateOpenAICost,
  calculateAzureTTSCost,
  calculateElevenLabsCost,
} from "./calculateCost";

const prisma = new PrismaClient() as PrismaClient & {
  usageEvent: {
    create: (args: any) => Promise<any>;
    findMany: (args?: any) => Promise<any>;
    findUnique: (args: any) => Promise<any>;
    count: (args?: any) => Promise<number>;
  };
};

export interface LogOpenAIEventParams {
  userId: string;
  chatId?: number;
  apiType: ApiTypeType;
  model: string;
  inputTokens: number;
  outputTokens: number;
  messageCount?: number;
  status?: EventStatusType;
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
  status?: EventStatusType;
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

    console.log(`[Usage Tracking] Logging OpenAI event:`, {
      userId: params.userId,
      chatId: params.chatId,
      apiType: params.apiType,
      inputTokens: params.inputTokens,
      outputTokens: params.outputTokens,
      cost: cost,
    });

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

    console.log(`[Usage Tracking] Successfully logged OpenAI event`);
  } catch (error: any) {
    // Log error but don't throw - we don't want to break the main flow
    console.error("Failed to log OpenAI usage event:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
    });
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

    console.log(`[Usage Tracking] Logging TTS event:`, {
      userId: params.userId,
      chatId: params.chatId,
      provider: params.provider,
      characters: params.characters,
      cost: cost,
    });

    await prisma.usageEvent.create({
      data: {
        userId: params.userId,
        chatId: params.chatId,
        provider:
          params.provider === "AZURE" ? Provider.AZURE : Provider.ELEVENLABS,
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

    console.log(`[Usage Tracking] Successfully logged TTS event`);
  } catch (error: any) {
    // Log error but don't throw - we don't want to break the main flow
    console.error("Failed to log TTS usage event:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
    });
  }
}

/**
 * Log a failed API call event
 */
export async function logFailedEvent(
  userId: string,
  chatId: number | undefined,
  provider: ProviderType,
  apiType: ApiTypeType,
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

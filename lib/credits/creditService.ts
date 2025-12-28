/**
 * Credit management service
 * Handles credit allocation, deduction, and transaction logging
 */

import { PrismaClient, CreditTransactionType } from "@prisma/client";
import { calculateCreditsForChat, type VoiceProvider } from "./calculateCredits";
import { getMonthlyCreditAllocation } from "./calculateCredits";

const prisma = new PrismaClient();

/**
 * Check if user has enough credits for a chat
 */
export async function hasEnoughCredits(
  userId: string,
  durationMinutes: number,
  voiceProvider: VoiceProvider
): Promise<{ hasEnough: boolean; required: number; current: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditsRemaining: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const required = calculateCreditsForChat(durationMinutes, voiceProvider);
  const current = user.creditsRemaining;

  return {
    hasEnough: current >= required,
    required,
    current,
  };
}

/**
 * Deduct credits for a chat usage
 * Creates a USAGE transaction and updates user's credit balance
 */
export async function deductCreditsForChat(
  userId: string,
  chatId: number,
  durationMinutes: number,
  voiceProvider: VoiceProvider
): Promise<{ success: boolean; creditsDeducted: number; newBalance: number }> {
  const creditsRequired = calculateCreditsForChat(durationMinutes, voiceProvider);

  // Get current user balance
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditsRemaining: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const currentBalance = user.creditsRemaining;
  const newBalance = currentBalance - creditsRequired;

  // Use transaction to ensure atomicity
  const result = await prisma.$transaction(async (tx) => {
    // Update user's credit balance
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { creditsRemaining: newBalance },
      select: { creditsRemaining: true },
    });

    // Create credit transaction record
    const transaction = await tx.creditTransaction.create({
      data: {
        userId,
        chatId,
        type: CreditTransactionType.USAGE,
        amount: -creditsRequired, // Negative for deduction
        balanceAfter: newBalance,
        description: `${durationMinutes}min ${voiceProvider} chat`,
      },
    });

    // Update chat with credits used and voice provider
    await tx.chat.update({
      where: { id: chatId },
      data: {
        creditsUsed: creditsRequired,
        voiceProvider: voiceProvider,
      },
    });

    return { transaction, updatedUser };
  });

  return {
    success: true,
    creditsDeducted: creditsRequired,
    newBalance: result.updatedUser.creditsRemaining,
  };
}

/**
 * Allocate monthly credits to a user
 * Should be called when subscription is activated/renewed
 */
export async function allocateMonthlyCredits(
  userId: string,
  plan: string | null
): Promise<{ success: boolean; creditsAllocated: number; newBalance: number }> {
  const creditsToAllocate = getMonthlyCreditAllocation(plan);

  if (creditsToAllocate <= 0) {
    return {
      success: false,
      creditsAllocated: 0,
      newBalance: 0,
    };
  }

  // Get current user balance
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditsRemaining: true, lastCreditResetAt: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const currentBalance = user.creditsRemaining;
  const newBalance = currentBalance + creditsToAllocate;

  // Use transaction to ensure atomicity
  const result = await prisma.$transaction(async (tx) => {
    // Update user's credit balance and reset timestamp
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        creditsRemaining: newBalance,
        lastCreditResetAt: new Date(),
      },
      select: { creditsRemaining: true },
    });

    // Create credit transaction record
    await tx.creditTransaction.create({
      data: {
        userId,
        type: CreditTransactionType.ALLOCATION,
        amount: creditsToAllocate,
        balanceAfter: newBalance,
        description: `Monthly ${plan} plan allocation`,
      },
    });

    return { updatedUser };
  });

  return {
    success: true,
    creditsAllocated: creditsToAllocate,
    newBalance: result.updatedUser.creditsRemaining,
  };
}

/**
 * Check if monthly credits should be allocated (new month since last reset)
 */
export async function shouldAllocateMonthlyCredits(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastCreditResetAt: true, subscriptionPlan: true, subscriptionStatus: true },
  });

  if (!user) {
    return false;
  }

  // Only allocate if subscription is active
  if (user.subscriptionStatus !== "active") {
    return false;
  }

  // Only allocate for pro/premium plans
  if (user.subscriptionPlan !== "pro" && user.subscriptionPlan !== "premium") {
    return false;
  }

  // If never reset, allocate
  if (!user.lastCreditResetAt) {
    return true;
  }

  // Check if it's a new month
  const lastReset = new Date(user.lastCreditResetAt);
  const now = new Date();

  // Check if month or year has changed
  const isNewMonth =
    now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();

  return isNewMonth;
}

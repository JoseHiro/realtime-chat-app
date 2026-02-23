/**
 * Calculate credits required for a chat based on duration and voice provider
 */

export type VoiceProvider = "azure" | "elevenlabs" | "realtime";

/**
 * Calculate credits required for a chat
 * @param durationMinutes - Duration of the chat (3, 5, or 10 minutes)
 * @param voiceProvider - Voice provider ("azure", "elevenlabs", or "realtime")
 * @returns Number of credits required
 */
export function calculateCreditsForChat(
  durationMinutes: number,
  voiceProvider: VoiceProvider
): number {
  const creditMap: Record<VoiceProvider, Record<number, number>> = {
    azure: {
      3: 4,
      5: 7,
      10: 11,
    },
    elevenlabs: {
      3: 5,
      5: 9,
      10: 14,
    },
    realtime: {
      3: 6, // Slightly higher than elevenlabs due to premium realtime features
      5: 10,
      10: 16,
    },
  };

  const credits = creditMap[voiceProvider]?.[durationMinutes];
  if (credits === undefined) {
    throw new Error(
      `Invalid combination: ${durationMinutes}min + ${voiceProvider}. Supported: 3min, 5min, 10min with azure, elevenlabs, or realtime`
    );
  }

  return credits;
}

/**
 * Get monthly credit allocation based on subscription plan
 * @param plan - Subscription plan ("pro", "premium", "trial", "free", or null)
 * @returns Number of credits allocated per month
 */
export function getMonthlyCreditAllocation(
  plan: string | null | undefined
): number {
  switch (plan) {
    case "pro":
      return 280;
    case "premium":
      return 480;
    case "trial":
    case "free":
    default:
      return 0; // Free/trial users don't get monthly credits
  }
}

/**
 * Map character names to voice providers for credit calculation
 */

import type { CharacterName } from "../../lib/voice/voiceMapping";
import { getVoiceProvider } from "../../lib/voice/voiceMapping";
import { calculateCreditsForChat, type VoiceProvider } from "./calculateCredits";

/**
 * Calculate credits required for a chat based on duration and character
 * @param durationMinutes - Duration of the chat (3, 5, or 10 minutes)
 * @param characterName - Character name
 * @returns Number of credits required
 */
export function calculateCreditsForCharacter(
  durationMinutes: number,
  characterName: CharacterName
): number {
  const voiceProvider = getVoiceProvider(characterName);
  return calculateCreditsForChat(durationMinutes, voiceProvider);
}

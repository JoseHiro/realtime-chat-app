/**
 * Cost calculation utilities for API usage tracking
 * Pricing as of 2024
 */

// OpenAI GPT-4o-mini pricing (per 1M tokens)
const OPENAI_INPUT_COST_PER_1M = 0.15;
const OPENAI_OUTPUT_COST_PER_1M = 0.6;

// Azure TTS pricing (per 1M characters)
const AZURE_TTS_COST_PER_1M_CHARS = 16.0;

// ElevenLabs pricing (per 1M characters)
// Note: ElevenLabs pricing varies by plan, using approximate rate
const ELEVENLABS_COST_PER_1M_CHARS = 18.0; // Approximate, adjust based on your plan

/**
 * Calculate OpenAI API cost based on input and output tokens
 */
export function calculateOpenAICost(
  inputTokens: number,
  outputTokens: number
): number {
  const inputCost = (inputTokens / 1_000_000) * OPENAI_INPUT_COST_PER_1M;
  const outputCost = (outputTokens / 1_000_000) * OPENAI_OUTPUT_COST_PER_1M;
  return inputCost + outputCost;
}

/**
 * Calculate Azure TTS cost based on character count
 */
export function calculateAzureTTSCost(characters: number): number {
  return (characters / 1_000_000) * AZURE_TTS_COST_PER_1M_CHARS;
}

/**
 * Calculate ElevenLabs TTS cost based on character count
 */
export function calculateElevenLabsCost(characters: number): number {
  return (characters / 1_000_000) * ELEVENLABS_COST_PER_1M_CHARS;
}

/**
 * Calculate total cost for multiple services
 */
export function calculateTotalCost(
  inputTokens: number,
  outputTokens: number,
  azureChars: number = 0,
  elevenLabsChars: number = 0
): number {
  return (
    calculateOpenAICost(inputTokens, outputTokens) +
    calculateAzureTTSCost(azureChars) +
    calculateElevenLabsCost(elevenLabsChars)
  );
}

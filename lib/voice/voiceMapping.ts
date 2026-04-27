/**
 * Maps voice gender to character name and Azure TTS voice name
 */

export type VoiceGender = "male" | "female";
export type CharacterName = "Sakura" | "Ken" | "Haruki";

interface VoiceConfig {
  characterName: CharacterName;
  azureVoiceName: string;
  azureVoiceGender: "Male" | "Female";
  voiceProvider: "azure" | "elevenlabs" | "realtime"; // Which TTS provider this character uses
  elevenLabsVoiceId?: string; // ElevenLabs voice ID for premium characters
  realtimeVoice?: string; // Realtime API voice name (alloy, echo, shimmer, etc.)
  description: string;
  gender: VoiceGender;
  imageUrl?: string; // Character icon/image URL
}

const VOICE_MAP: Record<CharacterName, VoiceConfig> = {
  Sakura: {
    characterName: "Sakura",
    azureVoiceName: "ja-JP-NanamiNeural",
    azureVoiceGender: "Female",
    voiceProvider: "realtime",
    realtimeVoice: "Aoede",
    description: "Natural, warm, and friendly",
    gender: "female",
  },
  Ken: {
    characterName: "Ken",
    azureVoiceName: "ja-JP-KeitaNeural",
    azureVoiceGender: "Male",
    voiceProvider: "realtime",
    realtimeVoice: "Fenrir",
    description: "Clear, confident, and professional",
    gender: "male",
  },
  Haruki: {
    characterName: "Haruki",
    azureVoiceName: "ja-JP-KeitaNeural",
    azureVoiceGender: "Male",
    voiceProvider: "realtime",
    realtimeVoice: "Charon",
    description: "Warm and expressive",
    gender: "male",
    imageUrl: "/img/haruki.jpg",
  },
};

// Legacy mapping for backward compatibility
const VOICE_GENDER_MAP: Record<VoiceGender, CharacterName> = {
  female: "Sakura",
  male: "Ken",
};

/**
 * Get character name and voice configuration from voice gender (legacy)
 */
export function getVoiceConfig(voiceGender: VoiceGender): VoiceConfig {
  const characterName = VOICE_GENDER_MAP[voiceGender];
  return VOICE_MAP[characterName];
}

/**
 * Get character name from voice gender (legacy)
 */
export function getCharacterName(voiceGender: VoiceGender): CharacterName {
  return VOICE_GENDER_MAP[voiceGender];
}

/**
 * Get voice configuration from character name
 */
export function getVoiceConfigByCharacter(
  characterName: CharacterName
): VoiceConfig {
  return VOICE_MAP[characterName];
}

/**
 * Get Azure voice name from character name
 */
export function getAzureVoiceName(characterName: CharacterName): string {
  const config = VOICE_MAP[characterName];
  return config?.azureVoiceName || VOICE_MAP.Sakura.azureVoiceName;
}

/**
 * Get Azure voice gender from character name
 */
export function getAzureVoiceGender(
  characterName: CharacterName
): "Male" | "Female" {
  const config = VOICE_MAP[characterName];
  return config?.azureVoiceGender || "Female";
}

/**
 * Get voice provider (azure, elevenlabs, or realtime) from character name
 */
export function getVoiceProvider(
  characterName: CharacterName
): "azure" | "elevenlabs" | "realtime" {
  const config = VOICE_MAP[characterName];
  return config?.voiceProvider || "realtime";
}

/**
 * Get Realtime API voice name from character name
 */
export function getRealtimeVoice(characterName: CharacterName): string {
  const config = VOICE_MAP[characterName];
  return config?.realtimeVoice || "Aoede";
}

/**
 * Get ElevenLabs voice ID from character name
 */
export function getElevenLabsVoiceId(
  characterName: CharacterName
): string | undefined {
  const config = VOICE_MAP[characterName];
  return config?.elevenLabsVoiceId;
}

/**
 * Get character image URL from character name
 */
export function getCharacterImageUrl(
  characterName: CharacterName
): string | undefined {
  const config = VOICE_MAP[characterName];
  return config?.imageUrl;
}

/**
 * Get all characters
 */
export function getAllCharacters(): VoiceConfig[] {
  return Object.values(VOICE_MAP);
}

/**
 * Get characters by provider
 */
export function getCharactersByProvider(
  provider: "azure" | "elevenlabs"
): VoiceConfig[] {
  return Object.values(VOICE_MAP).filter((c) => c.voiceProvider === provider);
}

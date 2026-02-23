/**
 * Maps voice gender to character name and Azure TTS voice name
 */

export type VoiceGender = "male" | "female";
export type CharacterName =
  | "Sakura"
  | "Ken"
  | "Chica"
  | "Haruki"
  | "Aiko"
  | "Ryo";

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
    voiceProvider: "realtime", // Using Realtime API now
    realtimeVoice: "shimmer", // Soft, warm voice matching her friendly nature
    description: "Natural, warm, and friendly",
    gender: "female",
  },
  Ken: {
    characterName: "Ken",
    azureVoiceName: "ja-JP-KeitaNeural",
    azureVoiceGender: "Male",
    voiceProvider: "realtime", // Using Realtime API now
    realtimeVoice: "echo", // Clear, professional voice matching his confident style
    description: "Clear, confident, and professional",
    gender: "male",
  },
  Chica: {
    characterName: "Chica",
    azureVoiceName: "ja-JP-NanamiNeural", // Fallback, but uses ElevenLabs
    azureVoiceGender: "Female",
    voiceProvider: "realtime", // Using Realtime API now
    realtimeVoice: "coral", // Bright, energetic voice matching her cheerful personality
    elevenLabsVoiceId: "JTlYtJrcTzPC71hMLOxo", // Keep for reference
    description: "Energetic and cheerful with premium sound",
    gender: "female",
    imageUrl: "/img/chica.jpg",
  },
  Haruki: {
    characterName: "Haruki",
    azureVoiceName: "ja-JP-KeitaNeural", // Fallback, but uses ElevenLabs
    azureVoiceGender: "Male",
    voiceProvider: "realtime", // Using Realtime API now
    realtimeVoice: "sage", // Calm, thoughtful voice matching his warm style
    elevenLabsVoiceId: "hBWDuZMNs32sP5dKzMuc", // Keep for reference
    description: "Warm and expressive with premium sound",
    gender: "male",
    imageUrl: "/img/haruki.jpg",
  },
  Aiko: {
    characterName: "Aiko",
    azureVoiceName: "ja-JP-AoiNeural", // Different Azure fallback voice to distinguish from Sakura
    azureVoiceGender: "Female",
    voiceProvider: "realtime", // Using Realtime API now
    realtimeVoice: "verse", // Expressive, dynamic voice matching her gentle nature
    elevenLabsVoiceId: "WQz3clzUdMqvBf0jswZQ", // Keep for reference
    description: "Gentle and soothing with premium sound",
    gender: "female",
    imageUrl: "/img/Aiko.jpg",
  },
  Ryo: {
    characterName: "Ryo",
    azureVoiceName: "ja-JP-KeitaNeural", // Fallback, but uses ElevenLabs
    azureVoiceGender: "Male",
    voiceProvider: "realtime", // Using Realtime API now
    realtimeVoice: "ash", // Deep, resonant voice matching his dynamic style
    elevenLabsVoiceId: "8QgNyYugQ07X0LFdMABE", // Keep for reference
    description: "Dynamic and engaging with premium sound",
    gender: "male",
    imageUrl: "/img/Ryo.jpg",
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
  return config?.realtimeVoice || "alloy"; // Default to alloy if not specified
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

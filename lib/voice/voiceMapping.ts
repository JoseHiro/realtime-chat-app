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
  voiceProvider: "azure" | "elevenlabs"; // Which TTS provider this character uses
  elevenLabsVoiceId?: string; // ElevenLabs voice ID for premium characters
  description: string;
  gender: VoiceGender;
  imageUrl?: string; // Character icon/image URL
}

const VOICE_MAP: Record<CharacterName, VoiceConfig> = {
  Sakura: {
    characterName: "Sakura",
    azureVoiceName: "ja-JP-NanamiNeural",
    azureVoiceGender: "Female",
    voiceProvider: "azure",
    description: "Natural, warm, and friendly",
    gender: "female",
  },
  Ken: {
    characterName: "Ken",
    azureVoiceName: "ja-JP-KeitaNeural",
    azureVoiceGender: "Male",
    voiceProvider: "azure",
    description: "Clear, confident, and professional",
    gender: "male",
  },
  Chica: {
    characterName: "Chica",
    azureVoiceName: "ja-JP-NanamiNeural", // Fallback, but uses ElevenLabs
    azureVoiceGender: "Female",
    voiceProvider: "elevenlabs",
    elevenLabsVoiceId: "JTlYtJrcTzPC71hMLOxo", // Japanese voice for Chica
    description: "Energetic and cheerful with premium sound",
    gender: "female",
    imageUrl: "/img/chica.jpg",
  },
  Haruki: {
    characterName: "Haruki",
    azureVoiceName: "ja-JP-KeitaNeural", // Fallback, but uses ElevenLabs
    azureVoiceGender: "Male",
    voiceProvider: "elevenlabs",
    elevenLabsVoiceId: "hBWDuZMNs32sP5dKzMuc", // Japanese voice for Haruki
    description: "Warm and expressive with premium sound",
    gender: "male",
    imageUrl: "/img/haruki.jpg",
  },
  Aiko: {
    characterName: "Aiko",
    azureVoiceName: "ja-JP-AoiNeural", // Different Azure fallback voice to distinguish from Sakura
    azureVoiceGender: "Female",
    voiceProvider: "elevenlabs",
    elevenLabsVoiceId: "WQz3clzUdMqvBf0jswZQ", // Japanese voice for Aiko
    description: "Gentle and soothing with premium sound",
    gender: "female",
    imageUrl: "/img/Aiko.jpg",
  },
  Ryo: {
    characterName: "Ryo",
    azureVoiceName: "ja-JP-KeitaNeural", // Fallback, but uses ElevenLabs
    azureVoiceGender: "Male",
    voiceProvider: "elevenlabs",
    elevenLabsVoiceId: "8QgNyYugQ07X0LFdMABE", // Japanese voice for Ryo
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
 * Get voice provider (azure or elevenlabs) from character name
 */
export function getVoiceProvider(
  characterName: CharacterName
): "azure" | "elevenlabs" {
  const config = VOICE_MAP[characterName];
  return config?.voiceProvider || "azure";
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
